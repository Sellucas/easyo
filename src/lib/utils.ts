import { PageDataType } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDomain(url: string) {
  return url.split("/").slice(0, 3).join("/");
}

export function getBaseUrl(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0];
}

export function calculateScore(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) {
  value = Math.max(inMin, Math.min(inMax, value));
  const mappedValue =
    ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  return Math.max(outMin, Math.min(outMax, Math.round(mappedValue)));
}

const invalidSuffixes = [".htm", ".html", ".shtml", ".php", ".jsp", ".asp"];

const checkCondition = (value: any, invalidValues: any) => {
  const invalidArray = Array.isArray(invalidValues)
    ? invalidValues
    : [invalidValues];
  return value != null && !invalidArray.includes(value);
};

export function calculateOverallScore(data: PageDataType): number {
  const weights = {
    title: 8,
    description: 7,
    url: 7,
    h1: 6,
    content: 7,
    images: 4,
    internalLinks: 9,
    externalLinks: 5,
    robots: 9,
    indexable: 7,
    canonicalURL: 4,
    language: 4,
    urlAnalysis: 9,
    openGraph: 4,
    twitterCard: 4,
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
      value: data.imgAlts.every((alt) => alt),
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
        (link) =>
          !invalidSuffixes.some((suffix) =>
          link.href.endsWith(suffix)) &&
          link.href.length < 100 &&
          !link.href.includes("+") &&
          !link.href.includes("%20") &&
          !link.href.includes("_") &&
          link.href === link.href.toLowerCase()
      ),
      weight: weights.urlAnalysis,
      invalid: [false],
    },
  ];

  return conditions.reduce(
    (score, { value, weight, invalid }) =>
      checkCondition(value, invalid) ? score + weight : score,
    0
  );
}

export function calculateLinkStructureScore(data: PageDataType): number {
  let score = 0;
  const internalLinks = data.links.internal?.length || 0;
  const externalLinks = data.links.external?.length || 0;
  const totalLinks = internalLinks + externalLinks;

  if (internalLinks >= 3 && internalLinks <= 5) score += 10;
  else if (internalLinks > 5) score += 25;

  if (externalLinks >= 1 && externalLinks <= 3) score += 20;
  else if (externalLinks > 3) score += 10;

  const internalLinkRatio = totalLinks > 0 ? internalLinks / totalLinks : 0;
  if (internalLinkRatio >= 0.7) score += 25;
  else if (internalLinkRatio <= 0.5) score += 10;

  const validInternalLinks =
    data.links.internal?.filter(
      (link) =>
        !invalidSuffixes.some((suffix) => link.href.endsWith(suffix)) &&
        link.href.length < 100 &&
        !link.href.includes("+") &&
        !link.href.includes("%20") &&
        !link.href.includes("_") &&
        link.href === link.href.toLowerCase()
    ) || [];

  const highQualityLinkPercentage =
    (validInternalLinks.length / internalLinks) * 100;
  if (highQualityLinkPercentage >= 70) score += 30;
  else if (highQualityLinkPercentage <= 50) score += 15;

  return Math.min(Math.round(score), 100);
}

export function calculateContentDepthScore(data: PageDataType): number {
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
    { value: data.headings.h1 >= 1, weight: weights.h1, invalid: [false] },
    { value: data.headings.h2 >= 2, weight: weights.h2, invalid: [false] },
    { value: data.headings.h3 >= 2, weight: weights.h3, invalid: [false] },
    { value: data.totalImages > 0, weight: weights.images, invalid: [false] },
  ];

  const score = conditions.reduce(
    (score, { value, weight, invalid }) =>
      checkCondition(value, invalid) ? score + weight : score,
    0
  );

  return Math.min(Math.max(score, 0), 100);
}
