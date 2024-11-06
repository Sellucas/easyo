import {
  Eye,
  Info,
  List,
  Gauge,
  Braces,
  FileText,
  LayoutDashboard,
} from "lucide-react";

import {
  getDomain,
  getBaseUrl,
  calculateOverallScore,
  calculateContentDepthScore,
  calculateLinkStructureScore,
} from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "./ui/tooltip";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Timeline } from "./timeline";
import { StatItem } from "./stat-item";
import { Separator } from "./ui/separator";
import { RadialChart } from "./radial-chart";
import { OverviewItem } from "./result-item";
import { HeadingButton } from "./heading-button";
import { TwitterPreview } from "./twitter-preview";
import { DiscordPreview } from "./discord-preview";
import { FacebookPreview } from "./facebook-preview";
import { LinkedInPreview } from "./linkedin-preview";
import { usePageData } from "@/provider/page-data-provider";
import { FloatingLabelInput } from "./floating-label-input";
import { SocialPreviewSection } from "./social-preview-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { LoadingSpinner } from "./loading-spinner";
import { ScrollArea } from "./ui/scroll-area";

const scrollTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export const SeoTabs = () => {
  const { pageData, dataLoaded } = usePageData();

  const baseUrl = getDomain(pageData.url);

  return (
    <Tabs defaultValue="analysis" className="w-full">
      <TabsList className="grid w-full grid-cols-4 h-16 content-center sticky top-0 bg-background z-20">
        <TabsTrigger value="analysis" onClick={scrollTop}>
          <Gauge className="size-5" />
          Analysis
        </TabsTrigger>
        <TabsTrigger value="structure" onClick={scrollTop}>
          <LayoutDashboard className="size-5" /> Structure
        </TabsTrigger>
        <TabsTrigger value="metadata" onClick={scrollTop}>
          <Braces className="size-5" /> Metadata
        </TabsTrigger>
        <TabsTrigger value="showcase" onClick={scrollTop}>
          <Eye className="size-5" /> Showcase
        </TabsTrigger>
      </TabsList>

      {!dataLoaded ? (
        <LoadingSpinner />
      ) : (
        <>
          <TabsContent value="analysis">
            <div className="space-y-8">
              <div className="grid grid-cols-3 place-items-center animate-slide-from-down-and-fade-1">
                <RadialChart
                  title="Overall"
                  count={calculateOverallScore(pageData)}
                  tooltip="A very good score is between 60 and 80. For best results, you should strive for 70 and above."
                />
                <RadialChart
                  title="Link Structure"
                  count={calculateLinkStructureScore(pageData)}
                  tooltip="Score based on the number of internal and external links, their ratio, and the quality of internal links (proper length, no invalid characters, and correct format)."
                />
                <RadialChart
                  title="Content Depth"
                  count={calculateContentDepthScore(pageData)}
                  tooltip="Measures the richness of a page's content based on word count, headings, and multimedia usage."
                />
              </div>
              <div className="flex flex-col gpa-4">
                <OverviewItem />
                <Separator />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="structure">
            <div className="space-y-6">
              <div className="space-y-4 animate-slide-from-down-and-fade-1">
                <div className="space-y-1">
                  <Label>URL</Label>
                  <div className="underline text-blue-500">{pageData.url}</div>
                </div>
                <div className="flex gap-1 items-center">
                  <Label>Status Code:</Label>
                  <div
                    className={`lining-nums text-base ${
                      pageData.httpStatus === 200
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {pageData.httpStatus}
                  </div>
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="size-3 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-48 z-50">
                        <p>
                          This shows the HTTP status code, indicating if a
                          request succeeded (200), failed (404), or had a server
                          error (500).
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
                          The HTML meta keywords tag defines keywords related to
                          a webpage&apos;s content. However, search engines do
                          not use it as a ranking factor, so its usage is
                          discouraged.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {pageData.keywords.length > 0 ? (
                    pageData.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="bg-muted text-secondary-foreground px-2 py-1 rounded-full text-xs"
                      >
                        {keyword}
                      </span>
                    ))
                  ) : (
                    <span className="bg-muted text-secondary-foreground px-2 py-1 rounded-full text-xs">
                      none
                    </span>
                  )}
                </div>
              </div>
              <Separator className="animate-slide-from-down-and-fade-2" />
              <div className="flex flex-col gap-2 animate-slide-from-down-and-fade-3">
                <div className="flex gap-2 items-center">
                  <Label>Headings</Label>
                  <HeadingButton />
                </div>
                <Timeline />
              </div>
              <Separator className="animate-slide-from-down-and-fade-3" />
              <div className="flex flex-col gap-2 animate-slide-from-down-and-fade-4">
                <Label>Links</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex gap-2">
                      <p className="text-sm">Internal</p>
                      <span className="bg-muted text-secondary-foreground px-2 py-0.5 rounded-full text-[10px] lining-nums">
                        {pageData.links.internal.length}
                      </span>
                    </div>
                    <ScrollArea className="h-[200px]">
                      <ul className="py-1 space-y-2">
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
                    </ScrollArea>
                  </div>
                  <div>
                    <div className="flex gap-2">
                      <p className="text-sm">External</p>
                      <span className="bg-muted text-secondary-foreground px-2 py-0.5 rounded-full text-[10px] lining-nums">
                        {pageData.links.external.length}
                      </span>
                    </div>
                    <ScrollArea className="h-[200px]">
                      <ul className="py-1 space-y-2">
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
                    </ScrollArea>
                  </div>
                </div>
              </div>
              <Separator className="animate-slide-from-down-and-fade-2" />
              <div className="flex flex-col gap-2 animate-slide-from-down-and-fade-3">
                <Label>Total Count</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-2">
                    <StatItem label="H1" value={pageData.headings.h1} />
                    <StatItem label="H2" value={pageData.headings.h2} />
                    <StatItem label="H3" value={pageData.headings.h3} />
                    <StatItem label="H4" value={pageData.headings.h4} />
                    <StatItem label="H5" value={pageData.headings.h5} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <StatItem label="H6" value={pageData.headings.h6} />
                    <StatItem label="Words" value={pageData.totalWords} />
                    <StatItem
                      label="Characters"
                      value={pageData.totalCharacters}
                    />
                    <StatItem label="Images" value={pageData.totalImages} />
                    <StatItem
                      label="Links"
                      value={
                        pageData.links.internal.length +
                        pageData.links.external.length
                      }
                    />
                  </div>
                </div>
              </div>
              <Separator />
            </div>
          </TabsContent>

          <TabsContent value="metadata">
            <div className="space-y-6">
              <div className="space-y-4 animate-slide-from-down-and-fade-1">
                <FloatingLabelInput
                  label="Title"
                  value={pageData.title}
                  placeholder="Missing"
                />
                <FloatingLabelInput
                  label="Description"
                  value={pageData.description}
                  placeholder="Missing"
                  isTextarea
                />
              </div>
              <div className="space-y-4 animate-slide-from-down-and-fade-2">
                <FloatingLabelInput
                  label="Robots"
                  value={pageData.robots}
                  placeholder="Missing"
                />
                <FloatingLabelInput
                  label="Language"
                  value={pageData.language}
                  placeholder="Not set"
                />
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
                  <FloatingLabelInput
                    label="Title"
                    value={pageData.openGraph.title}
                    placeholder="No data found"
                  />
                  <FloatingLabelInput
                    label="Description"
                    value={pageData.openGraph.description}
                    placeholder="No data found"
                    isTextarea
                  />
                  <FloatingLabelInput
                    label="Image"
                    value={pageData.openGraph.image}
                    placeholder="No data found"
                  />
                </div>
              </div>
              <Separator className="animate-slide-from-down-and-fade-5" />
              <div className="animate-slide-from-down-and-fade-6">
                <h2 className="font-semibold text-lg">Twitter</h2>
                <div className="space-y-4 mt-2">
                  <FloatingLabelInput
                    label="Card"
                    value={pageData.twitter.card}
                    placeholder="No data found"
                  />
                  <FloatingLabelInput
                    label="Title"
                    value={pageData.twitter.title}
                    placeholder="No data found"
                  />
                  <FloatingLabelInput
                    label="Description"
                    value={pageData.twitter.description}
                    placeholder="No data found"
                    isTextarea
                  />
                  <FloatingLabelInput
                    label="Image"
                    value={pageData.twitter.image}
                    placeholder="No data found"
                  />
                </div>
              </div>
              <Separator />
            </div>
          </TabsContent>

          <TabsContent value="showcase">
            <div className="flex flex-col gap-4">
              <SocialPreviewSection
                title="FACEBOOK"
                className="animate-slide-from-down-and-fade-1"
              >
                <FacebookPreview
                  image={pageData.openGraph.image}
                  url={getBaseUrl(pageData.url)}
                  title={pageData.openGraph.title}
                  description={pageData.openGraph.description}
                />
              </SocialPreviewSection>
              <SocialPreviewSection
                title="X(TWITTER)"
                className="animate-slide-from-down-and-fade-2"
              >
                <TwitterPreview
                  image={pageData.twitter.image}
                  url={getBaseUrl(pageData.url)}
                />
              </SocialPreviewSection>
              <SocialPreviewSection
                title="LINKEDIN"
                className="animate-slide-from-down-and-fade-3"
              >
                <LinkedInPreview
                  image={pageData.openGraph.image}
                  url={getBaseUrl(pageData.url)}
                  title={pageData.openGraph.title}
                />
              </SocialPreviewSection>
              <SocialPreviewSection
                title="DISCORD"
                className="animate-slide-from-down-and-fade-4"
              >
                <DiscordPreview
                  image={pageData.openGraph.image}
                  title={pageData.openGraph.title}
                  description={pageData.openGraph.description}
                />
              </SocialPreviewSection>
              <Separator />
            </div>
          </TabsContent>
        </>
      )}
    </Tabs>
  );
};
