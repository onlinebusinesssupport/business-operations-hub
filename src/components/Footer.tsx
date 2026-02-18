const Footer = () => {
  return (
    <footer className="py-12 border-t border-divider">
      <div className="container mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="font-serif text-sm tracking-tight text-foreground">
            BUSINESS SUPPORT
          </span>
          <p className="mt-1 text-xs text-muted-foreground">
            Structured operational support for founders and teams.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Business Support. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
