import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-16 border-t border-divider">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <span className="font-sans text-sm font-semibold tracking-[0.15em] text-foreground uppercase">
              SUPPORT STUDIO
            </span>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Operational support for founders and growing businesses.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-medium">
              NAVIGATE
            </span>
            <ul className="mt-4 space-y-2.5">
              {[
                { label: "Services", href: "/services" },
                { label: "About", href: "/about" },
                { label: "Blog", href: "/insights" },
                { label: "How We Work", href: "/how-it-works" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-medium">
              CONNECT
            </span>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@supportstudio.co"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Email
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-medium">
              LEGAL
            </span>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-divider flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Support Studio. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Proudly South African.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
