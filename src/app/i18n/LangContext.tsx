import { createContext, useContext } from "react";
import type { Lang } from "../types";
import { TR } from "./tr";
import { EN } from "./en";

export const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void; dark: boolean; toggleDark: () => void }>({
  lang: "tr", setLang: () => {}, dark: false, toggleDark: () => {},
});
export const useLang = () => { const { lang } = useContext(LangCtx); return lang === "tr" ? TR : EN; };
export const useLangCtx = () => useContext(LangCtx);
