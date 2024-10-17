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

export const calculateProgress = (value: number, max: number) =>
  Math.min(value, max);

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

  const checkCondition = (value: any, invalidValues: any[] = []) =>
    value && !invalidValues.includes(value);

  const conditions = [
    { value: data.title, weight: weights.title, invalid: ["Missing"] },
    {
      value: data.description,
      weight: weights.description,
      invalid: ["Missing"],
    },
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
    { value: data.robots, weight: weights.robots, invalid: ["Missing"] },
    { value: data.indexable, weight: weights.indexable },
    { value: data.language, weight: weights.language, invalid: ["Not set"] },
    {
      value: data.openGraph.title,
      weight: weights.ogTitle,
      invalid: ["No data found"],
    },
    {
      value: data.openGraph.description,
      weight: weights.ogDescription,
      invalid: ["No data found"],
    },
    {
      value: data.openGraph.image,
      weight: weights.ogImage,
      invalid: ["No data found"],
    },
    {
      value: data.twitter.card,
      weight: weights.ttCard,
      invalid: ["No data found"],
    },
    {
      value: data.twitter.title,
      weight: weights.ttTitle,
      invalid: ["No data found"],
    },
    {
      value: data.twitter.description,
      weight: weights.ttDescription,
      invalid: ["No data found"],
    },
    {
      value: data.twitter.image,
      weight: weights.ttImage,
      invalid: ["No data found"],
    },
  ];

  conditions.forEach(({ value, weight, invalid = [] }) => {
    if (checkCondition(value, invalid)) {
      score += weight;
    }
  });

  return score;
}
