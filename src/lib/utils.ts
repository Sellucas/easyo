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

export function calculateOverallScore(data: PageDataType): number {
  let score = 0;

  const weights = {
    title: 8,
    description: 8,
    url: 5,
    h1: 5,
    h2: 5,
    h3: 5,
    totalCharacters: 5,
    totalWords: 5,
    totalImages: 5,
    keywords: 10,
    internalLinks: 5,
    externalLinks: 5,
    robots: 5,
    indexable: 5,
    language: 5,
    ogTitle: 2,
    ogDescription: 2,
    ogImage: 2,
    ttCard: 2,
    ttTitle: 2,
    ttDescription: 2,
    ttImage: 2,
  };

  const checkCondition = (value: any, invalidValues: any) => {
    const invalidArray = Array.isArray(invalidValues)
      ? invalidValues
      : [invalidValues];
    return (
      value !== null && value !== undefined && !invalidArray.includes(value)
    );
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
    { value: data.headings.h2, weight: weights.h2, invalid: 0 },
    { value: data.headings.h3, weight: weights.h3, invalid: 0 },
    {
      value: data.totalCharacters,
      weight: weights.totalCharacters,
      invalid: 0,
    },
    { value: data.totalWords, weight: weights.totalWords, invalid: 0 },
    { value: data.totalImages, weight: weights.totalImages, invalid: 0 },
    { value: data.keywords.length, weight: weights.keywords, invalid: 0 },
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
    { value: data.language, weight: weights.language, invalid: [""] },
    { value: data.openGraph.title, weight: weights.ogTitle, invalid: [""] },
    {
      value: data.openGraph.description,
      weight: weights.ogDescription,
      invalid: [""],
    },
    { value: data.openGraph.image, weight: weights.ogImage, invalid: [""] },
    { value: data.twitter.card, weight: weights.ttCard, invalid: [""] },
    { value: data.twitter.title, weight: weights.ttTitle, invalid: [""] },
    {
      value: data.twitter.description,
      weight: weights.ttDescription,
      invalid: [""],
    },
    { value: data.twitter.image, weight: weights.ttImage, invalid: [""] },
  ];

  conditions.forEach(({ value, weight, invalid }) => {
    if (checkCondition(value, invalid)) {
      score += weight;
    }
  });

  return score;
}
