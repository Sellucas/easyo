interface TwitterPreviewProps {
  image: string;
  url: string;
}

export function TwitterPreview({ image, url }: TwitterPreviewProps) {
  return (
    <div className="relative overflow-hidden rounded-[0.85714em] border leading-[1.3em]">
      <div className="relative h-0 w-full pb-[52.33%]">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={image}
          alt="Preview image"
        />
      </div>
      <div className="absolute bottom-2 left-2 rounded bg-black bg-opacity-40 px-1 py-0.5 text-xs text-white">
        {url}
      </div>
    </div>
  );
}
