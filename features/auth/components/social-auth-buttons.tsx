"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
// import { signIn } from "@/lib/auth-client";

interface SocialAuthButtonsProps {
  callbackURL?: string;
}

export function SocialAuthButtons({ callbackURL = "/app/dashboard" }: SocialAuthButtonsProps) {
  const [loadingProvider, setLoadingProvider] = useState<"google" | "github" | null>(null);

  async function handleSocial(provider: "google" | "github") {
    setLoadingProvider(provider);
    // await signIn.social({ provider, callbackURL });
    // setLoadingProvider(null);
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        type="button"
        variant="outline"
        disabled={!!loadingProvider}
        onClick={() => handleSocial("google")}
        className="h-10 gap-2 border-border bg-card hover:bg-secondary text-foreground font-medium text-sm"
      >
        {loadingProvider === "google" ? <Spinner /> : <Image src="/google-logo.svg" alt="Google icon" width={16} height={16} />}
        Google
      </Button>

      <Button
        type="button"
        variant="outline"
        disabled={!!loadingProvider}
        onClick={() => handleSocial("github")}
        className="h-10 gap-2 border-border bg-card hover:bg-secondary text-foreground font-medium text-sm"
      >
        {loadingProvider === "github" ? <Spinner /> : <Image src="/github-logo.svg" alt="Github icon" width="16" height="16" />}
        GitHub
      </Button>
    </div>
  );
}

function Spinner() {
  return <span className="size-4 rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground animate-spin" />;
}
