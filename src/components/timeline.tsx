import { usePageData } from "@/provider/page-data-provider";

export const Timeline = () => {
  const { pageData } = usePageData();

  return (
    <ol className="border-s space-y-4 mt-2">
      {pageData.headingsContent.h1?.map((item, index) => (
        <li key={index} className="flex gap-2 items-center">
          <div className="flex items-center">
            <hr className="w-2" />
            <h3 className="bg-[#ff000033] py-1 px-2 rounded text-xs">H1</h3>
          </div>
          <div>
            <p>{item}</p>
          </div>
        </li>
      ))}
      {pageData.headingsContent.h2?.map((item, index) => (
        <li key={index} className="flex gap-2 items-center">
          <div className="flex items-center">
            <hr className="w-4" />
            <h3 className="bg-[#0000ff33] py-1 px-2 rounded text-xs">H2</h3>
          </div>
          <p>{item}</p>
        </li>
      ))}
      {pageData.headingsContent.h3?.map((item, index) => (
        <li key={index} className="flex gap-2 items-center">
          <div className="flex items-center">
            <hr className="w-6" />
            <h3 className="bg-[#00ff0033] py-1 px-2 rounded text-xs">H3</h3>
          </div>
          <p>{item}</p>
        </li>
      ))}
      {pageData.headingsContent.h4?.map((item, index) => (
        <li key={index} className="flex gap-2 items-center">
          <div className="flex items-center">
            <hr className="w-8" />
            <h3 className="bg-[#00ffff33] py-1 px-2 rounded text-xs">H4</h3>
          </div>
          <p>{item}</p>
        </li>
      ))}
      {pageData.headingsContent.h5?.map((item, index) => (
        <li key={index} className="flex gap-2 items-center">
          <div className="flex items-center">
            <hr className="w-10" />
            <h3 className="bg-[#ffff0033] py-1 px-2 rounded text-xs">H5</h3>
          </div>
          <p>{item}</p>
        </li>
      ))}
      {pageData.headingsContent.h6?.map((item, index) => (
        <li key={index} className="flex gap-2 items-center">
          <div className="flex items-center">
            <hr className="w-12" />
            <h3 className="bg-[#ff00ff33] py-1 px-2 rounded text-xs">H6</h3>
          </div>
          <p>{item}</p>
        </li>
      ))}
    </ol>
  );
};
