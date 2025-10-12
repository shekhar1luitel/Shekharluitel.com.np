(() => {
  const initHeroScene = () => {
    const wrapper = document.querySelector('.hero-canvas-wrapper');
    const canvas = document.getElementById('hero-canvas');

    if (!wrapper || !canvas || typeof THREE === 'undefined') {
      return;
    }

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch (error) {
      console.warn('WebGL renderer unavailable', error);
      return;
    }

    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070f, 0.09);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 1.1, 6);
    scene.add(camera);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const ambient = new THREE.AmbientLight(0x5b8df6, 0.55);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0x8e7bff, 0.75);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x3f8efc, 1, 16);
    rimLight.position.set(-4, 2, -6);
    scene.add(rimLight);

    const root = new THREE.Group();
    scene.add(root);

    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x6f8cff,
      metalness: 0.6,
      roughness: 0.25,
      emissive: 0x1f2c45,
      emissiveIntensity: 0.6,
      flatShading: true,
    });
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.15, 1), coreMaterial);
    root.add(core);

    const innerHalo = new THREE.Mesh(
      new THREE.TorusGeometry(1.8, 0.05, 48, 200),
      new THREE.MeshBasicMaterial({ color: 0x9fb5ff, opacity: 0.55, transparent: true })
    );
    innerHalo.rotation.x = Math.PI / 2.2;
    root.add(innerHalo);

    const outerHaloMaterial = innerHalo.material.clone();
    outerHaloMaterial.opacity = 0.35;
    const outerHalo = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.04, 40, 220), outerHaloMaterial);
    outerHalo.rotation.set(Math.PI / 3.5, Math.PI / 4, 0);
    root.add(outerHalo);

    const orbitTrail = new THREE.Mesh(
      new THREE.TorusGeometry(2.85, 0.02, 24, 260),
      new THREE.MeshBasicMaterial({ color: 0x4ecaff, transparent: true, opacity: 0.3 })
    );
    orbitTrail.rotation.x = Math.PI / 2.6;
    root.add(orbitTrail);

    const shardGroup = new THREE.Group();
    const shardGeometry = new THREE.ConeGeometry(0.14, 0.7, 10);
    const shardMaterial = new THREE.MeshStandardMaterial({
      color: 0x82afff,
      metalness: 0.45,
      roughness: 0.25,
      emissive: 0x142f66,
      emissiveIntensity: 0.45,
    });
    const shards = [];
    const shardCount = 20;

    for (let i = 0; i < shardCount; i += 1) {
      const shard = new THREE.Mesh(shardGeometry, shardMaterial);
      const angle = (i / shardCount) * Math.PI * 2;
      const radius = 2.2 + Math.random() * 0.9;
      shard.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 1.8,
        Math.sin(angle) * radius
      );
      shard.lookAt(0, 0, 0);
      shard.rotation.x += Math.random() * 0.6;
      shardGroup.add(shard);
      shards.push(shard);
    }
    root.add(shardGroup);

    const starGeometry = new THREE.BufferGeometry();
    const starCount = 480;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i += 1) {
      const radius = 4 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const sinPhi = Math.sin(phi);
      starPositions[i * 3] = radius * sinPhi * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.cos(phi) * 0.6;
      starPositions[i * 3 + 2] = radius * sinPhi * Math.sin(theta);
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.06,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

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

    const resize = () => {
      const width = wrapper.clientWidth;
      const height = wrapper.clientHeight || width;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(resize);
      observer.observe(wrapper);
    } else {
      window.addEventListener('resize', resize);
    }

    resize();

    const clock = new THREE.Clock();

    const render = () => {
      const elapsed = clock.getElapsedTime();
      updatePointer();

      root.rotation.x = pointerX;
      root.rotation.y = pointerY;

      core.rotation.x += 0.005;
      core.rotation.y += 0.007;
      innerHalo.rotation.z = elapsed * 0.22;
      outerHalo.rotation.y = elapsed * 0.18;
      orbitTrail.rotation.z = elapsed * 0.25;

      shardGroup.rotation.y = elapsed * 0.12;
      shards.forEach((shard, index) => {
        shard.position.y = Math.sin(elapsed * 0.8 + index * 0.4) * 1.1;
        shard.rotation.y += 0.02;
      });

      stars.rotation.y = elapsed * 0.03;
      stars.rotation.x = Math.sin(elapsed * 0.12) * 0.02;

      renderer.render(scene, camera);
      requestAnimationFrame(render);
    };

    render();
  };

  window.addEventListener('DOMContentLoaded', initHeroScene, { once: true });
})();
