import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-16 border-t border-divider">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <span className="font-display text-sm font-bold tracking-[0.2em] text-foreground uppercase">
              THE BUSINESS SUPPORT STUDIO™
            </span>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Support that moves at your speed.
            </p>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-medium">
              PLATFORM
            </span>
            <ul className="mt-4 space-y-2.5">
              {[
                { label: "Services", href: "/services" },
                { label: "Media", href: "/media" },
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
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

          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-medium">
              ACCESS
            </span>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  to="/apply"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Apply
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Client Portal
                </Link>
              </li>
              <li>
                <a
                  href="mailto:thequitehelpinghand@gmail.com"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Email
                </a>
              </li>
              <li>
                <a
                  href="tel:+27749534914"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  +27 74 953 4914
                </a>
              </li>
            </ul>
          </div>

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

        <div className="mt-14 pt-6 border-t border-divider flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} The Business Support Studio™. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
