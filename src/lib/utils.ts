import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

type DataType = {
  title: string;
  description: string;
  url: string;
  headings: { h1: number; h2: number; h3: number };
  totalCharacters: number;
  totalWords: number;
  totalImages: number;
  keywords: string[];
  links: { internal: string[]; external: string[] };
  robots: string;
  indexable: boolean;
  language: string;
  openGraph: { title: string; description: string; image: string };
  twitter: { card: string; title: string; description: string; image: string };
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDomain = (url: string) => url.split("/").slice(0, 3).join("/");

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

export function calculateOverallScore(data: DataType): number {
  let score = 0;

  const weights = {
    title: 10,
    description: 10,
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

  const checkCondition = (value: any, invalidValues: any[] = []) => {
    if (typeof value === "string" && value.trim() === "") return false;
    return (
      value !== null && value !== undefined && !invalidValues.includes(value)
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
    { value: data.headings.h1 > 0, weight: weights.h1 },
    { value: data.headings.h2 > 0, weight: weights.h2 },
    { value: data.headings.h3 > 0, weight: weights.h3 },
    { value: data.totalCharacters > 0, weight: weights.totalCharacters },
    { value: data.totalWords > 0, weight: weights.totalWords },
    { value: data.totalImages > 0, weight: weights.totalImages },
    { value: data.keywords.length > 0, weight: weights.keywords },
    { value: data.links.internal.length > 0, weight: weights.internalLinks },
    { value: data.links.external.length > 0, weight: weights.externalLinks },
    { value: data.robots, weight: weights.robots, invalid: [""] },
    { value: data.indexable, weight: weights.indexable },
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

  conditions.forEach(({ value, weight, invalid = [] }) => {
    if (checkCondition(value, invalid)) {
      score += weight;
    }
  });

  return score;
}
