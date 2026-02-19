import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-16 border-t border-divider">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1 — Brand */}
          <div>
            <span className="font-sans text-sm font-semibold tracking-[0.15em] text-foreground uppercase">
              SUPPORT STUDIO
            </span>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Operational support for founders and growing businesses.
            </p>
          </div>

          {/* Column 2 — Navigation */}
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium">
              NAVIGATE
            </span>
            <ul className="mt-4 space-y-2.5">
              {[
                { label: "Services", href: "/services" },
                { label: "How We Work", href: "/how-it-works" },
                { label: "Clients", href: "/clients" },
                { label: "Insights", href: "/insights" },
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

          {/* Column 3 — Contact */}
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium">
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
                <Link
                  to="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Book a Consultation
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

        {/* Disclaimer */}
        <p className="mt-4 text-[10px] text-muted-foreground/50">
          Logos represent brands our team has supported directly or indirectly.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
