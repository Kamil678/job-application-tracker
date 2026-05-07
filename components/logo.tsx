import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/">
      <Image src="/logo.svg" alt="Job Application Tracker logo" width={180} height={100} />
    </Link>
  );
}
