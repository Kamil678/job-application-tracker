import { NavItem } from "./nav-item";
import { UserDropdown } from "./user-dropdown";
import { NAV, type User } from "./nav-config";
import { Logo } from "@/components/logo";

interface AppSidebarProps {
  user: User;
  onNavigate?: () => void;
}

export function AppSidebar({ user, onNavigate }: AppSidebarProps) {
  return (
    <aside className="flex flex-col h-full w-55 bg-sidebar text-sidebar-foreground" aria-label="Main navigation">
      <div className="px-4 py-2">
        <Logo variant="light" size="sm" />
      </div>

      <nav className="flex-1 overflow-y-auto">
        {NAV.map((section) => (
          <div key={section.label} className="px-4 pt-5 pb-1">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-sidebar-foreground px-1.5 mb-1">{section.label}</p>
            {section.items.map((item) => (
              <NavItem key={item.href} {...item} onNavigate={onNavigate} />
            ))}
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border px-4 py-2">
        <UserDropdown user={user} />
      </div>
    </aside>
  );
}
