"use client";

import { useRef, useState } from "react";
import { Camera, Upload, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ProfileUser } from "./types";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface AvatarUploadProps {
  user: ProfileUser;
  onSave: (file: File) => void;
}

export function AvatarUpload({ user, onSave }: AvatarUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(user.image ?? null);
  const [dragging, setDragging] = useState(false);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    onSave(file);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`relative group w-24 h-24 rounded-3xl border-2 transition-all duration-200 cursor-pointer
          ${dragging ? "border-primary scale-105" : "border-border hover:border-primary/50"}`}
        onClick={() => fileRef.current?.click()}
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
          <img src={preview} alt="Avatar" className="w-full h-full rounded-3xl object-cover" />
        ) : (
          <div className="w-full h-full rounded-3xl bg-sidebar-primary flex items-center justify-center text-white text-2xl font-bold">
            {getInitials(user.name)}
          </div>
        )}
        <div className="absolute inset-0 rounded-3xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <Camera size={18} className="text-white" />
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

      <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1.5" onClick={() => fileRef.current?.click()}>
        <Upload size={13} />
        Upload photo
      </Button>

      {preview && preview !== user.image && (
        <Button
          variant="ghost"
          size="sm"
          className="rounded-xl text-xs text-muted-foreground gap-1.5"
          onClick={() => setPreview(user.image ?? null)}
        >
          <Trash2 size={13} />
          Remove
        </Button>
      )}
    </div>
  );
}
