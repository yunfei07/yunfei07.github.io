"use client";

import { SunIcon, MoonIcon, DesktopIcon } from "@radix-ui/react-icons";
import { useTheme } from "@/lib/theme/theme-context"
import { useState, useRef, useEffect, useMemo } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const themes = useMemo(() => [
    { value: "light", icon: SunIcon, label: "浅色", description: "使用浅色主题" },
    { value: "dark", icon: MoonIcon, label: "深色", description: "使用深色主题" },
    { value: "system", icon: DesktopIcon, label: "跟随系统", description: "跟随系统主题设置" },
  ] as const, []);

  // 获取当前主题的标签
  const currentThemeLabel = themes.find(t => t.value === theme)?.label || "主题";

  // 处理键盘导航
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) {
      // 菜单关闭时，Enter 或 Space 打开菜单
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setIsOpen(true);
        setFocusedIndex(themes.findIndex(t => t.value === theme));
      }
      return;
    }

    // 菜单打开时的键盘导航
    switch (event.key) {
      case "Escape":
        event.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        buttonRef.current?.focus();
        break;
      case "ArrowDown":
        event.preventDefault();
        setFocusedIndex(prev => (prev + 1) % themes.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        setFocusedIndex(prev => prev <= 0 ? themes.length - 1 : prev - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (focusedIndex >= 0) {
          handleThemeSelect(themes[focusedIndex].value);
        }
        break;
      case "Home":
        event.preventDefault();
        setFocusedIndex(0);
        break;
      case "End":
        event.preventDefault();
        setFocusedIndex(themes.length - 1);
        break;
    }
  };

  // 处理主题选择
  const handleThemeSelect = (selectedTheme: typeof theme) => {
    setTheme(selectedTheme);
    setIsOpen(false);
    setFocusedIndex(-1);
    buttonRef.current?.focus();
  };

  // 处理点击外部关闭菜单
  const handleClickOutside = () => {
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  // 处理菜单项点击
  const handleMenuItemClick = (themeValue: typeof theme, index: number) => {
    setFocusedIndex(index);
    handleThemeSelect(themeValue);
  };

  // 当菜单打开时，设置焦点管理
  useEffect(() => {
    if (isOpen && focusedIndex >= 0) {
      const menuItems = menuRef.current?.querySelectorAll('[role="menuitem"]');
      const focusedItem = menuItems?.[focusedIndex] as HTMLElement;
      focusedItem?.focus();
    }
  }, [isOpen, focusedIndex]);

  // 处理菜单打开时的初始焦点设置
  useEffect(() => {
    if (isOpen && focusedIndex === -1) {
      // 默认聚焦到当前选中的主题
      const currentIndex = themes.findIndex(t => t.value === theme);
      setFocusedIndex(currentIndex >= 0 ? currentIndex : 0);
    }
  }, [isOpen, theme, focusedIndex, themes]);

  // 当菜单关闭时重置焦点索引
  useEffect(() => {
    if (!isOpen) {
      setFocusedIndex(-1);
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="theme-transition flex h-9 w-9 items-center justify-center rounded-md border border-borders-non-interactive bg-sidebar-bg text-low-contrast-text hover:border-subtle-borders-interactive hover:bg-ui-component-default hover:text-high-contrast-text focus:border-stronger-borders-interactive-focus-rings focus:outline-none focus:ring-2 focus:ring-stronger-borders-interactive-focus-rings focus:ring-offset-2 focus:ring-offset-app-bg"
        aria-label={`当前主题: ${currentThemeLabel}. 点击选择主题`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        type="button"
      >
        {theme === "light" && <SunIcon width={16} height={16} aria-hidden="true" />}
        {theme === "dark" && <MoonIcon width={16} height={16} aria-hidden="true" />}
        {theme === "system" && <DesktopIcon width={16} height={16} aria-hidden="true" />}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={handleClickOutside}
            aria-hidden="true"
          />
          <div
            ref={menuRef}
            className="theme-transition absolute right-0 top-10 z-20 min-w-[140px] animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 rounded-md border border-borders-non-interactive bg-ui-component-default p-1 shadow-lg"
            role="menu"
            aria-label="主题选择菜单"
            onKeyDown={handleKeyDown}
          >
            {themes.map((themeOption, index) => {
              const Icon = themeOption.icon;
              const isSelected = theme === themeOption.value;
              const isFocused = focusedIndex === index;
              
              return (
                <button
                  key={themeOption.value}
                  onClick={() => handleMenuItemClick(themeOption.value, index)}
                  onMouseEnter={() => setFocusedIndex(index)}
                  className={`theme-transition flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-left hover:bg-ui-component-hover focus:bg-ui-component-hover focus:outline-none ${
                    isSelected
                      ? "bg-ui-component-pressed-selected text-high-contrast-text"
                      : "text-low-contrast-text"
                  } ${
                    isFocused ? "bg-ui-component-hover" : ""
                  }`}
                  role="menuitem"
                  aria-current={isSelected ? "true" : "false"}
                  aria-describedby={`theme-${themeOption.value}-desc`}
                  tabIndex={isFocused ? 0 : -1}
                >
                  <Icon width={14} height={14} aria-hidden="true" />
                  <span className="flex-1">{themeOption.label}</span>
                  {isSelected && (
                    <span className="text-xs opacity-60" aria-hidden="true">✓</span>
                  )}
                  <span id={`theme-${themeOption.value}-desc`} className="sr-only">
                    {themeOption.description}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
