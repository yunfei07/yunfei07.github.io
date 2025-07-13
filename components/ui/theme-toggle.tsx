"use client";

import { SunIcon, MoonIcon, DesktopIcon } from "@radix-ui/react-icons";
import { useTheme } from "@/lib/theme/theme-context"
import { useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { value: "light", icon: SunIcon, label: "浅色" },
    { value: "dark", icon: MoonIcon, label: "深色" },
    { value: "system", icon: DesktopIcon, label: "跟随系统" },
  ] as const;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-borders-non-interactive bg-sidebar-bg text-low-contrast-text transition-all hover:border-subtle-borders-interactive hover:bg-ui-component-default hover:text-high-contrast-text"
        aria-label="切换主题"
      >
        {theme === "light" && <SunIcon width={16} height={16} />}
        {theme === "dark" && <MoonIcon width={16} height={16} />}
        {theme === "system" && <DesktopIcon width={16} height={16} />}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-10 z-20 min-w-[120px] rounded-md border border-borders-non-interactive bg-ui-component-default p-1 shadow-lg">
            {themes.map((themeOption) => {
              const Icon = themeOption.icon;
              return (
                <button
                  key={themeOption.value}
                  onClick={() => {
                    setTheme(themeOption.value);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors hover:bg-ui-component-hover ${
                    theme === themeOption.value
                      ? "bg-ui-component-pressed-selected text-high-contrast-text"
                      : "text-low-contrast-text"
                  }`}
                >
                  <Icon width={14} height={14} />
                  {themeOption.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
