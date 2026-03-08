import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
            <Link to="/contact" className="mt-4 inline-block">
              <Button size="sm" className="text-xs tracking-wide gap-1.5">
                Start a Conversation
                <ArrowRight size={12} />
              </Button>
            </Link>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-medium">
              PLATFORM
            </span>
            <ul className="mt-4 space-y-2.5">
              {[
                { label: "Services", href: "/services" },
                { label: "How It Works", href: "/how-it-works" },
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
                  to="/contact"
                  className="text-sm text-foreground font-medium hover:text-primary transition-colors"
                >
                  Contact Us
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
              STAY UPDATED
            </span>
            <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
              Monthly insights on building structured businesses in South Africa.
            </p>
            <div className="mt-3">
              <NewsletterForm source="footer" compact />
            </div>
            <ul className="mt-6 space-y-2.5">
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
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
