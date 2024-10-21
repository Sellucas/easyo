import {
  Info,
  List,
  Check,
  Gauge,
  Braces,
  FileText,
  AlertTriangle,
  LayoutDashboard,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "./ui/tooltip";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { RadialChart } from "./radial-chart";
import { HeadingButton } from "./heading-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { getDomain, calculateScore, calculateOverallScore } from "@/lib/utils";

type HeadingsType = {
  h1: number;
  h2: number;
  h3: number;
  h4: number;
  h5: number;
  h6: number;
};

const headingKeys: Array<keyof HeadingsType> = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
];

const initialPageData = {
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

const updatePageData = (prevData: typeof initialPageData, message: any) => ({
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

export const SeoTabs = () => {
  const [pageData, setPageData] = useState(initialPageData);

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
  }, []);

  const baseUrl = getDomain(pageData.url);
  const hasDataOnOpenGraph = [
    pageData.openGraph.description,
    pageData.openGraph.image,
    pageData.openGraph.title,
  ].every((item) => item !== "");
  const hasDataOnTwitter = [
    pageData.twitter.card,
    pageData.twitter.description,
    pageData.twitter.image,
    pageData.twitter.title,
  ].every((item) => item !== "");

  return (
    <Tabs defaultValue="analysis" className="w-full">
      <TabsList className="grid w-full grid-cols-3 content-center">
        <TabsTrigger value="analysis">
          <Gauge className="size-5" />
          Analysis
        </TabsTrigger>
        <TabsTrigger value="structure">
          <LayoutDashboard className="size-5" /> Structure
        </TabsTrigger>
        <TabsTrigger value="metadata">
          <Braces className="size-5" /> Metadata
        </TabsTrigger>
      </TabsList>

      <TabsContent value="analysis">
        <div className="space-y-8">
          <div className="flex flex-col gap-2 animate-slide-from-down-and-fade-1">
            <h2 className="font-semibold text-lg">Analysis Resume</h2>
            <div className="grid grid-cols-3 place-items-center">
              <RadialChart
                title="Title"
                count={calculateScore(
                  pageData.title?.length ?? 0,
                  0,
                  50,
                  0,
                  100
                )}
                tooltip="The ideal length is between 50-60 characters. Titles should be unique, descriptive, and contain the primary keyword near the beginning."
              />
              <RadialChart
                title="Description"
                count={calculateScore(
                  pageData.description?.length ?? 0,
                  0,
                  150,
                  0,
                  100
                )}
                tooltip="Keep the description between 150-160 characters. It should clearly summarize the content and include a call to action when appropriate."
              />
              <RadialChart
                title="Overall"
                count={calculateOverallScore(pageData)}
                tooltip="A very good score is between 60 and 80. For best results, you should strive for 70 and above."
              />
            </div>
          </div>
          <div className="grid grid-cols-2 place-items-center gap-4 animate-slide-from-down-and-fade-2">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-2">
                  {pageData.indexable ? (
                    <Check className="size-6 text-green-700" />
                  ) : (
                    <AlertTriangle className="size-5 text-yellow-600" />
                  )}
                  <Label>URL indexable</Label>
                </div>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="size-3 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-48">
                      <p>
                        {pageData.indexable
                          ? "This page can be indexed and will appear in search engine results since it lacks index-blocking directives or canonical URLs."
                          : "This page cannot be indexed because it has index-blocking directives or canonical URLs that prevent it from appearing in search results."}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-2">
                  {pageData.language !== "" ? (
                    <Check className="size-6 text-green-700" />
                  ) : (
                    <AlertTriangle className="size-5 text-yellow-600" />
                  )}
                  <Label>Language</Label>
                </div>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="size-3 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-48">
                      <p>
                        The lang attribute is used to describe the intended
                        language of the current page to user's browsers and
                        Search Engines.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-2">
                  {hasDataOnOpenGraph ? (
                    <Check className="size-6 text-green-700" />
                  ) : (
                    <AlertTriangle className="size-5 text-yellow-600" />
                  )}
                  <Label>Open Graph</Label>
                </div>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="size-3 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-48">
                      <p>
                        Open Graph metadata help control how your content is
                        displayed when shared on social media.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-2">
                  {hasDataOnTwitter ? (
                    <Check className="size-6 text-green-700" />
                  ) : (
                    <AlertTriangle className="size-5 text-yellow-600" />
                  )}
                  <Label>Twitter Data</Label>
                </div>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="size-3 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-48">
                      <p>
                        Twitter metadata help control how your content is
                        displayed when shared on Twitter.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
          <Separator className="animate-slide-from-down-and-fade-2" />
          <div className="flex flex-col animate-slide-from-down-and-fade-3">
            <h2 className="font-semibold mb-2 text-lg">Total Count</h2>
            <div className="flex items-center gap-1 mb-4">
              <div className="flex items-center gap-2">
                {pageData.headings.h1 > 0 ? (
                  <Check className="size-6 text-green-700" />
                ) : (
                  <AlertTriangle className="size-5 text-yellow-600" />
                )}
                <Label>Headings</Label>
              </div>
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="size-3 text-gray-500" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-48">
                    <p>
                      {pageData.headings.h1 > 0
                        ? "This page has at least one H1 tag, which is important for SEO."
                        : "It's recommended to include an H1 tag for better SEO as it helps search engines understand the primary topic of the page."}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="grid grid-cols-6 border">
              {headingKeys.map((heading) => (
                <div
                  key={heading}
                  className="flex flex-col gap-2 items-center border-x p-4"
                >
                  <Label className="uppercase text-xs">{heading}</Label>
                  <span className="text-xl leading-6">
                    {pageData.headings[heading]}
                  </span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 border border-t-0">
              <div className="flex flex-col gap-2 items-center border-x p-4">
                <Label className="uppercase text-xs">Words</Label>
                <span className="text-xl leading-6">{pageData.totalWords}</span>
              </div>
              <div className="flex flex-col gap-2 items-center border-x p-4">
                <Label className="uppercase text-xs">Characters</Label>
                <span className="text-xl leading-6">
                  {pageData.totalCharacters}
                </span>
              </div>
              <div className="flex flex-col gap-2 items-center border-x p-4">
                <Label className="uppercase text-xs">Images</Label>
                <span className="text-xl leading-6">
                  {pageData.totalImages}
                </span>
              </div>
              <div className="flex flex-col gap-2 items-center border-x p-4">
                <Label className="uppercase text-xs">Links</Label>
                <span className="text-xl leading-6">
                  {pageData.links.internal.length +
                    pageData.links.external.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="structure">
        <div className="space-y-6">
          <div className="space-y-1 animate-slide-from-down-and-fade-1">
            <Label>URL</Label>
            <div className="underline text-blue-500">{pageData.url}</div>
          </div>
          <div className="animate-slide-from-down-and-fade-2">
            <div className="flex gap-1 items-center">
              <Label>Keywords</Label>
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="size-3 text-gray-500" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-48">
                    <p>
                      The HTML meta keywords tag defines keywords related to a
                      webpage&apos;s content. However, search engines do not use
                      it as a ranking factor, so its usage is discouraged.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {pageData.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="bg-muted text-secondary-foreground px-2 py-1 rounded-full text-xs"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 animate-slide-from-down-and-fade-3">
            <Label>Headings</Label>
            <HeadingButton />
          </div>
          <Separator className="animate-slide-from-down-and-fade-3" />
          <div className="flex flex-col gap-2 animate-slide-from-down-and-fade-4">
            <Label>Links</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm">Internal</p>
                <ul className="py-1">
                  {pageData.links.internal.map((link, index) => (
                    <li key={index}>
                      <p
                        className="text-blue-500 text-xs hover:underline cursor-pointer break-words"
                        onClick={() => {
                          window.open(link);
                        }}
                      >
                        {link}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm">External</p>
                <ul className="py-1">
                  {pageData.links.external.map((link, index) => (
                    <li key={index}>
                      <p
                        className="text-blue-500 text-xs hover:underline cursor-pointer break-words"
                        onClick={() => {
                          window.open(link);
                        }}
                      >
                        {link}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="metadata">
        <div className="space-y-6">
          <div className="space-y-4 animate-slide-from-down-and-fade-1">
            <div className="group relative">
              <label className="absolute left-1 top-0 z-10 block -translate-y-1/2 bg-background px-2 text-xs font-medium text-foreground group-has-[:disabled]:opacity-50">
                Title
              </label>
              <Input
                className="h-10"
                placeholder="Missing"
                value={pageData.title}
              />
            </div>
            <div className="group relative">
              <label className="absolute left-1 top-0 z-10 block -translate-y-1/2 bg-background px-2 text-xs font-medium text-foreground group-has-[:disabled]:opacity-50">
                Description
              </label>
              <Textarea
                className="h-32"
                placeholder="Missing"
                value={pageData.description}
              />
            </div>
          </div>
          <div className="space-y-4 animate-slide-from-down-and-fade-2">
            <div className="group relative">
              <label className="absolute left-1 top-0 z-10 block -translate-y-1/2 bg-background px-2 text-xs font-medium text-foreground group-has-[:disabled]:opacity-50">
                Robots
              </label>
              <Input
                className="h-10"
                value={pageData.robots}
                placeholder="Missing"
              />
            </div>
            <div className="group relative">
              <label className="absolute left-1 top-0 z-10 block -translate-y-1/2 bg-background px-2 text-xs font-medium text-foreground group-has-[:disabled]:opacity-50">
                Language
              </label>
              <Input
                className="h-10"
                value={pageData.language}
                placeholder="Not set"
              />
            </div>
          </div>
          <div className="flex space-x-4 animate-slide-from-down-and-fade-3">
            <Button
              className="w-full"
              onClick={() => {
                window.open(`${baseUrl}/robots.txt`, "_blank");
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              Robots.txt
            </Button>
            <Button
              className="w-full"
              onClick={() => {
                window.open(`${baseUrl}/sitemap.xml`, "_blank");
              }}
            >
              <List className="mr-2 h-4 w-4" />
              Sitemap.xml
            </Button>
          </div>
          <Separator className="animate-slide-from-down-and-fade-4" />
          <div className="animate-slide-from-down-and-fade-5">
            <h2 className="font-semibold text-lg">Open Graph</h2>
            <div className="space-y-4 mt-2">
              <div className="group relative">
                <label className="absolute left-1 top-0 z-10 block -translate-y-1/2 bg-background px-2 text-xs font-medium text-foreground group-has-[:disabled]:opacity-50">
                  Title
                </label>
                <Input
                  className="h-10"
                  value={pageData.openGraph.title}
                  placeholder="No data found"
                />
              </div>
              <div className="group relative">
                <label className="absolute left-1 top-0 z-10 block -translate-y-1/2 bg-background px-2 text-xs font-medium text-foreground group-has-[:disabled]:opacity-50">
                  Description
                </label>
                <Textarea
                  className="h-32"
                  value={pageData.openGraph.description}
                  placeholder="No data found"
                />
              </div>
              <div className="group relative">
                <label className="absolute left-1 top-0 z-10 block -translate-y-1/2 bg-background px-2 text-xs font-medium text-foreground group-has-[:disabled]:opacity-50">
                  Image
                </label>
                <Input
                  className="h-10"
                  value={pageData.openGraph.image}
                  placeholder="No data found"
                />
              </div>
            </div>
          </div>
          <Separator className="animate-slide-from-down-and-fade-5" />
          <div className="animate-slide-from-down-and-fade-6">
            <h2 className="font-semibold text-lg">Twitter</h2>
            <div className="space-y-4 mt-2">
              <div className="group relative">
                <label className="absolute left-1 top-0 z-10 block -translate-y-1/2 bg-background px-2 text-xs font-medium text-foreground group-has-[:disabled]:opacity-50">
                  Card
                </label>
                <Input
                  className="h-10"
                  value={pageData.twitter.card}
                  placeholder="No data found"
                />
              </div>
              <div className="group relative">
                <label className="absolute left-1 top-0 z-10 block -translate-y-1/2 bg-background px-2 text-xs font-medium text-foreground group-has-[:disabled]:opacity-50">
                  Title
                </label>
                <Input
                  className="h-10"
                  value={pageData.twitter.title}
                  placeholder="No data found"
                />
              </div>
              <div className="group relative">
                <label className="absolute left-1 top-0 z-10 block -translate-y-1/2 bg-background px-2 text-xs font-medium text-foreground group-has-[:disabled]:opacity-50">
                  Description
                </label>
                <Textarea
                  className="h-32"
                  value={pageData.twitter.description}
                  placeholder="No data found"
                />
              </div>
              <div className="group relative">
                <label className="absolute left-1 top-0 z-10 block -translate-y-1/2 bg-background px-2 text-xs font-medium text-foreground group-has-[:disabled]:opacity-50">
                  Image
                </label>
                <Input
                  className="h-10"
                  value={pageData.twitter.image}
                  placeholder="No data found"
                />
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};
