const Footer = () => {
  return (
    <footer className="py-12 border-t border-divider">
      <div className="container mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="font-sans text-sm font-semibold tracking-tight text-foreground uppercase">
            MOVE <span className="font-normal text-muted-foreground">Business Support</span>
          </span>
          <p className="mt-1 text-xs text-muted-foreground">
            From chaos to systems. Support studio for founders.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} MOVE Business Support. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
