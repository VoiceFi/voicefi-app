"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Inbox } from "lucide-react";
import { useWallets } from "@privy-io/react-auth/solana";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { truncateAddress } from "@/lib/utils";

type Contact = { id: string; name: string; address: string };

const SOLANA_ADDRESS_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export default function ContactsPage() {
  const supabase = useMemo(() => createClient(), []);
  const { wallets } = useWallets();
  const walletAddress = wallets[0]?.address ?? "";

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [addr, setAddr] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!walletAddress) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("contacts")
        .select("id, name, address")
        .eq("wallet_address", walletAddress)
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) setError(error.message);
      else setContacts(data ?? []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [supabase, walletAddress]);

  const addContact = async () => {
    const n = name.trim();
    const a = addr.trim();
    if (!walletAddress) {
      setError("Connect a wallet to save contacts.");
      return;
    }
    if (!n) {
      setError("Please enter a name.");
      return;
    }
    if (!SOLANA_ADDRESS_RE.test(a)) {
      setError("That doesn’t look like a valid Solana address.");
      return;
    }
    setSaving(true);
    setError(null);

    const { data, error: insertError } = await supabase
      .from("contacts")
      .insert({ wallet_address: walletAddress, name: n, address: a })
      .select("id, name, address")
      .single();

    setSaving(false);
    if (insertError) {
      setError(
        insertError.code === "23505"
          ? "You already saved this address."
          : insertError.message,
      );
      return;
    }
    if (data) setContacts((c) => [data, ...c]);
    setName("");
    setAddr("");
    setOpen(false);
  };

  const deleteContact = async (id: string) => {
    const previous = contacts;
    setContacts((c) => c.filter((x) => x.id !== id));
    const { error } = await supabase
      .from("contacts")
      .delete()
      .eq("id", id)
      .eq("wallet_address", walletAddress);
    if (error) {
      setError(error.message);
      setContacts(previous);
    }
  };

  return (
    <div className="max-w-[720px] mx-auto px-5 md:px-8 py-8 w-full" data-screen-label="Contacts">
      <header className="flex justify-between items-center mb-7">
        <div>
          <h2 className="text-[30px] font-bold tracking-tight m-0">Contacts</h2>
          <p className="text-[var(--muted-foreground)] mt-1.5 text-[15px]">
            People you can send money to by voice.
          </p>
        </div>
        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) setError(null);
          }}
        >
          <DialogTrigger asChild>
            <Button aria-label="Add contact">
              <Plus size={18} /> Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Add contact</DialogTitle>
            <DialogDescription className="mb-5">
              You can ask the assistant to send money to this person by name.
            </DialogDescription>

            <Label htmlFor="c-name">Name</Label>
            <Input
              id="c-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maria Lopez"
            />

            <Label htmlFor="c-addr" className="mt-4">
              Account ID
            </Label>
            <Input
              id="c-addr"
              value={addr}
              onChange={(e) => setAddr(e.target.value)}
              placeholder="7xKp9zM4..."
              className="mono text-sm"
            />

            {error && (
              <p className="text-sm text-[var(--destructive)] mt-3">{error}</p>
            )}

            <div className="flex gap-2.5 mt-6 justify-end">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addContact} disabled={saving}>
                {saving ? "Saving…" : "Save contact"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      {!open && error && (
        <p className="text-sm text-[var(--destructive)] mb-4">{error}</p>
      )}

      {loading ? (
        <div className="text-center py-16 text-[var(--muted-foreground)]">Loading…</div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-16 text-[var(--muted-foreground)]">
          <div className="w-20 h-20 mx-auto mb-5 rounded-[28px] bg-[var(--accent)] text-[var(--primary)] grid place-items-center">
            <Inbox size={36} />
          </div>
          <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">No contacts yet</h3>
          <p>Add someone to send them money by voice.</p>
        </div>
      ) : (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-[22px] py-2 px-5">
          {contacts.map((c, i) => (
            <div
              key={c.id}
              className={`flex items-center gap-3.5 py-3.5 ${
                i < contacts.length - 1 ? "border-b border-[var(--border)]" : ""
              }`}
            >
              <div
                aria-hidden="true"
                className="w-[46px] h-[46px] rounded-full grid place-items-center text-white font-semibold shrink-0"
                style={{ background: "linear-gradient(135deg, #4A90D9, #34C9A0)" }}
              >
                {c.name[0]?.toUpperCase() ?? "?"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-base">{c.name}</div>
                <div className="text-[var(--muted-foreground)] mono text-[13px] mt-0.5">
                  {truncateAddress(c.address)}
                </div>
              </div>
              <Button
                variant="danger"
                size="icon"
                onClick={() => deleteContact(c.id)}
                aria-label={`Delete ${c.name}`}
              >
                <Trash2 size={18} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
