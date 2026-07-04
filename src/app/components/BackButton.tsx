import { useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import { useLang } from "../i18n/LangContext";

export function BackButton() {
  const t = useLang();
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
      <ArrowRight size={14} className="rotate-180" />{t.back}
    </button>
  );
}
