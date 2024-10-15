import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";

export const Header = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex items-center justify-between pb-6">
      <h1 className="text-balance text-4xl font-medium leading-none tracking-tighter font-[Play]">
        easyo
      </h1>
      <Button
        variant={"outline"}
        size={"icon"}
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
        <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
};