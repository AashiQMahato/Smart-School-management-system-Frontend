import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, LogIn, Menu, X } from "lucide-react";
import { NAV_LINKS } from "../data";
import { useAppEntry, useScrolled } from "../hooks";
import { Brand, CtaLink } from "./primitives";

/** Highlights the nav link of the section currently in view. */
const useActiveSection = (ids) => {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);

  return active;
};

const SECTION_IDS = NAV_LINKS.map((l) => l.href.slice(1));

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled();
  const active = useActiveSection(SECTION_IDS);
  const entry = useAppEntry();
  const toggleRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector("a")?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const close = () => setOpen(false);
  const loginLabel = entry.isAuthenticated ? "Dashboard" : "Log in";

  return (
    <header
      className="ssl-nav"
      data-scrolled={scrolled || open}
      data-open={open}>
      <nav className="ssl-container ssl-nav__bar" aria-label="Main">
        <a
          href="#home"
          className="ssl-nav__brand"
          aria-label="Smart School home">
          <Brand />
        </a>

        <ul className="ssl-nav__links">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="ssl-nav__link"
                aria-current={
                  active === link.href.slice(1) ? "true" : undefined
                }>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="ssl-nav__actions">
          <Link to={entry.to} className="ssl-nav__login">
            {loginLabel}
          </Link>
          <CtaLink to={entry.to} size="sm">
            Explore the System
            <ArrowRight size={15} aria-hidden="true" />
          </CtaLink>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="ssl-nav__toggle"
          aria-expanded={open}
          aria-controls="ssl-mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}>
          {open ? (
            <X size={20} aria-hidden="true" />
          ) : (
            <Menu size={20} aria-hidden="true" />
          )}
        </button>
      </nav>

      <div className="ssl-nav__scrim" onClick={close} aria-hidden="true" />
      <div
        id="ssl-mobile-menu"
        ref={panelRef}
        className="ssl-nav__panel"
        inert={!open}>
        <ul>
          {NAV_LINKS.map((link, i) => (
            <li key={link.href} style={{ "--i": i }}>
              <a href={link.href} onClick={close}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="ssl-nav__panel-actions">
          <CtaLink to={entry.to} variant="ghost" onClick={close}>
            <LogIn size={16} aria-hidden="true" />
            {loginLabel}
          </CtaLink>
          <CtaLink to={entry.to} onClick={close}>
            Explore the System
            <ArrowRight size={16} aria-hidden="true" />
          </CtaLink>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
