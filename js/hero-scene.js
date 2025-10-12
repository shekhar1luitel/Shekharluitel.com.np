(() => {
  const MODEL_URL = 'https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb';

  const initHeroScene = () => {
    const wrapper = document.querySelector('.hero-canvas-wrapper');
    const canvas = document.getElementById('hero-canvas');

    if (!wrapper || !canvas || typeof THREE === 'undefined' || typeof THREE.GLTFLoader === 'undefined') {
      return;
    }

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (error) {
      console.warn('WebGL renderer unavailable', error);
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    if ('outputColorSpace' in renderer) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    } else if ('outputEncoding' in renderer) {
      renderer.outputEncoding = THREE.sRGBEncoding;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070f, 0.12);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
    camera.position.set(0, 1.4, 6);
    scene.add(camera);

    const ambient = new THREE.HemisphereLight(0x8ca9ff, 0x050713, 0.85);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xa8d2ff, 0.95);
    keyLight.position.set(3.4, 6.8, 6.2);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x4ecaff, 1.2, 18);
    fillLight.position.set(-4.2, 3.4, -3.6);
    scene.add(fillLight);

    const rimLight = new THREE.SpotLight(0x6f87ff, 1.35, 25, Math.PI / 5.5, 0.65);
    rimLight.position.set(-3.6, 6.5, 4.6);
    scene.add(rimLight);

    const root = new THREE.Group();
    scene.add(root);

    const stageGroup = new THREE.Group();
    stageGroup.rotation.set(0.25, 0, 0);
    root.add(stageGroup);

    const portalMaterial = new THREE.MeshBasicMaterial({
      color: 0x6f8cff,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const portal = new THREE.Mesh(new THREE.RingGeometry(2.1, 3.3, 120), portalMaterial);
    portal.rotation.x = Math.PI / 2;
    portal.position.y = -1.05;
    stageGroup.add(portal);

    const portalSecondary = portal.clone();
    portalSecondary.scale.setScalar(0.82);
    portalSecondary.material = portalMaterial.clone();
    portalSecondary.material.opacity = 0.22;
    portalSecondary.position.y = -0.98;
    portalSecondary.rotation.x = Math.PI / 2.2;
    stageGroup.add(portalSecondary);

    const stageBase = new THREE.Mesh(
      new THREE.CircleGeometry(3.2, 120),
      new THREE.MeshStandardMaterial({
        color: 0x0b1126,
        metalness: 0.4,
        roughness: 0.6,
        transparent: true,
        opacity: 0.92,
        emissive: 0x0f1f3a,
        emissiveIntensity: 0.5,
      })
    );
    stageBase.rotation.x = -Math.PI / 2;
    stageBase.position.y = -1.05;
    stageGroup.add(stageBase);

    const beam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.9, 5, 32, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0x4ecaff,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      })
    );
    beam.position.y = 1.2;
    stageGroup.add(beam);

    const rings = [];
    for (let i = 0; i < 3; i += 1) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(2.4 + i * 0.4, 0.05, 80, 200),
        new THREE.MeshBasicMaterial({
          color: 0x4ecaff,
          transparent: true,
          opacity: 0.18 + i * 0.06,
          blending: THREE.AdditiveBlending,
        })
      );
      ring.rotation.x = Math.PI / (2.4 - i * 0.25);
      stageGroup.add(ring);
      rings.push(ring);
    }

    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 620;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      const radius = 3 + Math.random() * 7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi) * 0.7;
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.08,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const stars = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(stars);

    const accentGroup = new THREE.Group();
    stageGroup.add(accentGroup);
    const accentGeometry = new THREE.IcosahedronGeometry(0.16, 0);
    const accentMaterial = new THREE.MeshStandardMaterial({
      color: 0x7fb0ff,
      emissive: 0x123574,
      emissiveIntensity: 0.9,
      metalness: 0.45,
      roughness: 0.35,
    });

    const orbiters = [];
    for (let i = 0; i < 6; i += 1) {
      const orbiter = new THREE.Object3D();
      const shard = new THREE.Mesh(accentGeometry, accentMaterial.clone());
      orbiter.userData.radius = 2.3 + Math.random() * 0.8;
      orbiter.userData.speed = 0.28 + Math.random() * 0.22;
      orbiter.userData.offset = Math.random() * Math.PI * 2;
      shard.position.x = orbiter.userData.radius;
      shard.rotation.set(Math.random(), Math.random(), Math.random());
      orbiter.add(shard);
      accentGroup.add(orbiter);
      orbiters.push(orbiter);
    }

    const loader = new THREE.GLTFLoader();
    const heroModel = new THREE.Group();
    stageGroup.add(heroModel);
    let mixer = null;

    loader.load(
      MODEL_URL,
      (gltf) => {
        const model = gltf.scene;
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = false;
            child.receiveShadow = true;
            child.material = child.material.clone();
            if ('emissive' in child.material) {
              child.material.emissive = new THREE.Color(0x14203f);
              child.material.emissiveIntensity = Math.max(child.material.emissiveIntensity || 0.1, 0.35);
            }
          }
        });
        model.scale.set(1.9, 1.9, 1.9);
        model.position.set(0, -1.05, 0);
        heroModel.add(model);

        if (gltf.animations && gltf.animations.length) {
          mixer = new THREE.AnimationMixer(model);
          const idleClip = THREE.AnimationClip.findByName(gltf.animations, 'Idle') || gltf.animations[0];
          if (idleClip) {
            const action = mixer.clipAction(idleClip);
            action.play();
          }
        }
      },
      undefined,
      (error) => {
        console.warn('Failed to load hero model', error);
      }
    );

    const resize = () => {
      const width = wrapper.clientWidth;
      const height = wrapper.clientHeight || width;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    if ('ResizeObserver' in window) {
      new ResizeObserver(resize).observe(wrapper);
    } else {
      window.addEventListener('resize', resize);
    }

    resize();

    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;

    const updatePointer = () => {
      pointerX += (targetX - pointerX) * 0.08;
      pointerY += (targetY - pointerY) * 0.08;
    };

    const handlePointer = (clientX, clientY) => {
      const rect = wrapper.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;
      targetX = (y - 0.5) * 0.6;
      targetY = (x - 0.5) * 1.2;
    };

    wrapper.addEventListener('pointermove', (event) => {
      handlePointer(event.clientX, event.clientY);
    });

    wrapper.addEventListener('pointerleave', () => {
      targetX = 0;
      targetY = 0;
    });

    wrapper.addEventListener(
      'touchmove',
      (event) => {
        if (event.touches.length) {
          const touch = event.touches[0];
          handlePointer(touch.clientX, touch.clientY);
        }
      },
      { passive: true }
    );

    wrapper.addEventListener('touchend', () => {
      targetX = 0;
      targetY = 0;
    });

    const clock = new THREE.Clock();

    const render = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      updatePointer();

      if (mixer) {
        mixer.update(delta);
      }

      stageGroup.rotation.x = pointerX * 0.5 + 0.25;
      stageGroup.rotation.y = pointerY * 0.75;
      root.position.y = Math.sin(elapsed * 0.5) * 0.06;
      root.rotation.y = Math.sin(elapsed * 0.12) * 0.05;

      portal.material.opacity = 0.3 + Math.sin(elapsed * 0.8) * 0.08;
      portalSecondary.material.opacity = 0.18 + Math.cos(elapsed * 0.9) * 0.05;
      beam.material.opacity = 0.2 + Math.sin(elapsed * 1.6) * 0.08;

      rings.forEach((ring, index) => {
        ring.rotation.z = elapsed * (0.18 + index * 0.08);
      });

      orbiters.forEach((orbiter) => {
        const { radius, speed, offset } = orbiter.userData;
        const angle = elapsed * speed + offset + pointerY * 2;
        orbiter.position.set(Math.cos(angle) * 0.3, Math.sin(angle * 1.2) * 0.4, Math.sin(angle) * 0.3);
        orbiter.rotation.y = angle * 1.5;
        const child = orbiter.children[0];
        child.position.set(Math.cos(angle) * radius, Math.sin(angle * 1.3) * 0.6, Math.sin(angle) * radius);
      });

      stars.rotation.y = elapsed * 0.02;
      stars.rotation.x = Math.sin(elapsed * 0.12) * 0.02;

      renderer.render(scene, camera);
      requestAnimationFrame(render);
    };

    render();
  };

  window.addEventListener('DOMContentLoaded', initHeroScene, { once: true });
})();
