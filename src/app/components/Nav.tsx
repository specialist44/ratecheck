import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Menu, Moon, Sun, X } from "lucide-react";
import logoBlack from "../../assets/rate-check-logotype-black-rgb.svg";
import logoWhite from "../../assets/rate-check-logotype-white-rgb.svg";
import type { Lang } from "../types";
import { useLang, useLangCtx } from "../i18n/LangContext";
import { HOME_PATH, CATALOG_PATH, HOW_IT_WORKS_PATH, ABOUT_PATH } from "../routes";

export function Nav() {
  const t = useLang();
  const { lang, setLang, dark, toggleDark } = useLangCtx();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const link = (label: string, target: string) => (
    <button
      onClick={() => { navigate(target); setOpen(false); }}
      className={`text-sm whitespace-nowrap transition-colors ${pathname === target ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
    >
      {label}
    </button>
  );

  const LangToggle = ({ mobile }: { mobile?: boolean }) => (
    <div className={`flex gap-1 ${mobile ? "" : ""}`}>
      {(["tr", "en"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`text-xs px-2.5 py-1 rounded-lg border font-semibold uppercase transition-all ${
            lang === l ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground/40"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between gap-4">
        <button onClick={() => navigate(HOME_PATH)} className="select-none shrink-0">
          <img src={dark ? logoWhite : logoBlack} alt="RateCheck" className="h-6 w-auto" />
        </button>
        <div className="hidden md:flex items-center justify-center gap-5 flex-1 min-w-0">
          {link(t.navHome, HOME_PATH)}
          {link(t.navCatalog, CATALOG_PATH)}
          {link(t.navHow, HOW_IT_WORKS_PATH)}
          {link(t.navAbout, ABOUT_PATH)}
        </div>
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <LangToggle />
          <button
            onClick={toggleDark}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
        <div className="flex md:hidden items-center gap-2 shrink-0">
          <LangToggle mobile />
          <button
            onClick={toggleDark}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
        <button className="md:hidden p-1" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background px-5 py-4 flex flex-col gap-3">
          {link(t.navHome, HOME_PATH)}
          {link(t.navCatalog, CATALOG_PATH)}
          {link(t.navHow, HOW_IT_WORKS_PATH)}
          {link(t.navAbout, ABOUT_PATH)}
        </div>
      )}
    </nav>
  );
}
