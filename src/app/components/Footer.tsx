import logoBlack from "../../assets/rate-check-logotype-black-rgb.svg";
import logoWhite from "../../assets/rate-check-logotype-white-rgb.svg";
import linkedinDark from "../../assets/linkedin-icon-dark.svg";
import linkedinLight from "../../assets/linkedin-icon-light.svg";
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
        <a href="https://www.linkedin.com/company/ratecheckapp" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 py-2 text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors">
          <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden">
            <img src={dark ? linkedinLight : linkedinDark} alt="" className="h-full w-full object-contain" />
          </span>
          LinkedIn
        </a>
      </div>
    </footer>
  );
}
