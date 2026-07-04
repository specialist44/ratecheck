import { useState } from "react";
import type { FormEvent } from "react";
import { Check, ChevronRight } from "lucide-react";
import { useLang } from "../i18n/LangContext";
import { BackButton } from "../components/BackButton";
import { Footer } from "../components/Footer";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mzdlydrl";

export function AboutScreen() {
  const t = useLang();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "succeeded" | "error">("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      setStatus(res.ok ? "succeeded" : "error");
    } catch {
      setStatus("error");
    }
  };
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-5 pt-16 pb-20">
          <BackButton />
          <div className="mb-16 grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3">{t.aboutLabel}</p>
              <h1 className="text-4xl font-bold tracking-tight mb-6">{t.aboutTitle}</h1>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>{t.aboutP1}</p><p>{t.aboutP2}</p><p>{t.aboutP3}</p>
              </div>
            </div>
            <div className="md:pt-16">
              <span className="text-xs text-muted-foreground block mb-1">{t.stat1}</span>
              <span className="font-bold text-3xl block mb-2">2026</span>
              <p className="text-xs text-muted-foreground leading-relaxed">{t.aboutFoundedNote}</p>
            </div>
          </div>
          <div className="border-t border-border pt-12">
            <h2 className="text-2xl font-bold tracking-tight mb-2">{t.contactTitle}</h2>
            <p className="text-sm text-muted-foreground mb-8">{t.contactSub}</p>
            {status === "succeeded" ? (
              <div className="p-10 bg-muted rounded-2xl text-center">
                <div className="w-10 h-10 bg-foreground rounded-full flex items-center justify-center mx-auto mb-4"><Check size={18} className="text-background" /></div>
                <p className="font-semibold mb-1">{t.sentTitle}</p>
                <p className="text-sm text-muted-foreground">{t.sentSub}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">{t.labelName}</label>
                    <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder={t.namePh}
                      className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm bg-background placeholder:text-muted-foreground focus:outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">{t.labelEmail}</label>
                    <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder={t.emailPh}
                      className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm bg-background placeholder:text-muted-foreground focus:outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">{t.labelMessage}</label>
                  <textarea name="message" value={message} onChange={(e) => setMessage(e.target.value)} required rows={5} placeholder={t.messagePh}
                    className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm bg-background placeholder:text-muted-foreground focus:outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10 resize-none transition-all" />
                </div>
                {status === "error" && (
                  <p className="text-sm text-red-500">{t.sendError}</p>
                )}
                <button type="submit" disabled={status === "submitting"}
                  className="px-8 py-3 bg-foreground text-background rounded-xl font-semibold text-sm hover:opacity-85 disabled:opacity-60 transition-all flex items-center gap-2">
                  {status === "submitting" ? t.sendingBtn : t.sendBtn} <ChevronRight size={15} />
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
