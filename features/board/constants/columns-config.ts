import { Status } from "../types/types";

export const COLUMNS_CONFIG: Record<
  Status,
  {
    label: string;
    bg: string;
    fg: string;
    dot: string;
    columnAccent: string;
    emptyIcon: string;
  }
> = {
  wish_list: {
    label: "Wish List",
    bg: "bg-status-wishlist-bg",
    fg: "text-status-wishlist-fg",
    dot: "bg-status-wishlist-fg",
    columnAccent: "from-status-wishlist-bg/30 to-transparent",
    emptyIcon: "✦",
  },
  applied: {
    label: "Applied",
    bg: "bg-status-applied-bg",
    fg: "text-status-applied-fg",
    dot: "bg-status-applied-fg",
    columnAccent: "from-status-applied-bg/30 to-transparent",
    emptyIcon: "→",
  },
  interview: {
    label: "Interviewing",
    bg: "bg-status-interview-bg",
    fg: "text-status-interview-fg",
    dot: "bg-status-interview-fg",
    columnAccent: "from-status-interview-bg/30 to-transparent",
    emptyIcon: "◎",
  },
  offer: {
    label: "Offer",
    bg: "bg-status-offer-bg",
    fg: "text-status-offer-fg",
    dot: "bg-status-offer-fg",
    columnAccent: "from-status-offer-bg/30 to-transparent",
    emptyIcon: "★",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-status-rejected-bg",
    fg: "text-status-rejected-fg",
    dot: "bg-status-rejected-fg",
    columnAccent: "from-status-rejected-bg/30 to-transparent",
    emptyIcon: "×",
  },
  ghost: {
    label: "Ghost",
    bg: "bg-status-ghost-bg",
    fg: "text-status-ghost-fg",
    dot: "bg-status-ghost-fg",
    columnAccent: "from-status-ghost-bg/30 to-transparent",
    emptyIcon: "◌",
  },
};
