import { useLang } from "../i18n/LangContext";

export function NoticeBanner({ spacing = "mt-10" }: { spacing?: string }) {
  const t = useLang();
  return (
    <div className={`${spacing} p-4 bg-muted rounded-xl`}>
      <p className="text-xs text-muted-foreground">{t.notice}{" "}
        <span className="underline cursor-pointer text-foreground">{t.noticeLink}</span>
      </p>
    </div>
  );
}
