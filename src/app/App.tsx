import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";

import type { Lang } from "./types";
import { LangCtx } from "./i18n/LangContext";
import { HOME_PATH, RESULTS_PATH, CATALOG_PATH, HOW_IT_WORKS_PATH, ABOUT_PATH } from "./routes";
import { Nav } from "./components/Nav";
import { HomeScreen } from "./pages/HomeScreen";
import { ResultsScreen } from "./pages/ResultsScreen";
import { CatalogScreen } from "./pages/CatalogScreen";
import { HowItWorksScreen } from "./pages/HowItWorksScreen";
import { AboutScreen } from "./pages/AboutScreen";

const LANG_STORAGE_KEY = "ratecheck-lang";
const DARK_STORAGE_KEY = "ratecheck-dark";

// ─── App Root ─────────────────────────────────────────────────────────────────

function readStoredLang(): Lang {
  return localStorage.getItem(LANG_STORAGE_KEY) === "en" ? "en" : "tr";
}
function readStoredDark(): boolean {
  return localStorage.getItem(DARK_STORAGE_KEY) === "1";
}

function AppShell() {
  const [lang, setLang] = useState<Lang>(readStoredLang);
  const [dark, setDark] = useState<boolean>(readStoredDark);
  const toggleDark = () => setDark((d) => !d);
  const { pathname } = useLocation();

  useEffect(() => { localStorage.setItem(LANG_STORAGE_KEY, lang); }, [lang]);
  useEffect(() => { localStorage.setItem(DARK_STORAGE_KEY, dark ? "1" : "0"); }, [dark]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [pathname]);

  return (
    <LangCtx.Provider value={{ lang, setLang, dark, toggleDark }}>
      <div className={`min-h-screen bg-background text-foreground antialiased${dark ? " dark" : ""}`}>
        <Nav />
        <Routes>
          <Route path={HOME_PATH} element={<HomeScreen />} />
          <Route path={RESULTS_PATH} element={<ResultsScreen />} />
          <Route path={CATALOG_PATH} element={<CatalogScreen />} />
          <Route path={HOW_IT_WORKS_PATH} element={<HowItWorksScreen />} />
          <Route path={ABOUT_PATH} element={<AboutScreen />} />
        </Routes>
      </div>
    </LangCtx.Provider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
