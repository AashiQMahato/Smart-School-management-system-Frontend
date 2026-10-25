import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

/**
 * Where the primary CTAs lead: the signed-in user's dashboard,
 * otherwise the existing login page.
 */
export const useAppEntry = () => {
  const { isAuthenticated, getDashboardRoute } = useAuth();
  return isAuthenticated
    ? { to: getDashboardRoute(), isAuthenticated }
    : { to: "/login", isAuthenticated };
};

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.(reducedMotionQuery).matches;

/**
 * Adds `is-in` to the element the first time it scrolls into view.
 * Toggles a class directly instead of setting state, so revealing
 * never re-renders the section.
 */
export const useReveal = (options = {}) => {
  const ref = useRef(null);
  const { threshold = 0.18, rootMargin = "0px 0px -8% 0px" } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      el.classList.add("is-in");
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return ref;
};

/**
 * WAI-ARIA tabs behaviour: arrow keys / Home / End move focus and
 * selection between tabs (automatic activation).
 */
export const useTabs = (keys, initial = keys[0]) => {
  const [active, setActive] = useState(initial);
  const tabRefs = useRef({});

  const onKeyDown = useCallback(
    (event) => {
      const index = keys.indexOf(active);
      let next = null;
      if (event.key === "ArrowRight" || event.key === "ArrowDown")
        next = keys[(index + 1) % keys.length];
      if (event.key === "ArrowLeft" || event.key === "ArrowUp")
        next = keys[(index - 1 + keys.length) % keys.length];
      if (event.key === "Home") next = keys[0];
      if (event.key === "End") next = keys[keys.length - 1];
      if (!next) return;
      event.preventDefault();
      setActive(next);
      tabRefs.current[next]?.focus();
    },
    [active, keys],
  );

  const registerTab = useCallback(
    (key) => (node) => {
      tabRefs.current[key] = node;
    },
    [],
  );

  return { active, setActive, onKeyDown, registerTab };
};

/** True once the page has scrolled past `offset` pixels. */
export const useScrolled = (offset = 8) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > offset);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [offset]);

  return scrolled;
};
