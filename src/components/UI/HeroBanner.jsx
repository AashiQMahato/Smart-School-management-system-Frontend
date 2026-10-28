/**
 * HeroBanner
 * Welcome/overview banner for the top of a page. Navy surface with the
 * role accent; `gradient` is accepted for older call sites but no
 * longer changes the colour.
 */

import { memo } from "react";

const HeroBanner = ({
  title,
  subtitle,
  eyebrow,
  children,
  rightContent,
  className = "",
}) => (
  <section className={`ssd-hero ${className}`}>
    <div>
      {eyebrow && <p className="ssd-hero__eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {subtitle && <p className="ssd-hero__sub">{subtitle}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
    {rightContent && <div className="ssd-hero__aside">{rightContent}</div>}
  </section>
);

export default memo(HeroBanner);
