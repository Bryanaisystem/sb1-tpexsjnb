/**
 * Utility functions for smooth scrolling
 */

// Global state to track if navigation is in progress
let isNavigating = false;

/**
 * Check if navigation is currently in progress
 */
export const getIsNavigating = (): boolean => {
  return isNavigating;
};

/**
 * Smoothly scrolls to a target element
 */
export const smoothScrollTo = (
  targetId: string | null, 
  offset = 80,
  setActiveSection?: (section: string) => void
): Promise<void> => {
  return new Promise((resolve) => {
    isNavigating = true;
    
    if (setActiveSection) {
      setActiveSection(targetId === null ? 'home' : targetId);
    }
    
    let element: Element | null = null;
    
    if (targetId === null) {
      element = null;
    } else if (targetId === 'home') {
      element = document.querySelector('.hero-section');
    } else {
      element = document.getElementById(targetId);
    }
    
    if (targetId !== null && !element) {
      console.error(`Target element with ID "${targetId}" not found`);
      isNavigating = false;
      resolve();
      return;
    }
    
    const startPosition = window.scrollY;
    const targetPosition = element 
      ? element.getBoundingClientRect().top + window.scrollY - offset
      : 0;
    const distance = targetPosition - startPosition;
    const duration = 800; // Animation duration in milliseconds
    let startTime: number | null = null;
    
    // Easing function for smooth animation
    const easeInOutQuad = (t: number): number => {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };
    
    // Animation function
    const animate = (currentTime: number) => {
      if (startTime === null) {
        startTime = currentTime;
      }
      
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easedProgress = easeInOutQuad(progress);
      
      window.scrollTo(0, startPosition + distance * easedProgress);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animate);
      } else {
        // Ensure we end at exactly the right position
        window.scrollTo(0, targetPosition);
        setTimeout(() => {
          isNavigating = false;
          resolve();
        }, 100);
      }
    };
    
    requestAnimationFrame(animate);
  });
};

/**
 * Updates the URL hash without triggering a scroll
 */
export const updateUrlHash = (targetId: string | null): void => {
  if (targetId === null || targetId === 'home') {
    if (window.location.hash) {
      history.pushState("", document.title, window.location.pathname);
    }
  } else {
    const newUrl = window.location.pathname + `#${targetId}`;
    history.replaceState(null, '', newUrl);
  }
};

/**
 * Handle navigation click
 */
export const handleNavClick = (
  e: React.MouseEvent, 
  targetId: string | null,
  setActiveSection?: (section: string) => void
): void => {
  e.preventDefault();
  
  try {
    updateUrlHash(targetId);
    
    if (setActiveSection) {
      setActiveSection(targetId === null ? 'home' : targetId);
    }
    
    smoothScrollTo(targetId, 80, setActiveSection)
      .catch(error => {
        console.error('Error during smooth scroll:', error);
        if (targetId === null || targetId === 'home') {
          window.scrollTo(0, 0);
        } else {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView();
          }
        }
        isNavigating = false;
      });
  } catch (error) {
    console.error('Error during navigation:', error);
    if (targetId === null || targetId === 'home') {
      window.scrollTo(0, 0);
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView();
      }
    }
    isNavigating = false;
  }
};