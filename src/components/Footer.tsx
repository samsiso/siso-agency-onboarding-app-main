const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm py-4 z-[90] border-t border-siso-border pointer-events-none">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="text-center text-sm text-siso-text-muted">
            © 2024 SISO Resource Hub. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;