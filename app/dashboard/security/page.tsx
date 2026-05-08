"use client";

import { useState } from "react";
import { Laptop, MapPin, Smartphone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { mockSessions } from "@/lib/mock-data";

export default function SecurityPage() {
  const [limit, setLimit] = useState(150);
  const [extraConfirm, setExtraConfirm] = useState(true);

  return (
    <div className="max-w-[720px] mx-auto px-5 md:px-8 py-8 w-full" data-screen-label="Security">
      <header className="mb-7">
        <h2 className="text-[30px] font-bold tracking-tight m-0">Security</h2>
        <p className="text-[var(--muted-foreground)] mt-1.5 text-[15px]">
          Keep your account safe with simple controls.
        </p>
      </header>

      <Card className="mb-4">
        <div className="flex justify-between items-baseline mb-1">
          <h3 className="text-lg font-semibold m-0">Daily limit</h3>
          <div className="text-[22px] font-bold tracking-tight">${limit}</div>
        </div>
        <p className="text-[var(--muted-foreground)] text-sm mb-4 mt-0">
          The most you can send in a single day.
        </p>
        <Slider
          value={[limit]}
          min={0}
          max={500}
          step={10}
          onValueChange={(v) => setLimit(v[0] ?? 0)}
          aria-label="Daily limit"
        />
        <div className="flex justify-between mt-2 text-xs text-[var(--muted-foreground)]">
          <span>$0</span>
          <span>$500</span>
        </div>
      </Card>

      <Card className="mb-4 flex gap-4 items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold m-0 mb-1">Extra confirmation</h3>
          <p className="text-[var(--muted-foreground)] text-sm m-0">
            Require an additional confirmation for transactions above $50.
          </p>
        </div>
        <Switch
          checked={extraConfirm}
          onCheckedChange={setExtraConfirm}
          aria-label="Extra confirmation"
        />
      </Card>

      <Card>
        <h3 className="text-lg font-semibold m-0 mb-1">Recent sign-ins</h3>
        <p className="text-[var(--muted-foreground)] text-sm mb-4 mt-0">
          Activity from the last 30 days.
        </p>
        <div className="flex flex-col">
          {mockSessions.map((s, i) => (
            <div
              key={s.id}
              className={`flex items-center gap-3.5 py-3.5 ${
                i === 0 ? "" : "border-t border-[var(--border)]"
              }`}
            >
              <div
                aria-hidden="true"
                className="w-10 h-10 rounded-xl bg-[var(--accent)] text-[var(--primary)] grid place-items-center shrink-0"
              >
                {s.icon === "phone" ? <Smartphone size={18} /> : <Laptop size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[15px]">{s.device}</div>
                <div className="text-[var(--muted-foreground)] text-[13px] mt-0.5 flex items-center gap-1.5">
                  <MapPin size={12} /> {s.location} · {s.time}
                </div>
              </div>
              {i === 0 && (
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{ background: "rgba(52,201,160,0.15)", color: "var(--secondary)" }}
                >
                  This device
                </span>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
