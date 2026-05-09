"use client";

import { useState, useRef } from "react";
import { Check, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockVoices } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function VoiceSection() {
  const [selected, setSelected] = useState("aria");
  const [language, setLanguage] = useState("en-US");
  const [saved, setSaved] = useState(false);
  const saveRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    setSaved(true);
    // Reset saved state after 3 seconds
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePreview = (voiceName: string) => {
    // TODO: wire actual audio preview
    console.log("Preview", voiceName);
  };

  return (
    <section className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold m-0">AI Voice</h3>
        <p className="text-[var(--muted-foreground)] text-sm mt-1">
          Pick the voice that feels right. You can change it any time.
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3.5">
        {mockVoices.map((v) => {
          const isSelected = selected === v.id;
          return (
            <div
              key={v.id}
              className={cn(
                "bg-[var(--card)] border-[1.5px] rounded-[20px] p-5 transition-all flex flex-col gap-3.5",
                isSelected
                  ? "border-[var(--primary)] bg-[var(--accent)]"
                  : "border-[var(--border)] hover:border-[#b8d4f0]"
              )}
            >
              <button
                type="button"
                onClick={() => setSelected(v.id)}
                aria-pressed={isSelected}
                className="flex-1 text-left cursor-pointer"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="text-xl font-semibold tracking-tight">{v.name}</div>
                    <div className="text-[var(--muted-foreground)] text-[13px] mt-1">{v.desc}</div>
                  </div>
                  {isSelected && (
                    <span
                      aria-hidden="true"
                      className="w-6 h-6 rounded-full bg-[var(--primary)] text-white grid place-items-center shrink-0"
                    >
                      <Check size={14} strokeWidth={2.5} />
                    </span>
                  )}
                </div>
              </button>

              <div className="flex items-center justify-between gap-2">
                <span
                  className={cn(
                    "text-xs px-2.5 py-1 rounded-full",
                    isSelected ? "bg-white" : "bg-[var(--muted)]",
                    "text-[var(--muted-foreground)]"
                  )}
                >
                  {v.tag}
                </span>
                <button
                  type="button"
                  onClick={() => handlePreview(v.name)}
                  aria-label={`Preview ${v.name}`}
                  className="w-9 h-9 rounded-full bg-[var(--card)] border border-[var(--border)] grid place-items-center text-[var(--primary)] cursor-pointer hover:bg-[var(--muted)] transition-colors"
                >
                  <Play size={14} fill="currentColor" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Card>
        <Label htmlFor="lang">Language preference</Label>
        <p className="text-[var(--muted-foreground)] text-sm mb-3.5 mt-0">
          The assistant will reply in this language.
        </p>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger id="lang">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en-US">English (United States)</SelectItem>
            <SelectItem value="es-ES">Spanish (Spain)</SelectItem>
            <SelectItem value="es-MX">Spanish (Mexico)</SelectItem>
            <SelectItem value="pt-BR">Portuguese (Brazil)</SelectItem>
            <SelectItem value="fr-FR">French (France)</SelectItem>
            <SelectItem value="ja-JP">Japanese</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      <div className="flex justify-end items-center gap-4">
        <div
          ref={saveRef}
          aria-live="polite"
          aria-atomic="true"
          className="text-[var(--secondary)] font-semibold text-sm"
        >
          {saved && "Preferences saved"}
        </div>
        <Button onClick={handleSave}>Save preferences</Button>
      </div>
    </section>
  );
}
