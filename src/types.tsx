export type HeadingsType = {
  h1: number;
  h2: number;
  h3: number;
  h4: number;
  h5: number;
  h6: number;
};

export type HeadingsContentType = {
  h1: string[];
  h2: string[];
  h3: string[];
  h4: string[];
  h5: string[];
  h6: string[];
};

export type LinksType = {
  internal: {href: string, content?: string, hasNoFollow: boolean}[]
  external: {href: string, content?: string, hasNoFollow: boolean}[]
};

export type OpenGraphType = {
  title: string;
  description: string;
  image: string;
};

export type TwitterType = {
  card: string;
  title: string;
  description: string;
  image: string;
};

export type PageDataType = {
  url: string;
  indexable: boolean;
  title: string;
  description: string;
  headings: HeadingsType;
  headingsContent: HeadingsContentType;
  totalCharacters: number;
  imgAlts: string[];
  totalWords: number;
  totalImages: number;
  keywords: string[];
  robots: string;
  language: string;
  links: LinksType;
  openGraph: OpenGraphType;
  twitter: TwitterType;
  httpStatus: number;
  canonicalURL: boolean;
  isBrokenUrl: boolean;
  invalidLinks: string[];
  frames: string[];
};
