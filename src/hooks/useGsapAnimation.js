import { useEffect, useRef } from 'react';
import { animatePageIn, animateNavbarIn, animateSidebarIn } from '../utils/gsapAnimations';

export const usePageAnimation = () => {
  const pageRef = useRef(null);

  useEffect(() => {
    animatePageIn(pageRef.current);
  }, []);

  return pageRef;
};

export const useNavbarAnimation = () => {
  const navbarRef = useRef(null);

  useEffect(() => {
    animateNavbarIn(navbarRef.current);
  }, []);

  return navbarRef;
};

export const useSidebarAnimation = () => {
  const sidebarRef = useRef(null);

  useEffect(() => {
    animateSidebarIn(sidebarRef.current);
  }, []);

  return sidebarRef;
};

export const useCardAnimation = () => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      const cards = cardRef.current.querySelectorAll('[data-animate="card"]');
      if (cards.length > 0) {
        import('../utils/gsapAnimations').then(({ animateCardsIn }) => {
          animateCardsIn(cards);
        });
      }
    }
  }, []);

  return cardRef;
};
