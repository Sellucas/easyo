interface FacebookPreviewProps {
  image: string;
  url: string;
  title: string;
  description: string;
}

export function FacebookPreview({
  image,
  url,
  title,
  description,
}: FacebookPreviewProps) {
  return (
    <div className="overflow-hidden border">
      <div className="relative h-0 w-full pb-[52.25%]">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={image}
          alt="Preview image"
        />
      </div>
      <div className="break-words border-t p-3 dark:bg-[#0E0E0F] light:bg-[#F2F3F5]">
        <div className="overflow-hidden truncate font-light whitespace-nowrap text-xs uppercase leading-3">
          {url}
        </div>
        <div className="mt-1 space-y-1 overflow-hidden">
          <h3 className="truncate text-base font-semibold leading-5">
            {title}
          </h3>
          <p className="line-clamp-1 text-xs leading-5">{description}</p>
        </div>
      </div>
    </div>
  );
}
