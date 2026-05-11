"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
// import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "@/components/auth/auth-card";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { AuthDivider } from "@/components/auth/divider";
import { AuthFormError } from "@/components/auth/form-error";
import { PasswordInput } from "@/components/auth/password-input";
import { PasswordStrength } from "@/components/auth/password-strength";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // const { error: authError } = await signUp.email({
    //   name,
    //   email,
    //   password,
    //   callbackURL: "/dashboard",
    // });
    // if (authError) {
    //   setError("Could not create account. Please try again.");
    //   setLoading(false);
    // }
  }

  return (
    <AuthCard>
      {/* Header */}
      <div className="space-y-1 mb-6">
        <h2 className="text-xl font-bold tracking-tight text-foreground">Create your account</h2>
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary font-medium hover:underline underline-offset-4 transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <div className="space-y-4">
        <SocialAuthButtons callbackURL="/dashboard" />
        <AuthDivider label="or sign up with email" />

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Jan Kowalski"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-10 bg-card border-border focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-10 bg-card border-border focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="h-10 bg-card border-border focus-visible:ring-ring"
            />
            {password.length > 0 && <PasswordStrength password={password} />}
          </div>

          <AuthFormError message={error} />

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2 shadow-sm"
          >
            {loading ? (
              <>
                <span className="size-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                Creating account…
              </>
            ) : (
              <>
                Create account
                <ArrowRight size={15} />
              </>
            )}
          </Button>
        </form>
      </div>

      <p className="mt-5 text-center text-xs text-muted-foreground leading-relaxed">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-3 hover:text-primary transition-colors">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline underline-offset-3 hover:text-primary transition-colors">
          Privacy Policy
        </Link>
        .
      </p>
    </AuthCard>
  );
}
