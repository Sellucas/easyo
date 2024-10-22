import { Label } from "./ui/label";

interface StatItemProps {
  label: string;
  value: number;
}

export const StatItem = ({ label, value }: StatItemProps) => {
  return (
    <div className="flex flex-col gap-2 items-center p-4">
      <Label className="uppercase text-xs">{label}</Label>
      <span className="text-xl leading-6">{value}</span>
    </div>
  );
};
