import React, { createContext, useContext, useEffect, useState } from "react";
import zhTW from "antd/locale/zh_TW";
import zhCN from "antd/locale/zh_CN";
import enUS from "antd/locale/en_US";
import jaJP from "antd/locale/ja_JP";
import dayjs from "dayjs";
import "dayjs/locale/zh-tw";
import "dayjs/locale/zh-cn";
import "dayjs/locale/en";
import "dayjs/locale/ja";

// 型別定義
export type ThemeType = "light" | "dark";
export type LangType = "zh-tw" | "zh-cn" | "en" | "ja";

// 所有語言資料
const locales = {
  "zh-tw": { antd: zhTW, dayjs: "zh-tw", label: "繁體中文" },
  "zh-cn": { antd: zhCN, dayjs: "zh-cn", label: "简体中文" },
  en: { antd: enUS, dayjs: "en", label: "English" },
  ja: { antd: jaJP, dayjs: "ja", label: "日本語" },
} as const;

interface ThemeLangContextProps {
  theme: ThemeType;
  lang: LangType;
  setTheme: (t: ThemeType) => void;
  setLang: (l: LangType) => void;
  locales: typeof locales;
}

const ThemeLangContext = createContext<ThemeLangContextProps | undefined>(
  undefined
);

export const useThemeLang = () => {
  const ctx = useContext(ThemeLangContext);
  if (!ctx) throw new Error("useThemeLang 必須包在 ThemeLangProvider 內");
  return ctx;
};

export const ThemeLangProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<ThemeType>(
    (localStorage.getItem("theme") as ThemeType) || "light"
  );
  const [lang, setLang] = useState<LangType>(
    (localStorage.getItem("lang") as LangType) || "zh-tw"
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("lang", lang);
    dayjs.locale(locales[lang].dayjs);
  }, [lang]);

  return (
    <ThemeLangContext.Provider
      value={{ theme, lang, setTheme, setLang, locales }}
    >
      {children}
    </ThemeLangContext.Provider>
  );
};
