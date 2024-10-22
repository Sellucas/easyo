import { cn } from "@/lib/utils";

interface SocialPreviewSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function SocialPreviewSection({
  title,
  children,
  className,
}: SocialPreviewSectionProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex gap-2 items-center">
        <h3 className="font-semibold">{title}</h3>
        <hr className="w-full text-muted" />
      </div>
      {children}
    </div>
  );
}
