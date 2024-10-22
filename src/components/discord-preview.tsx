interface DiscordPreviewProps {
  image: string;
  title: string;
  description: string;
}

export function DiscordPreview({
  image,
  title,
  description,
}: DiscordPreviewProps) {
  return (
    <div className="overflow-hidden rounded-sm border-l-4 border-[#202225] bg-[#2f3136]">
      <div className="grid gap-2 p-3 pr-4">
        <div className="text-base font-semibold text-[#00b0f4]">{title}</div>
        <div className="whitespace-pre-line text-sm text-[#dcddde]">
          {description}
        </div>
        <div className="mt-2 overflow-hidden rounded">
          <div className="relative block">
            <img src={image} alt="Preview image" className="w-3/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
