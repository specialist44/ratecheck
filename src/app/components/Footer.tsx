import logoBlack from "../../assets/rate-check-logotype-black-rgb.svg";
import logoWhite from "../../assets/rate-check-logotype-white-rgb.svg";
import { useLang, useLangCtx } from "../i18n/LangContext";

export function Footer() {
  const t = useLang();
  const { dark } = useLangCtx();
  return (
    <footer className="border-t border-border">
      <div className="max-w-5xl mx-auto px-5 pt-12 pb-8 flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <img src={dark ? logoWhite : logoBlack} alt="RateCheck" className="h-5 w-auto mb-1.5" />
          <p className="text-xs text-muted-foreground">{t.footerTagline}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{t.footerCopy}</p>
        </div>
        <a href="#" className="inline-block py-2 text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors">LinkedIn</a>
      </div>
    </footer>
  );
}
