interface LinkedInPreviewProps {
  image: string;
  url: string;
  title: string;
}

export function LinkedInPreview({ image, url, title }: LinkedInPreviewProps) {
  return (
    <div className="overflow-hidden rounded-sm shadow-md">
      <div className="relative h-0 w-full pb-[52.25%]">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={image}
          alt="Preview image"
        />
      </div>
      <div className="break-words dark:bg-[#0E0E0F] light:bg-[#F2F3F5] p-2.5">
        <div className="space-y-1">
          <h3 className="text-base font-semibold leading-6">{title}</h3>
          <p className="truncate text-xs uppercase">{url}</p>
        </div>
      </div>
    </div>
  );
}
