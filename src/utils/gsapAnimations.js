import gsap from "gsap";

// Page transition animation
export const animatePageIn = (element) => {
  if (!element) return;
  gsap.fromTo(
    element,
    {
      opacity: 0,
      y: 20,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
    },
  );
};

// Page transition animation (exit)
export const animatePageOut = (element) => {
  if (!element) return;
  return gsap.to(element, {
    opacity: 0,
    y: -20,
    duration: 0.4,
    ease: "power2.in",
  });
};

// Card entrance animation with stagger
export const animateCardsIn = (elements) => {
  if (!elements || elements.length === 0) return;
  gsap.fromTo(
    elements,
    {
      opacity: 0,
      y: 30,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "back.out",
    },
  );
};

// Hover animation for interactive elements
export const addHoverAnimation = (element) => {
  if (!element) return;

  element.addEventListener("mouseenter", () => {
    gsap.to(element, {
      scale: 1.05,
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
      duration: 0.3,
      ease: "power2.out",
    });
  });

  element.addEventListener("mouseleave", () => {
    gsap.to(element, {
      scale: 1,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      duration: 0.3,
      ease: "power2.out",
    });
  });
};

// Modal animation (open)
export const animateModalIn = (modalElement) => {
  if (!modalElement) return;
  gsap.fromTo(
    modalElement,
    {
      opacity: 0,
      scale: 0.8,
    },
    {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: "back.out",
    },
  );
};

// Modal animation (close)
export const animateModalOut = (modalElement) => {
  if (!modalElement) return;
  return gsap.to(modalElement, {
    opacity: 0,
    scale: 0.8,
    duration: 0.3,
    ease: "back.in",
  });
};

// Smooth scroll animation
export const animateScrollTo = (target, duration = 1) => {
  gsap.to(window, {
    scrollTo: target,
    duration,
    ease: "power2.inOut",
  });
};

// Button click animation
export const animateButtonClick = (element) => {
  if (!element) return;
  gsap
    .timeline()
    .to(element, {
      scale: 0.95,
      duration: 0.1,
      ease: "power2.in",
    })
    .to(element, {
      scale: 1,
      duration: 0.1,
      ease: "back.out",
    });
};

// Text fade-in animation
export const animateTextIn = (element) => {
  if (!element) return;
  gsap.fromTo(
    element,
    {
      opacity: 0,
    },
    {
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
    },
  );
};

// Profile image animation
export const animateProfileImage = (element) => {
  if (!element) return;
  gsap.fromTo(
    element,
    {
      opacity: 0,
      scale: 0.9,
    },
    {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "back.out",
    },
  );
};

// Feed item animation
export const animateFeedItem = (element) => {
  if (!element) return;
  gsap.fromTo(
    element,
    {
      opacity: 0,
      x: -30,
    },
    {
      opacity: 1,
      x: 0,
      duration: 0.5,
      ease: "power2.out",
    },
  );
};

// Navbar slide down animation
export const animateNavbarIn = (element) => {
  if (!element) return;
  gsap.fromTo(
    element,
    {
      opacity: 0,
      y: -50,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
    },
  );
};

// Sidebar animation
export const animateSidebarIn = (element) => {
  if (!element) return;
  gsap.fromTo(
    element,
    {
      opacity: 0,
      x: -50,
    },
    {
      opacity: 1,
      x: 0,
      duration: 0.6,
      ease: "power2.out",
    },
  );
};

// Pulse animation for notifications
export const animatePulse = (element) => {
  if (!element) return;
  gsap.to(element, {
    opacity: 0.7,
    duration: 0.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
};

// Bounce animation
export const animateBounce = (element) => {
  if (!element) return;
  gsap.to(element, {
    y: -10,
    duration: 0.3,
    repeat: 1,
    yoyo: true,
    ease: "back.out",
  });
};
