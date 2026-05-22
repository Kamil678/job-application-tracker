"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Camera, Upload, Trash2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { ProfileUser } from "./types";

type Status = "idle" | "uploading" | "deleting";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function validateImageFile(file: File): string | null {
  if (!file.type.startsWith("image/")) return "File must be an image";
  if (file.size > 5 * 1024 * 1024) return "File must be under 5MB";
  return null;
}

interface AvatarUploadProps {
  user: ProfileUser;
  onUploaded?: (url: string) => void;
}

export function AvatarUpload({ user, onUploaded }: AvatarUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(user.image ?? null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  const isBusy = status !== "idle";

  // Zwolnij blob URL przy odmontowaniu
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  async function handleFile(file: File) {
    const error = validateImageFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const previousPreview = preview;

    setPreview((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return objectUrl;
    });
    setStatus("uploading");

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch("/api/upload-avatar", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Upload failed");
        setPreview(previousPreview);
        return;
      }

      toast.success("Avatar updated!");
      onUploaded?.(data.url);
    } catch {
      toast.error("Something went wrong");
      setPreview(previousPreview);
    } finally {
      setStatus("idle");
    }
  }

  async function handleRemove() {
    setStatus("deleting");
    try {
      const res = await fetch("/api/delete-avatar", { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Failed to remove avatar");
        return;
      }

      setPreview(null);
      toast.success("Avatar removed");
      onUploaded?.("");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setStatus("idle");
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        role="button"
        tabIndex={isBusy ? -1 : 0}
        aria-label="Upload avatar"
        aria-busy={isBusy}
        className={`relative group w-24 h-24 rounded-lg transition-all duration-200 cursor-pointer
          ${dragging ? "scale-105" : ""}
          ${isBusy ? "pointer-events-none" : ""}`}
        onClick={() => fileRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
      >
        {preview ? (
          <Image src={preview} alt="Avatar" fill unoptimized={preview.startsWith("blob:")} className="rounded-lg object-cover" />
        ) : (
          <div className="w-full h-full rounded-lg bg-sidebar-primary flex items-center justify-center text-white text-2xl font-bold">
            {getInitials(user.name)}
          </div>
        )}

        <div className="absolute inset-0 rounded-lg bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          {isBusy ? <Loader2 size={18} className="text-white animate-spin" /> : <Camera size={18} className="text-white" />}
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />

      <div className="text-center">
        <p className="text-sm font-medium text-foreground">{user.name}</p>
        <p className="text-xs text-muted-foreground">{user.email}</p>
        <Badge variant="secondary" className="mt-1.5 text-[10px] uppercase tracking-wider font-semibold">
          {user.plan} plan
        </Badge>
      </div>

      <Button variant="outline" size="sm" disabled={isBusy} onClick={() => fileRef.current?.click()}>
        {status === "uploading" ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
        {status === "uploading" ? "Uploading..." : "Upload photo"}
      </Button>

      {preview && status !== "uploading" && (
        <Button variant="destructive" size="sm" disabled={isBusy} onClick={handleRemove}>
          {status === "deleting" ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
          {status === "deleting" ? "Removing..." : "Remove"}
        </Button>
      )}
    </div>
  );
}
