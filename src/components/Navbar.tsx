import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Studios", href: "/studios" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Apply", href: "/apply" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-divider">
      <div className="container mx-auto flex items-center justify-between h-16 px-6 lg:px-8">
        <Link to="/" className="font-display text-sm font-bold tracking-[0.2em] text-foreground uppercase">
          SUPPORT STUDIO™
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.href}
                className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/login"
              className="text-[11px] uppercase tracking-[0.2em] text-primary-foreground bg-primary px-5 py-2 font-medium hover:opacity-90 transition-opacity duration-200"
            >
              Portal
            </Link>
          </li>
        </ul>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-divider overflow-hidden"
          >
            <ul className="flex flex-col px-6 py-4 gap-4">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/login"
                  className="text-sm text-primary font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  Client Portal
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
