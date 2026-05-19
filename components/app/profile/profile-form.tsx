"use client";

import { useState } from "react";
import { User, Mail, Phone, MapPin, Briefcase, Globe, Check } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AvatarUpload } from "./avatar-upload";
import type { ProfileUser } from "./types";

// ------------------------------------------------------------------
// Field — reusable labeled input / textarea
// ------------------------------------------------------------------

function Field({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  type = "text",
  textarea = false,
  readOnly = false,
}: {
  label: string;
  icon: React.ElementType;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
  readOnly?: boolean;
}) {
  const baseClass =
    "w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-150";

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        <Icon size={11} />
        {label}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          rows={3}
          readOnly={readOnly}
          className={`${baseClass} resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={baseClass}
        />
      )}
    </div>
  );
}

// ------------------------------------------------------------------
// ProfileForm
// ------------------------------------------------------------------

interface ProfileFormProps {
  user: ProfileUser;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [name, setName] = useState(user.name);
  const [jobTitle, setJobTitle] = useState(user.jobTitle ?? "");
  const [location, setLocation] = useState(user.location ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [website, setWebsite] = useState(user.website ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    // TODO: wire up to your actual update mutation / server action
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast.success("Profile updated successfully");
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4">
        {/* Avatar card */}
        <Card className="rounded-2xl border-border shadow-none">
          <CardContent className="p-6">
            <AvatarUpload user={user} onSave={() => {}} />
          </CardContent>
        </Card>

        {/* Personal info card */}
        <Card className="rounded-2xl border-border shadow-none">
          <CardHeader className="px-6 pt-5 pb-3">
            <CardTitle className="text-base">Personal information</CardTitle>
            <CardDescription className="text-xs">This info is private and used to personalize your experience.</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full name" icon={User} value={name} onChange={setName} placeholder="Your full name" />
              <Field label="Job title" icon={Briefcase} value={jobTitle} onChange={setJobTitle} placeholder="e.g. Frontend Developer" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Location" icon={MapPin} value={location} onChange={setLocation} placeholder="City, Country" />
              <Field label="Phone" icon={Phone} value={phone} onChange={setPhone} placeholder="+1 (555) 000-0000" type="tel" />
            </div>

            <Separator />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Links</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Website" icon={Globe} value={website} onChange={setWebsite} placeholder="https://yoursite.com" />
              <Field label="Email" icon={Mail} value={user.email} readOnly placeholder="" type="email" />
            </div>

            <Separator />
            <Field label="Bio" icon={User} value={bio} onChange={setBio} placeholder="A few sentences about yourself..." textarea />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button size="lg" onClick={handleSave} disabled={saving}>
          {saving ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
              Saving…
            </span>
          ) : (
            <>
              <Check size={14} />
              Save changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
