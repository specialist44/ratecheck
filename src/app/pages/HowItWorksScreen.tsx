import { Database, Download, FileText } from "lucide-react";
import { useLang } from "../i18n/LangContext";
import { BackButton } from "../components/BackButton";
import { Footer } from "../components/Footer";

export function HowItWorksScreen() {
  const t = useLang();
  const steps = [
    { num: "01", title: t.step1Title, desc: t.step1Desc },
    { num: "02", title: t.step2Title, desc: t.step2Desc },
    { num: "03", title: t.step3Title, desc: t.step3Desc },
  ];
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-5 pt-16 pb-20">
          <BackButton />
          <div className="mb-16 max-w-xl">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3">{t.howLabel}</p>
            <h1 className="text-4xl font-bold tracking-tight mb-4 leading-tight">{t.howTitle}</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">{t.howSub}</p>
          </div>
          <div className="mb-16">
            {steps.map((step, i) => (
              <div key={step.num} className="flex gap-6 pb-10 relative">
                {i < steps.length - 1 && <div className="absolute left-5 top-12 bottom-0 w-px bg-border" />}
                <div className="w-10 h-10 rounded-full border-2 border-foreground flex items-center justify-center text-xs font-bold shrink-0 bg-background z-10">{step.num}</div>
                <div className="pt-2">
                  <h3 className="font-semibold mb-1.5">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 bg-muted rounded-2xl">
              <Database size={18} className="mb-3 text-foreground" />
              <h4 className="font-semibold text-sm mb-2">{t.dataTitle}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{t.dataDesc}</p>
            </div>
            <a href="/seffaflik-raporu.pdf" download className="group p-6 bg-muted rounded-2xl block border border-transparent transition-all hover:bg-muted/70 hover:border-foreground/20 hover:shadow-md">
              <FileText size={18} className="mb-3 text-foreground" />
              <h4 className="font-semibold text-sm mb-2">{t.pdfInfoTitle}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{t.pdfInfoDesc}</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground min-h-[44px]">
                {t.pdfDownloadLink}
                <Download size={14} className="transition-transform group-hover:translate-y-0.5" />
              </span>
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
