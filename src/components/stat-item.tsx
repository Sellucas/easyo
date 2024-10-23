import { Input } from "./ui/input";

interface StatItemProps {
  label: string;
  value: number;
}

export const StatItem = ({ label, value }: StatItemProps) => {
  return (
    <div className="space-y-2">
      <div className="flex rounded-lg shadow-sm shadow-black/[.04]">
        <span className="-z-10 inline-flex items-center rounded-s-lg border border-input bg-background px-3 text-sm text-muted-foreground">
          {label}
        </span>
        <Input
          id="input-14"
          className="-ms-px rounded-s-none shadow-none text-xs lining-nums"
          placeholder="Missing"
          value={value}
        />
      </div>
    </div>
  );
};
