import { Link } from "react-router-dom";
import { NAV_LINKS } from "../data";
import { useAppEntry } from "../hooks";
import { Brand } from "./primitives";

const Footer = () => {
  const entry = useAppEntry();
  return (
    <footer className="ssl-footer">
      <div className="ssl-container ssl-footer__grid">
        <div className="ssl-footer__brand">
          <Brand inverted />
          <p>
            A school management system that brings administrators, teachers,
            students, and parents together in one place.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2>Explore</h2>
          <ul>
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
            <li>
              <a href="#demo">Product preview</a>
            </li>
          </ul>
        </nav>

        <div>
          <h2>Application</h2>
          <ul>
            <li>
              <Link to={entry.to}>
                {entry.isAuthenticated ? "Go to dashboard" : "Log in"}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="ssl-container ssl-footer__base">
        <p>
          © {new Date().getFullYear()} Smart School Management System. All
          rights reserved.
        </p>
        <p>Previews on this page use sample data.</p>
      </div>
    </footer>
  );
};

export default Footer;
