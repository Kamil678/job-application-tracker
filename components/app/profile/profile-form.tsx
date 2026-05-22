"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Phone, MapPin, Briefcase, Globe, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AvatarUpload } from "./avatar-upload";
import { updateProfile } from "@/app/actions/update-profile";
import { profileSchema, type ProfileFormData } from "./profile.schema";
import type { ProfileUser } from "./types";
import type { UseFormRegisterReturn } from "react-hook-form";

function Field({
  label,
  id,
  icon: Icon,
  placeholder,
  type = "text",
  textarea = false,
  readOnly = false,
  error,
  registration,
}: {
  label: string;
  id: string;
  icon: React.ElementType;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
  readOnly?: boolean;
  error?: string;
  registration?: UseFormRegisterReturn;
}) {
  const baseClass =
    "w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-150";

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
        <Icon size={13} />
        {label}
      </Label>
      {textarea ? (
        <textarea id={id} placeholder={placeholder} rows={3} readOnly={readOnly} className={`${baseClass} resize-none`} {...registration} />
      ) : (
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          readOnly={readOnly}
          className="h-10 bg-card border-border focus-visible:ring-ring"
          {...registration}
        />
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

interface ProfileFormProps {
  user: ProfileUser;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      image: user.image ?? "",
      name: user.name,
      jobTitle: user.jobTitle ?? "",
      location: user.location ?? "",
      phone: user.phone ?? "",
      websiteUrl: user.websiteUrl ?? "",
      linkedinUrl: user.linkedinUrl ?? "",
      githubUrl: user.githubUrl ?? "",
      bio: user.bio ?? "",
    },
  });

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  async function onSubmit(data: ProfileFormData) {
    try {
      console.log(data);
      const result = await updateProfile(data);
      if (result.success) {
        toast.success("Profile saved!");
      } else {
        toast.error("Please fix the errors in the form");
      }
    } catch {
      toast.error("Something went wrong. Try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4">
        <Card className="rounded-lg border-border shadow-md">
          <CardContent className="px-4">
            <AvatarUpload user={user} onUploaded={(url) => setValue("image", url, { shouldDirty: true })} />
          </CardContent>
        </Card>

        <Card className="rounded-lg border-border shadow-md">
          <CardHeader className="px-6 pb-3">
            <CardTitle className="text-base">Personal information</CardTitle>
            <CardDescription className="text-xs">This info is private and used to personalize your experience.</CardDescription>
          </CardHeader>
          <CardContent className="px-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Full name"
                id="full_name"
                icon={User}
                placeholder="Your full name"
                error={errors.name?.message}
                registration={register("name")}
              />
              <Field label="Email" id="email" icon={Mail} type="email" readOnly placeholder="" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Location" id="location" icon={MapPin} placeholder="City, Country" registration={register("location")} />
              <Field
                label="Phone"
                id="phone"
                icon={Phone}
                type="tel"
                placeholder="+1 (555) 000-0000"
                error={errors.phone?.message}
                registration={register("phone")}
              />
            </div>
            <Field
              label="Job title"
              id="job_title"
              icon={Briefcase}
              placeholder="e.g. Frontend Developer"
              registration={register("jobTitle")}
            />

            <Separator />
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Links</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Github"
                id="githubUrl"
                icon={Globe}
                placeholder="https://github.com/you"
                error={errors.githubUrl?.message}
                registration={register("githubUrl")}
              />
              <Field
                label="LinkedIn"
                id="linkedinUrl"
                icon={Globe}
                placeholder="https://linkedin.com/in/you"
                error={errors.linkedinUrl?.message}
                registration={register("linkedinUrl")}
              />
            </div>
            <Field
              label="Website"
              id="websiteUrl"
              icon={Globe}
              placeholder="https://yoursite.com"
              error={errors.websiteUrl?.message}
              registration={register("websiteUrl")}
            />

            <Separator />
            <Field
              label="Bio"
              id="bio"
              icon={User}
              textarea
              placeholder="A few sentences about yourself..."
              error={errors.bio?.message}
              registration={register("bio")}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Check size={14} />
              Save changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
