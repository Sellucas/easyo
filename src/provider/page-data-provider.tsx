import { PageDataType } from "@/types";
import React, {
  useState,
  useEffect,
  ReactNode,
  useContext,
  createContext,
} from "react";

const initialPageData: PageDataType = {
  url: "Something went wrong...",
  indexable: false,
  title: "",
  description: "",
  headings: {
    h1: 0,
    h2: 0,
    h3: 0,
    h4: 0,
    h5: 0,
    h6: 0,
  },
  headingsContent: {
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
  },
  totalCharacters: 0,
  totalWords: 0,
  totalImages: 0,
  canonicalURL: false,
  httpStatus: 0,
  invalidLinks: [],
  isBrokenUrl: false,
  keywords: [],
  imgAlts: [],
  frames: [],
  robots: "",
  language: "",
  links: {
    internal: [],
    external: [],
  },
  openGraph: {
    title: "",
    description: "",
    image: "",
  },
  twitter: {
    card: "",
    title: "",
    description: "",
    image: "",
  },
};

const PageDataContext = createContext<
  | {
      pageData: PageDataType;
      setPageData: React.Dispatch<React.SetStateAction<PageDataType>>;
      dataLoaded: boolean;
    }
  | undefined
>(undefined);

const updatePageData = (prevData: PageDataType, message: any) => ({
  ...prevData,
  title: message.title || "",
  description: message.description || "",
  url: message.url || "Something went wrong...",
  headings: {
    h1: message.h1Elements || 0,
    h2: message.h2Elements || 0,
    h3: message.h3Elements || 0,
    h4: message.h4Elements || 0,
    h5: message.h5Elements || 0,
    h6: message.h6Elements || 0,
  },
  headingsContent: {
    h1: message.h1Content || [],
    h2: message.h2Content || [],
    h3: message.h3Content || [],
    h4: message.h4Content || [],
    h5: message.h5Content || [],
    h6: message.h6Content || [],
  },
  totalCharacters: message.totalCharacters || 0,
  totalWords: message.totalWords || 0,
  totalImages: message.totalImages || 0,
  httpStatus: message.httpStatus || 0,
  canonicalURL: message.canonicalURL || false,
  keywords: message.keywords || [],
  imgAlts: message.imgAlts || [],
  frames: message.frames || [],
  invalidLinks: message.invalidLinks || [],
  isBrokenUrl: message.isBrokenUrl || false,
  links: {
    internal: message.internalLinks || [],
    external: message.externalLinks || [],
  },
  robots: message.robotsMetaT || "",
  indexable: message.isIndexable || false,
  language: message.language || "",
  openGraph: {
    title: message.ogTitle || "",
    description: message.ogDescription || "",
    image: message.ogImage || "",
  },
  twitter: {
    card: message.ttCard || "",
    title: message.ttTitle || "",
    description: message.ttDescription || "",
    image: message.ttImage || "",
  },
});

export const PageDataProvider = ({ children }: { children: ReactNode }) => {
  const [pageData, setPageData] = useState<PageDataType>(initialPageData);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const getActiveTabData = () =>
      chrome.runtime.sendMessage({ action: "analyzePage" });
    getActiveTabData();
  }, []);

  useEffect(() => {
    const handleMessage = (message: any) => {
      setPageData((prevData) => updatePageData(prevData, message));
      setDataLoaded(true);
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, []);

  return (
    <PageDataContext.Provider value={{ pageData, setPageData, dataLoaded }}>
      {children}
    </PageDataContext.Provider>
  );
};

export const usePageData = () => {
  const context = useContext(PageDataContext);
  if (!context) {
    throw new Error("usePageData must be used within a PageDataProvider");
  }
  return context;
};
