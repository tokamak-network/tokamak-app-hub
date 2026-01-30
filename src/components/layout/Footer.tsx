export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Tokamak Network. All rights reserved.
        </p>
        <div className="flex items-center space-x-4">
          <a 
            href="https://github.com/tokamak-network" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <a 
            href="https://tokamak.network" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Website
          </a>
        </div>
      </div>
    </footer>
  );
}
