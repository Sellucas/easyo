import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type HeadingsType = {
  h1: number;
  h2: number;
  h3: number;
  h4: number;
  h5: number;
  h6: number;
};

type LinksType = {
  internal: string[];
  external: string[];
};

type OpenGraphType = {
  title: string;
  description: string;
  image: string;
};

type TwitterType = {
  card: string;
  title: string;
  description: string;
  image: string;
};

type PageDataType = {
  url: string;
  indexable: boolean;
  title: string;
  description: string;
  headings: HeadingsType;
  totalCharacters: number;
  totalWords: number;
  totalImages: number;
  keywords: string[];
  robots: string;
  language: string;
  links: LinksType;
  openGraph: OpenGraphType;
  twitter: TwitterType;
  httpStatus: number
};

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
  totalCharacters: 0,
  totalWords: 0,
  totalImages: 0,
  httpStatus: 0,
  keywords: [],
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
    }
  | undefined
>(undefined);

// Função auxiliar para atualizar os dados
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
  totalCharacters: message.totalCharacters || 0,
  totalWords: message.totalWords || 0,
  totalImages: message.totalImages || 0,
  httpStatus: message.httpStatus || 0,
  keywords: message.keywords || [],
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

// Criar o provider
export const PageDataProvider = ({ children }: { children: ReactNode }) => {
  const [pageData, setPageData] = useState<PageDataType>(initialPageData);

  useEffect(() => {
    const getActiveTabData = () =>
      chrome.runtime.sendMessage({ action: "analyzePage" });
    getActiveTabData();
  }, []);

  useEffect(() => {
    const handleMessage = (message: any) => {
      setPageData((prevData) => updatePageData(prevData, message));
    };
    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage); // Cleanup listener
  }, []);

  return (
    <PageDataContext.Provider value={{ pageData, setPageData }}>
      {children}
    </PageDataContext.Provider>
  );
};

// Hook para usar o contexto
export const usePageData = () => {
  const context = useContext(PageDataContext);
  if (!context) {
    throw new Error("usePageData deve ser usado dentro de PageDataProvider");
  }
  return context;
};
