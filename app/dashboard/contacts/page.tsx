"use client";

import { useState, useRef, useCallback } from "react";
import { Plus, Trash2, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { mockContacts, type Contact } from "@/lib/mock-data";
import { truncateAddress } from "@/lib/utils";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [addr, setAddr] = useState("");
  const deleteBtnRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  const addBtnRef = useRef<HTMLButtonElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const setDeleteRef = useCallback((id: number, el: HTMLButtonElement | null) => {
    if (el) deleteBtnRefs.current.set(id, el);
    else deleteBtnRefs.current.delete(id);
  }, []);

  const addContact = () => {
    if (!name.trim() || !addr.trim()) return;
    setContacts((c) => [
      ...c,
      {
        id: Date.now(),
        name: name.trim(),
        address: addr.trim(),
        initial: name.trim()[0].toUpperCase(),
      },
    ]);
    setName("");
    setAddr("");
    setOpen(false);
  };

  const deleteContact = (id: number, index: number) => {
    setContacts((prev) => {
      const next = prev.filter((x) => x.id !== id);

      // Move focus after React commits the DOM update
      requestAnimationFrame(() => {
        if (next.length === 0) {
          // No contacts left → focus Add button
          addBtnRef.current?.focus();
          return;
        }

        // Try next contact at same index
        const nextId = next[index]?.id ?? next[next.length - 1]?.id;
        if (nextId != null) {
          const btn = deleteBtnRefs.current.get(nextId);
          btn?.focus();
        }
      });

      return next;
    });
  };

  return (
    <div className="max-w-[720px] mx-auto px-5 md:px-8 py-8 w-full" data-screen-label="Contacts">
      <header className="flex justify-between items-center mb-7">
        <div>
          <h2 className="text-[28px] font-bold tracking-tight m-0">Contacts</h2>
          <p className="text-[var(--muted-foreground)] mt-2 text-base leading-relaxed">
            People you can send money to by voice.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button ref={addBtnRef} aria-label="Add contact">
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

            <div className="flex gap-2.5 mt-6 justify-end">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addContact}>Save contact</Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      {contacts.length === 0 ? (
        <div className="text-center py-16 text-[var(--muted-foreground)]">
          <div className="w-20 h-20 mx-auto mb-5 rounded-[28px] bg-[var(--accent)] text-[var(--primary)] grid place-items-center">
            <Inbox size={36} />
          </div>
          <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">No contacts yet</h3>
          <p>Add someone to send them money by voice.</p>
        </div>
      ) : (
        <div
          ref={listContainerRef}
          className="bg-[var(--card)] border border-[var(--border)] rounded-[22px] py-2 px-5"
        >
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
                style={{ background: "linear-gradient(135deg, #4A90D9, #168060)" }}
              >
                {c.initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-base">{c.name}</div>
                <div className="text-[var(--muted-foreground)] mono text-[13px] mt-0.5">
                  {truncateAddress(c.address)}
                </div>
              </div>
              <Button
                ref={(el) => setDeleteRef(c.id, el)}
                variant="danger"
                size="icon"
                onClick={() => deleteContact(c.id, i)}
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
