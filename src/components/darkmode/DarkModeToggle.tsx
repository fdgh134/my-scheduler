import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // 테마 변경 처리
  const applyTheme = (dark: boolean) => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // 상태가 바뀔 때마다 테마 적용
  useEffect(() => {
    applyTheme(isDark);
  }, [isDark]);

  // 초기 렌더 시 현재 theme 적용 (새로고침 대응)
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    applyTheme(storedTheme === "dark");
  }, []);

  return (
    <button
      className="ml-4 px-3 py-1 rounded-md text-sm bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
      onClick={() => setIsDark(!isDark)}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
