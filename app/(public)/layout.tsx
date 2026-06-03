import { NavbarLandingPage } from "@/features/landing/components/navbar";

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
