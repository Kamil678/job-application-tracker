import Image from "next/image";

export function Logo() {
  return (
    <a href="#">
      <Image src="/logo.svg" alt="Job Application Tracker logo" width={180} height={100} />
    </a>
  );
}
