import { Logo } from "../logo";

const LINKS = {
  Product: ["Features", "Pricing", "Docs", "Changelog"],
  Company: ["About", "Blog", "Careers"],
  Legal: ["Privacy", "Terms", "Cookie Policy"],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-50">The job tracker built for focused professionals.</p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group}>
              <h5 className="text-sm font-semibold text-foreground mb-4">{group}</h5>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} JAT. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Built with precision.</p>
        </div>
      </div>
    </footer>
  );
}
