"use client";

import { useState } from "react";
import { AlertTriangle, Lock, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PasswordInput } from "@/features/auth/components/password-input";
import { PasswordStrength } from "@/features/auth/components/password-strength";
import { AuthFormError } from "@/features/auth/components/form-error";
import { authClient } from "@/modules/auth/client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/form-field";

export function SecurityForm() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);

  const passwordsMatch = newPassword === confirmPassword;
  const canSubmit = !saving && !!currentPassword && !!newPassword && passwordsMatch;

  async function handleSaveNewPassword() {
    if (!passwordsMatch) {
      toast.warning("The passwords are not the same");
      return;
    }

    setSaving(true);
    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        toast.error(error.message ?? "An unexpected error occurred");
        return;
      }

      toast.success("The password has been changed");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteUser() {
    setDeleting(true);
    try {
      const { error } = await authClient.deleteUser();

      if (error) {
        toast.error(error.message ?? "Failed to delete account");
        return;
      }

      router.push("/register");
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card className="rounded-lg border-border shadow-md">
        <CardHeader className="px-6 pb-3">
          <CardTitle className="text-base">Change password</CardTitle>
          <CardDescription className="text-xs">Use a strong password that you don&apos;t use elsewhere.</CardDescription>
        </CardHeader>
        <CardContent className="px-6 space-y-4">
          <FormField label="Current password" id="current_password">
            <PasswordInput
              id="current_password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="h-10 bg-card border-border focus-visible:ring-ring"
            />
          </FormField>

          <FormField label="New password" id="new_password">
            <PasswordInput
              id="new_password"
              placeholder="••••••••"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="h-10 bg-card border-border focus-visible:ring-ring"
            />
            {newPassword.length > 0 && <PasswordStrength password={newPassword} />}
          </FormField>

          <FormField label="Confirm new password" id="confirm_password">
            <PasswordInput
              id="confirm_password"
              placeholder="••••••••"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="h-10 bg-card border-border focus-visible:ring-ring"
            />
            {newPassword && confirmPassword && !passwordsMatch && <AuthFormError message="Passwords don't match" />}
          </FormField>

          <div className="flex justify-end pt-1">
            <Button size="lg" onClick={handleSaveNewPassword} disabled={!canSubmit}>
              {saving ? "Saving…" : "Update password"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-lg border-destructive/30 shadow-md">
        <CardHeader className="px-6 pb-3">
          <CardTitle className="text-base text-destructive flex items-center gap-2">
            <AlertTriangle size={15} />
            Danger zone
          </CardTitle>
          <CardDescription className="text-xs">These actions are irreversible. Please proceed with caution.</CardDescription>
        </CardHeader>
        <CardContent className="px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-destructive/5 border border-destructive/20">
            <div className="mb-3 sm:mb-0">
              <p className="text-sm font-medium text-foreground">Delete account</p>
              <p className="text-xs text-muted-foreground mt-0.5">Permanently delete your account and all associated data.</p>
            </div>
            <Dialog>
              <DialogTrigger className={buttonVariants({ variant: "destructive", size: "sm" })}>
                <Trash2 size={13} />
                Delete
              </DialogTrigger>
              <DialogContent className="rounded-lg">
                <DialogHeader>
                  <DialogTitle>Delete account?</DialogTitle>
                  <DialogDescription className="text-sm">
                    This will permanently delete your account, all applications, notes, and data. This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 py-2">
                  <p className="text-sm text-muted-foreground">
                    Type <span className="font-mono font-bold text-foreground">delete my account</span> to confirm:
                  </p>
                  <Input
                    type="text"
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    placeholder="delete my account"
                    className="h-10 bg-card border-border focus-visible:ring-ring"
                  />
                </div>
                <DialogFooter>
                  <Button variant="destructive" disabled={deleteConfirm !== "delete my account" || deleting} onClick={handleDeleteUser}>
                    {deleting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-destructive-foreground/40 border-t-destructive-foreground rounded-full animate-spin" />
                        Deleting…
                      </span>
                    ) : (
                      "Permanently delete"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
