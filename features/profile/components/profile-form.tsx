"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FormField, INPUT_CLASS, TEXTAREA_CLASS } from "@/components/form-field";
import { AvatarUpload } from "./avatar-upload";
import { updateProfile } from "../actions";
import { profileSchema, type ProfileFormData } from "../schemas";
import type { ProfileUser } from "../types";

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
              <FormField label="Full name" id="full_name" error={errors.name?.message}>
                <Input id="full_name" placeholder="Your full name" className={INPUT_CLASS} {...register("name")} />
              </FormField>
              <FormField label="Email" id="email">
                <Input id="email" type="email" readOnly className={INPUT_CLASS} />
              </FormField>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Location" id="location">
                <Input id="location" placeholder="City, Country" className={INPUT_CLASS} {...register("location")} />
              </FormField>
              <FormField label="Phone" id="phone" error={errors.phone?.message}>
                <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className={INPUT_CLASS} {...register("phone")} />
              </FormField>
            </div>
            <FormField label="Job title" id="job_title">
              <Input id="job_title" placeholder="e.g. Frontend Developer" className={INPUT_CLASS} {...register("jobTitle")} />
            </FormField>

            <Separator />
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Links</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Github" id="githubUrl" error={errors.githubUrl?.message}>
                <Input id="githubUrl" placeholder="https://github.com/you" className={INPUT_CLASS} {...register("githubUrl")} />
              </FormField>
              <FormField label="LinkedIn" id="linkedinUrl" error={errors.linkedinUrl?.message}>
                <Input id="linkedinUrl" placeholder="https://linkedin.com/in/you" className={INPUT_CLASS} {...register("linkedinUrl")} />
              </FormField>
            </div>
            <FormField label="Website" id="websiteUrl" error={errors.websiteUrl?.message}>
              <Input id="websiteUrl" placeholder="https://yoursite.com" className={INPUT_CLASS} {...register("websiteUrl")} />
            </FormField>

            <Separator />
            <FormField label="Bio" id="bio" error={errors.bio?.message}>
              <textarea
                id="bio"
                rows={3}
                placeholder="A few sentences about yourself..."
                className={TEXTAREA_CLASS}
                {...register("bio")}
              />
            </FormField>
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
