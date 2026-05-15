"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreHorizontal, User, CreditCard, LogOut } from "lucide-react";

import { authClient } from "@/lib/auth/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { getInitials, type User as UserType } from "./nav-config";

interface UserDropdownProps {
  user: UserType;
}

export function UserDropdown({ user }: UserDropdownProps) {
  const router = useRouter();
  const initials = getInitials(user.name);

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg
            hover:bg-sidebar-accent text-left cursor-pointer
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
        aria-label="User menu"
      >
        <div
          aria-hidden="true"
          className="w-7.5 h-7.5 rounded-full bg-sidebar-primary shrink-0 flex items-center justify-center text-[11px] font-semibold text-white"
        >
          {initials}
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-[12px] font-medium text-sidebar-foreground truncate">{user.name}</p>
          <p className="text-[11px] text-sidebar-text">Free plan</p>
        </div>
        <MoreHorizontal size={15} className="text-sidebar-text shrink-0" aria-hidden="true" />
      </DropdownMenuTrigger>

      <DropdownMenuContent side="top" align="end" className="w-47 mb-1 p-0">
        <div className="px-3 py-2">
          <p className="text-sm font-medium truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>

        <DropdownMenuSeparator className="my-0" />

        <DropdownMenuGroup>
          <DropdownMenuItem className="p-0 w-full data-highlighted:bg-primary data-highlighted:text-primary-foreground rounded-none">
            <Link href="/app/settings" className="flex flex-row items-center px-3 py-2 w-full">
              <User size={14} className="mr-2" aria-hidden="true" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0 data-highlighted:bg-primary data-highlighted:text-primary-foreground rounded-none">
            <Link href="/app/settings/billing" className="flex flex-row items-center px-3 py-2 w-full">
              <CreditCard size={14} className="mr-2" aria-hidden="true" />
              Billing
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-0" />

        <DropdownMenuGroup className="text-destructive cursor-pointer px-0 focus:text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive!">
          <DropdownMenuItem
            onClick={handleSignOut}
            className="text-destructive cursor-pointer px-0 py-2 focus:text-destructive hover:text-destructive data-highlighted:bg-destructive/20 data-[highlighted]:text-destructive! rounded-none"
          >
            <div className="flex items-center px-3">
              <LogOut size={14} className="mr-2" aria-hidden="true" />
              Sign out
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
