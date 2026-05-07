import { NavbarLandingPage } from "@/components/landing/navbar";

export default function LandingPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavbarLandingPage />
      {children}
    </>
  );
}
