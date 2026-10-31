import { useEffect, useRef, useState } from "react";

const reducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Animates a number from its previous value to `target` (ease-out).
 * Non-numeric targets are returned as-is.
 */
export const useCountUp = (target, { duration = 900 } = {}) => {
  const isNumber = typeof target === "number" && Number.isFinite(target);
  const [value, setValue] = useState(isNumber ? 0 : target);
  const from = useRef(0);

  useEffect(() => {
    if (!isNumber) return undefined;
    if (reducedMotion()) {
      from.current = target;
      const id = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(id);
    }
    const start = performance.now();
    const origin = from.current;
    let frame = 0;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(origin + (target - origin) * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
      else from.current = target;
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, isNumber]);

  return isNumber ? value : target;
};

export default useCountUp;
