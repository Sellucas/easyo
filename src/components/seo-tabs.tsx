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
import {
  calculateOverallScore,
  calculateProgress,
  getDomain,
} from "@/lib/utils";

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
  title: message.title || "Missing",
  description: message.description || "Missing",
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
  robots: message.robotsMetaT || "Missing",
  indexable: message.isIndexable || false,
  language: message.language || "Not set",
  openGraph: {
    title: message.ogTitle || "No data found",
    description: message.ogDescription || "No data found",
    image: message.ogImage || "No data found",
  },
  twitter: {
    card: message.ttCard || "No data found",
    title: message.ttTitle || "No data found",
    description: message.ttDescription || "No data found",
    image: message.ttImage || "No data found",
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
  ].every((item) => item !== "No data found");
  const hasDataOnTwitter = [
    pageData.twitter.card,
    pageData.twitter.description,
    pageData.twitter.image,
    pageData.twitter.title,
  ].every((item) => item !== "No data found");

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
                count={calculateProgress(pageData.title.length, 50)}
                tooltip="The ideal length is between 50-60 characters. Titles should be unique, descriptive, and contain the primary keyword near the beginning."
              />
              <RadialChart
                title="Description"
                count={calculateProgress(pageData.description.length, 150)}
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
                  {pageData.language !== "Not set" ? (
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
                        The lang attribute is used to describe the intended
                        language of the current page to user's browsers and
                        Search Engines.
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
                        The lang attribute is used to describe the intended
                        language of the current page to user's browsers and
                        Search Engines.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
          <Separator className="animate-slide-from-down-and-fade-2" />
          <div className="flex flex-col animate-slide-from-down-and-fade-3">
            <h2 className="font-semibold mb-4 text-lg">Total Count</h2>
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
                  className="flex flex-col gap-2 items-center border p-4"
                >
                  <Label className="uppercase text-xs">{heading}</Label>
                  <span className="text-xl leading-6">
                    {pageData.headings[heading]}
                  </span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 border border-t-0">
              <div className="flex flex-col gap-2 items-center border p-4">
                <Label className="uppercase text-xs">Words</Label>
                <span className="text-xl leading-6">{pageData.totalWords}</span>
              </div>
              <div className="flex flex-col gap-2 items-center border p-4">
                <Label className="uppercase text-xs">Characters</Label>
                <span className="text-xl leading-6">
                  {pageData.totalCharacters}
                </span>
              </div>
              <div className="flex flex-col gap-2 items-center border p-4">
                <Label className="uppercase text-xs">Images</Label>
                <span className="text-xl leading-6">
                  {pageData.totalImages}
                </span>
              </div>
              <div className="flex flex-col gap-2 items-center border p-4">
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
          <div className="flex flex-col justify-between animate-slide-from-down-and-fade-1">
            <Label className="mb-2">URL</Label>
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
                  className="bg-muted text-secondary-foreground px-2 py-1 rounded-full text-sm"
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
          <div className="space-y-2 animate-slide-from-down-and-fade-1">
            <div>
              <Label>Title</Label>
              <Input id="title" value={pageData.title} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                id="description"
                className="min-h-32"
                value={pageData.description}
              />
            </div>
          </div>
          <Separator className="animate-slide-from-down-and-fade-1" />
          <div className="space-y-2 animate-slide-from-down-and-fade-2">
            <div>
              <Label>Robots</Label>
              <Input value={pageData.robots} />
            </div>
            <div>
              <Label>Language</Label>
              <Input value={pageData.language} />
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
            <div className="space-y-2 mt-2">
              <div>
                <Label>Title</Label>
                <Input value={pageData.openGraph.title} />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={pageData.openGraph.description}
                  className="min-h-32"
                />
              </div>
              <div>
                <Label>Image</Label>
                <Input value={pageData.openGraph.image} />
              </div>
            </div>
          </div>
          <Separator className="animate-slide-from-down-and-fade-5" />
          <div className="animate-slide-from-down-and-fade-6">
            <h2 className="font-semibold text-lg">Twitter</h2>
            <div className="space-y-2 mt-2">
              <div>
                <Label>Card</Label>
                <Input value={pageData.twitter.card} />
              </div>
              <div>
                <Label>Title</Label>
                <Input value={pageData.twitter.title} />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={pageData.twitter.description}
                  className="min-h-32"
                />
              </div>
              <div>
                <Label>Image</Label>
                <Input value={pageData.twitter.image} />
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};
