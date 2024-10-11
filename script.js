console.clear();

gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {
  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".wrapper",
        start: "top top",
        end: "+=150%",
        pin: true,
        scrub: true,
        markers: true,
        onEnter: () => {
          // When scrolling down, set the z-index for img and carousel-container
          gsap.set("img", { zIndex: 1 });
          gsap.set(".content", { zIndex: 0 });
        },
        onLeave: () => {
          // When the image finishes scaling (scrolling down), adjust z-index
          gsap.set("img", { zIndex: -1 });
          gsap.set(".content", { zIndex: 3 });
        },
        onLeaveBack: () => {
          // When scrolling back up, reset the z-index values
          gsap.set("img", { zIndex: 1 });
          gsap.set(".content", { zIndex: 3 });
        },
        onEnterBack: () => {
          // Adjust z-index back to original when scrolling back to the top
          // gsap.delayedCall(0.5, () => {
          // });
          gsap.set("img", { zIndex: 1 });
          gsap.set(".content", { zIndex: 0 });
        }
      }
    })
    .to("img", {
      scale: 2,
      z: 350,
      transformOrigin: "center center",
      ease: "power1.inOut"
    })
    .to(
      ".carousel-container",
      {
        scale: 1.1,
        z: 350,
        transformOrigin: "center center",
        ease: "power1.inOut"
      },
      "<"
    );
});
