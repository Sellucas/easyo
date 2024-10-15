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
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { HeadingButton } from "./heading-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const initialPageData = {
  url: "Something went wrong...",
  indexable: false,
  title: "",
  description: "",
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

  const getDomain = (url: string) => url.split("/").slice(0, 3).join("/");
  const calculateProgress = (value: number | undefined, max: number) =>
    Math.min(((value || 0) / max) * 100, 100);
  const baseUrl = getDomain(pageData.url);

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
        <div className="space-y-6">
          <div className="animate-slide-from-down-and-fade-1">
            <Label>Title</Label>
            <Input id="title" value={pageData.title} />
          </div>
          <div className="animate-slide-from-down-and-fade-2">
            <Label>Description</Label>
            <Textarea
              id="description"
              className="min-h-32"
              value={pageData.description}
            />
          </div>
          <div className="flex flex-col gap-4 animate-slide-from-down-and-fade-3">
            <div className="space-y-2">
              <h2 className="font-semibold mb-4 text-base">Score Resume</h2>
              <div className="flex items-center gap-1 mb-1">
                <Label>Title</Label>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="size-3 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-48">
                      <p>
                        The ideal length is between 50-60 characters. Titles
                        should be unique, descriptive, and contain the primary
                        keyword near the beginning.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Progress
                value={calculateProgress(pageData.title?.length, 60)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-1 mb-1">
                <Label>Description</Label>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="size-3 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-48">
                      <p>
                        Keep the description between 150-160 characters. It
                        should clearly summarize the content and include a call
                        to action when appropriate.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Progress
                value={calculateProgress(pageData.description?.length, 160)}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="structure">
        <div className="space-y-6">
          <div className="flex flex-col justify-between animate-slide-from-down-and-fade-1">
            <Label>URL</Label>
            <div className="flex items-center justify-between mt-2">
              <div className="underline text-blue-500">{pageData.url}</div>
              <div
                className={`flex items-center gap-1 px-2 py-1 font-medium text-white rounded ${
                  pageData.indexable ? "bg-green-700" : "bg-yellow-600"
                }`}
              >
                {pageData.indexable ? (
                  <Check className="h-4 w-4 inline" />
                ) : (
                  <AlertTriangle className="h-4 w-4 inline" />
                )}
                <span>
                  {pageData.indexable ? "Indexable" : "Not Indexable"}
                </span>
                <span className="flex gap-1 items-center">
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="size-3 text-gray-300" />
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
                </span>
              </div>
            </div>
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
          <div className="flex flex-col gap-6 animate-slide-from-down-and-fade-3">
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
          <div className="space-y-2">
            <div className="animate-slide-from-down-and-fade-1">
              <Label>Robots</Label>
              <Input value={pageData.robots} />
            </div>
            <div className="animate-slide-from-down-and-fade-2">
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
            <Label>Open Graph</Label>
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
            <Label>Twitter</Label>
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
