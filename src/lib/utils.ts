import { PageDataType } from "@/provider/page-data-provider";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDomain = (url: string) => url.split("/").slice(0, 3).join("/");

export const getBaseUrl = (url: string): string => {
  const withoutProtocol = url.replace(/^https?:\/\//, "");
  const withoutWww = withoutProtocol.replace(/^www\./, "");
  const domain = withoutWww.split("/")[0];
  return domain;
};

export function calculateScore(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  value = Math.max(inMin, Math.min(inMax, value));

  let mappedValue =
    ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

  mappedValue = Math.round(mappedValue);

  return Math.max(outMin, Math.min(outMax, mappedValue));
}

const invalidSuffixes = [".htm", ".html", ".shtml", ".php", ".jsp", ".asp"];

const checkCondition = (value: any, invalidValues: any) => {
  const invalidArray = Array.isArray(invalidValues)
    ? invalidValues
    : [invalidValues];
  return (
    value !== null && value !== undefined && !invalidArray.includes(value)
  );
};

export function calculateOverallScore(data: PageDataType): number {
  let score = 0;

  const weights = {
    title: 8,
    description: 8,
    url: 8,
    h1: 6,
    content: 8,
    images: 4,
    internalLinks: 10,
    externalLinks: 5,
    robots: 10,
    indexable: 8,
    canonicalURL: 5,
    language: 5,
    urlAnalysis: 10,
    openGraph: 5,
    twitterCard: 5,
  };

  

  const conditions = [
    { value: data.title, weight: weights.title, invalid: [""] },
    { value: data.description, weight: weights.description, invalid: [""] },
    {
      value: data.url,
      weight: weights.url,
      invalid: ["Something went wrong..."],
    },
    { value: data.headings.h1, weight: weights.h1, invalid: 0 },
    {
      value: data.totalWords >= 300,
      weight: weights.content,
      invalid: [false],
    },
    {
      value: data.imgAlts.every((alt: string) => alt),
      weight: weights.images,
      invalid: [false],
    },
    {
      value: data.links.internal.length,
      weight: weights.internalLinks,
      invalid: 0,
    },
    {
      value: data.links.external.length,
      weight: weights.externalLinks,
      invalid: 0,
    },
    { value: data.robots, weight: weights.robots, invalid: [""] },
    { value: data.indexable, weight: weights.indexable, invalid: [false] },
    { value: data.canonicalURL, weight: weights.canonicalURL, invalid: [""] },
    { value: data.language, weight: weights.language, invalid: [""] },
    {
      value:
        data.openGraph.title &&
        data.openGraph.description &&
        data.openGraph.image,
      weight: weights.openGraph,
      invalid: [false],
    },
    {
      value:
        data.twitter.card &&
        data.twitter.description &&
        data.twitter.image &&
        data.twitter.title,
      weight: weights.twitterCard,
      invalid: [false],
    },
    {
      value: data.links.internal.every(
        (link: string) =>
          !invalidSuffixes.some((suffix) => link.endsWith(suffix)) &&
          link.length < 100 &&
          !link.includes("+") &&
          !link.includes("%20") &&
          !link.includes("_") &&
          link === link.toLowerCase()
      ),
      weight: weights.urlAnalysis,
      invalid: [false],
    },
  ];

  conditions.forEach(({ value, weight, invalid }) => {
    if (checkCondition(value, invalid)) {
      score += weight;
    }
  });

  return score;
}

export function calculateLinkStructureScore(data: PageDataType): number {
  let score = 0;

  const internalLinks = data.links.internal?.length;
  if (internalLinks >= 3 && internalLinks <= 5) {
    score += 50 * 0.2;
  } else if (internalLinks >= 6 && internalLinks <= 10) {
    score += 100 * 0.2;
  }

  const externalLinks = data.links.external?.length;
  if (externalLinks >= 1 && externalLinks <= 3) {
    score += 100 * 0.15;
  } else if (externalLinks > 3 && externalLinks <= 5) {
    score += 50 * 0.15;
  }

  const totalLinks = internalLinks + externalLinks;
  const internalLinkRatio = totalLinks > 0 ? internalLinks / totalLinks : 0;
  if (internalLinkRatio >= 0.7) {
    score += 100 * 0.15;
  } else if (internalLinkRatio >= 0.5) {
    score += 50 * 0.15;
  }

  const validInternalLinks = data.links.internal?.filter(
    (link: string) =>
      !invalidSuffixes.some((suffix) => link.endsWith(suffix)) &&
      link.length < 100 &&
      !link.includes("+") &&
      !link.includes("%20") &&
      !link.includes("_") &&
      link === link.toLowerCase()
  );

  const highQualityLinkPercentage =
    (validInternalLinks.length / internalLinks) * 100;
  if (highQualityLinkPercentage >= 70) {
    score += 100 * 0.25;
  } else if (highQualityLinkPercentage >= 50) {
    score += 50 * 0.25;
  }

  return Math.min(Math.max(score, 0), 100);
}

export function calculateContentDepthScore(data: PageDataType): number {
  let score = 0;

  const weights = {
    totalWords: 30,
    h1: 20,
    h2: 20,
    h3: 20,
    images: 10,
  };

  const conditions = [
    {
      value: data.totalWords >= 300,
      weight: weights.totalWords,
      invalid: [false],
    },
    {
      value: data.headings.h1 >= 1,
      weight: weights.h1,
      invalid: [false],
    },
    {
      value: data.headings.h2 >= 2,
      weight: weights.h2,
      invalid: [false],
    },
    {
      value: data.headings.h3 >= 2,
      weight: weights.h3,
      invalid: [false],
    },
    {
      value: data.totalImages > 0,
      weight: weights.images,
      invalid: [false],
    },
  ];

  conditions.forEach(({ value, weight, invalid }) => {
    if (checkCondition(value, invalid)) {
      score += weight;
    }
  });

  return Math.min(Math.max(score, 0), 100);
}
