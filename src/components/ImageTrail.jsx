import { useRef, useEffect, useCallback } from "react";
import { gsap, Power1, Expo, Quint } from "gsap";
import "./ImageTrail.css";

const imagePaths = Array.from(
  { length: 12 },
  (_, i) => `/trail-images/${(i + 1).toString().padStart(2, "0")}.jpg`
);

const MathUtils = {
  lerp: (a, b, n) => (1 - n) * a + n * b,
  distance: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1),
};

const getMousePos = (ev) => ({ x: ev.clientX, y: ev.clientY });

const preloadDOMImages = (nodes) =>
  Promise.all(
    Array.from(nodes).map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete && img.naturalWidth > 0) return resolve(img);
          img.addEventListener("load", () => resolve(img), { once: true });
          img.addEventListener("error", () => resolve(img), { once: true });
        })
    )
  );

const ImageTrail = () => {
  const containerRef = useRef(null);
  const trailImages = useRef([]);
  const animationState = useRef({
    mousePos: { x: 0, y: 0 },
    lastMousePos: { x: 0, y: 0 },
    cacheMousePos: { x: 0, y: 0 },
    imgPosition: 0,
    zIndexVal: 1000,
    threshold: 28, // lowered threshold so small moves spawn trail
    imagesTotal: imagePaths.length,
    isRendering: false,
    isHovering: false,
  });

  class ImageEl {
    constructor(el) {
      this.DOM = { el };
      this.getRect();
    }
    getRect() {
      this.rect = this.DOM.el.getBoundingClientRect();
    }
    isActive() {
      return (
        gsap.isTweening(this.DOM.el) ||
        parseFloat(gsap.getProperty(this.DOM.el, "opacity")) > 0.001
      );
    }
  }

  const showNextImage = useCallback(() => {
    const state = animationState.current;
    if (!state.isHovering) return;
    const img = trailImages.current[state.imgPosition];
    if (!img) return;

    gsap.killTweensOf(img.DOM.el);
    img.getRect();

    // place starting point near cached mouse pos and animate toward current mouse
    gsap
      .timeline({ defaults: { overwrite: "auto" } })
      .set(img.DOM.el, {
        opacity: 1,
        scale: 1,
        zIndex: state.zIndexVal,
        x: state.cacheMousePos.x - img.rect.width / 2,
        y: state.cacheMousePos.y - img.rect.height / 2,
        pointerEvents: "none",
      })
      .to(
        img.DOM.el,
        {
          duration: 0.85,
          ease: Expo.easeOut,
          x: state.mousePos.x - img.rect.width / 2,
          y: state.mousePos.y - img.rect.height / 2,
        },
        0
      )
      .to(
        img.DOM.el,
        {
          duration: 1,
          ease: Power1.easeOut,
          opacity: 0,
        },
        0.35
      )
      .to(
        img.DOM.el,
        {
          duration: 1,
          ease: Quint.easeOut,
          scale: 0.22,
        },
        0.35
      );

    state.zIndexVal++;
    state.imgPosition = (state.imgPosition + 1) % state.imagesTotal;
    state.lastMousePos = { ...state.mousePos };
  }, []);

  const render = useCallback(() => {
    const state = animationState.current;
    if (!state.isRendering) return;

    const distance = MathUtils.distance(
      state.mousePos.x,
      state.mousePos.y,
      state.lastMousePos.x,
      state.lastMousePos.y
    );

    state.cacheMousePos.x = MathUtils.lerp(
      state.cacheMousePos.x || state.mousePos.x,
      state.mousePos.x,
      0.12
    );
    state.cacheMousePos.y = MathUtils.lerp(
      state.cacheMousePos.y || state.mousePos.y,
      state.mousePos.y,
      0.12
    );

    if (state.isHovering && distance > state.threshold) {
      showNextImage();
    }

    // keep z-index small when idle
    let isIdle = true;
    for (let img of trailImages.current) {
      if (img.isActive()) {
        isIdle = false;
        break;
      }
    }
    if (isIdle && state.zIndexVal !== 1000) {
      state.zIndexVal = 1000;
    }

    requestAnimationFrame(render);
  }, [showNextImage]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // preload the DOM images we already render
    const imgs = container.querySelectorAll("img");
    preloadDOMImages(imgs).then(() => {
      trailImages.current = Array.from(imgs).map((el) => new ImageEl(el));
      animationState.current.isRendering = true;
      render();
    });

    const onMouseMove = (ev) => {
      // always update mousePos; showNextImage gate uses isHovering
      animationState.current.mousePos = getMousePos(ev);
    };

    const onEnter = (ev) => {
      animationState.current.isHovering = true;
      animationState.current.cacheMousePos = getMousePos(ev);
      animationState.current.lastMousePos = getMousePos(ev);
      animationState.current.mousePos = getMousePos(ev);
    };

    const onLeave = () => {
      animationState.current.isHovering = false;
    };

    // attach listeners to the footer element so underlying interactions remain intact
    const footer = container.closest(".vanokhi-footer");
    if (footer) {
      footer.addEventListener("mouseenter", onEnter, { passive: true });
      footer.addEventListener("mouseleave", onLeave, { passive: true });
      footer.addEventListener("mousemove", onMouseMove, { passive: true });
      // also track touch move for mobile
      footer.addEventListener("touchstart", onEnter, { passive: true });
      footer.addEventListener(
        "touchmove",
        (e) => {
          if (e.touches && e.touches[0]) {
            animationState.current.mousePos = {
              x: e.touches[0].clientX,
              y: e.touches[0].clientY,
            };
          }
        },
        { passive: true }
      );
      footer.addEventListener("touchend", onLeave, { passive: true });
    }

    return () => {
      animationState.current.isRendering = false;
      if (footer) {
        footer.removeEventListener("mouseenter", onEnter);
        footer.removeEventListener("mouseleave", onLeave);
        footer.removeEventListener("mousemove", onMouseMove);
        footer.removeEventListener("touchstart", onEnter);
        footer.removeEventListener("touchend", onLeave);
      }
      trailImages.current.forEach((img) => gsap.killTweensOf(img.DOM.el));
    };
  }, [render]);

  return (
    <div ref={containerRef} className="image-trail-content" aria-hidden>
      {imagePaths.map((path, index) => (
        <img
          key={index}
          className="image-trail-img"
          src={path}
          alt={`Trail Image ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default ImageTrail;
