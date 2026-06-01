import Image from "next/image";
import Link from "next/link";

export function Logo({ variant = "dark", size = "md" }: { variant?: "dark" | "light"; size?: "sm" | "md" }) {
  return (
    <Link href="/">
      {variant === "light" ? (
        <Image src="/logo-white.svg" loading="eager" alt="Job Application Tracker logo" width={size === "md" ? 180 : 160} height={100} />
      ) : (
        <Image src="/logo.svg" alt="Job Application Tracker logo" width={size === "md" ? 180 : 160} height={100} />
      )}
    </Link>
  );
}
