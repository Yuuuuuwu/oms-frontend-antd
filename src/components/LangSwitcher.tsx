import React from "react";
import type { LangType } from "../contexts/ThemeLangContext";

interface LangSwitcherProps {
  lang: LangType;
  setLang: (lang: LangType) => void;
  locales: Record<string, { label: string }>;
}

const LangSwitcher: React.FC<LangSwitcherProps> = ({ lang, setLang, locales }) => (
  <div>
    {Object.entries(locales).map(([key, v]) => (
      <button
        key={key}
        style={{
          margin: 4,
          background: lang === key ? "#1677ff" : "#fff",
          color: lang === key ? "#fff" : "#222",
          border: "1px solid #e0e0e0",
          borderRadius: 4,
          padding: "2px 8px",
          cursor: "pointer",
        }}
        onClick={() => setLang(key as LangType)}
      >
        {v.label}
      </button>
    ))}
  </div>
);

export default LangSwitcher;
