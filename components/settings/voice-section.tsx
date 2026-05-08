"use client";

import { useState } from "react";
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
            <button
              key={v.id}
              type="button"
              onClick={() => setSelected(v.id)}
              aria-pressed={isSelected}
              aria-label={`${v.name}, ${v.tag}`}
              className={cn(
                "bg-[var(--card)] border-[1.5px] rounded-[20px] p-5 cursor-pointer transition-all flex flex-col gap-3.5 text-left",
                isSelected
                  ? "border-[var(--primary)] bg-[var(--accent)]"
                  : "border-[var(--border)] hover:border-[#b8d4f0]"
              )}
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
              <div className="flex items-center justify-between gap-2">
                <span
                  className={cn(
                    "text-xs px-2.5 py-1 rounded-full self-start",
                    isSelected ? "bg-white" : "bg-[var(--muted)]",
                    "text-[var(--muted-foreground)]"
                  )}
                >
                  {v.tag}
                </span>
                <span
                  role="button"
                  aria-label={`Preview ${v.name}`}
                  onClick={(e) => e.stopPropagation()}
                  className="w-9 h-9 rounded-full bg-[var(--card)] border border-[var(--border)] grid place-items-center text-[var(--primary)] cursor-pointer"
                >
                  <Play size={14} fill="currentColor" />
                </span>
              </div>
            </button>
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

      <div className="flex justify-end">
        <Button>Save preferences</Button>
      </div>
    </section>
  );
}
