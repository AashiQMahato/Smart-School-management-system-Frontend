import { useEffect, useState } from "react";

/** Current time, refreshed every `interval` ms (for live clocks). */
export const useNow = (interval = 30000) => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), interval);
    return () => clearInterval(id);
  }, [interval]);
  return now;
};

/** "Good morning" / "Good afternoon" / "Good evening" for a date. */
export const greetingFor = (date = new Date()) => {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

export default useNow;
