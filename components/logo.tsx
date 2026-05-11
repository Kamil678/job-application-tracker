import Image from "next/image";
import Link from "next/link";

export function Logo({ variant = "dark" }: { variant: string }) {
  return (
    <Link href="/">
      {variant === "light" ? (
        <Image src="/logo-white.svg" alt="Job Application Tracker logo" width={180} height={100} />
      ) : (
        <Image src="/logo.svg" alt="Job Application Tracker logo" width={180} height={100} />
      )}
    </Link>
  );
}
