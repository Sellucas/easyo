import { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Info,
  X,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Button } from "./ui/button";
import { usePageData } from "@/provider/page-data-provider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

interface ResultItemProps {
  label: string;
  status: boolean;
  tooltip?: string;
  expandedContent?: React.ReactNode;
  expandedContentData?: string[];
}

const ResultItem = ({
  label,
  status,
  tooltip,
  expandedContent,
  expandedContentData,
}: ResultItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    if (!status && expandedContent) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div>
      <div
        className={`flex items-center justify-between gap-2 ${
          !status && expandedContent ? "cursor-pointer" : ""
        }`}
        onClick={toggleExpand}
      >
        <div className="flex items-center">
          <hr className="w-4" />
          <span className="text-xs px-1">{label}</span>
          {tooltip && (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger className="z-50">
                  <Info className="size-3 text-gray-500" />
                </TooltipTrigger>
                <TooltipContent className="max-w-48">
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="flex items-center">
          {!status &&
            expandedContent &&
            (isExpanded ? (
              <ChevronDown className="size-4 ml-2 text-accent-foreground" />
            ) : (
              <ChevronRight className="size-4 ml-2 text-accent-foreground" />
            ))}
          {status ? (
            <Check className="size-4 text-green-500" />
          ) : (
            <X className="size-4 text-red-500" />
          )}
        </div>
      </div>
      {isExpanded && expandedContent && (
        <div className="mt-2 ml-6 text-sm">
          <div className="space-y-2 bg-destructive/10 p-4 rounded-md">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Invalid Links</h3>
              <Badge variant="destructive" className="lining-nums">
                {expandedContentData?.length}
              </Badge>
            </div>
            <ScrollArea className="h-[200px] rounded border">
              <ul className="space-y-2 p-2">
                {expandedContentData?.map((link, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <ExternalLink className="size-3 mt-0.5 flex-shrink-0" />
                    <a
                      href={link}
                      target="_blank"
                      className="text-xs hover:underline break-all text-blue-500"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
};

const invalidSuffixes = [".htm", ".html", ".shtml", ".php", ".jsp", ".asp"];

export const OverviewItem = () => {
  const [isOpen, setIsOpen] = useState(true);

  const { pageData } = usePageData();

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
  const filteredInternalLinks = pageData.links.internal.filter(
    (link) => link.length > 100
  );
  const filteredInvalidExtension = pageData.links.internal.filter((link) =>
    invalidSuffixes.some((suffix) => link.endsWith(suffix))
  );
  const filteredInvalidSymbols = pageData.links.internal.filter(
    (link) => link.includes("+") && link.includes("%20") && link.includes("_")
  );
  const filteredInvalidLength = pageData.links.internal.filter(
    (link) => link != link.toLowerCase()
  );

  return (
    <div className="min-h-screen px-8 animate-slide-from-down-and-fade-2">
      <div className="mx-auto max-w-2xl">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="flex w-full items-center justify-between rounded-lg p-4 shadow-sm bg-accent text-accent-foreground"
            >
              <div className="flex items-center gap-2">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <span className="font-medium">SEO Analysis</span>
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="rounded-lg p-6 shadow-sm">
            <div>
              <h2 className="text-sm font-semibold">PAGE TITLE</h2>
              <div className="border-s">
                <div className="py-3 space-y-3">
                  <ResultItem
                    label="Is the page title defined?"
                    status={pageData.title ? true : false}
                  />
                  <ResultItem
                    label="Is the title length within the optimal range?"
                    tooltip="The title should be between 10-60 characters long."
                    status={
                      pageData.title.length >= 10 && pageData.title.length <= 60
                        ? true
                        : false
                    }
                  />
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-sm font-semibold">PAGE DESCRIPTION</h2>
              <div className="border-s">
                <div className="py-3 space-y-3">
                  <ResultItem
                    label="Is the page description defined?"
                    status={pageData.description ? true : false}
                  />
                  <ResultItem
                    label="Is the description length within the optimal range?"
                    tooltip="The description should be between 100-320 characters long."
                    status={
                      pageData.description &&
                      pageData.description.length >= 100 &&
                      pageData.description.length <= 320
                        ? true
                        : false
                    }
                  />
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-sm font-semibold">PAGE HEADINGS</h2>
              <div className="border-s">
                <div className="py-3 space-y-3">
                  <ResultItem
                    label="Does the page contain H1 headings?"
                    tooltip="The H1 heading is the most important heading on the page and should be used to communicate the main topic of the page."
                    status={pageData.headings.h1 > 0 ? true : false}
                  />
                  <ResultItem
                    label="Is there only one H1 tag on the page?"
                    tooltip="The H1 tag should be the only one on the page."
                    status={pageData.headings.h1 === 1 ? true : false}
                  />
                  <ResultItem
                    label="Is the H1 length within the optimal range?"
                    tooltip="The H1 heading should be under 70 characters long."
                    status={
                      pageData.headingsContent.h1[0] &&
                      pageData.headingsContent.h1[0].length > 0 &&
                      pageData.headingsContent.h1[0].length <= 70
                        ? true
                        : false
                    }
                  />
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-sm font-semibold">PAGE CONTENT</h2>
              <div className="border-s">
                <div className="py-3 space-y-3">
                  <ResultItem
                    label="Is there sufficient content on the page?"
                    tooltip="The page should have at least 300 words of content."
                    status={pageData.totalWords >= 300 ? true : false}
                  />
                  <ResultItem
                    label="Are all image ALT texts provided?"
                    status={pageData.imgAlts.every(
                      (alt) => alt !== null && alt !== undefined && alt !== ""
                    )}
                  />
                  <ResultItem
                    label="Is a language set for the page?"
                    status={pageData.language ? true : false}
                  />
                  <ResultItem
                    label="Is there iframes in the page?"
                    tooltip="Frames hinder search engines from properly indexing content, making text and hyperlinks appear missing, which negatively affects website ranking."
                    status={pageData.frames.length === 0}
                  />
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-sm font-semibold">LINKS</h2>
              <div className="border-s">
                <div className="py-3 space-y-3">
                  <ResultItem
                    label="Are internal links functioning properly?"
                    tooltip="Internal links should be working properly and should not return a 404 status code."
                    status={pageData.invalidLinks.length === 0}
                    expandedContent
                    expandedContentData={pageData.invalidLinks}
                  />
                  <ResultItem
                    label="Do non-existent URLs return a 404 status code?"
                    tooltip="Return a 404 HTTP status for non-existent URLs to inform search engines and guide visitors with a friendly 'not found' page."
                    status={pageData.isBrokenUrl}
                  />
                  <ResultItem
                    label="Is a canonical link provided?"
                    tooltip="Set a valid canonical URL for each page to manage duplicates and prevent issues, using a <link rel='canonical' href='...'> tag or a response header."
                    status={pageData.canonicalURL}
                  />
                  <ResultItem
                    label="Is a robots.txt file available?"
                    tooltip="Add a robots.txt file to every subdomain to control search engine crawling and specify sitemap locations."
                    status={pageData.robots ? true : false}
                  />
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-sm font-semibold">URL ANALYSIS</h2>
              <div className="border-s">
                <div className="py-3 space-y-3">
                  <ResultItem
                    label="Are all URLs short enough?"
                    tooltip="URLs should be under 100 characters long."
                    status={filteredInternalLinks.length === 0}
                    expandedContent
                    expandedContentData={filteredInternalLinks}
                  />
                  <ResultItem
                    label="Are the URL indexable?"
                    tooltip="To ensure a URL is indexable, it must be accessible without restrictions in the robots.txt file, not contain a noindex tag, and be functional without redirects or 404 errors."
                    status={pageData.indexable}
                  />
                  <ResultItem
                    label="Do the URLs have valid extensions?"
                    tooltip="Keep URLs clean by avoiding unnecessary extensions like .html, .php, or .asp, as they don’t add value for users and can make URLs longer and less user-friendly."
                    status={filteredInvalidExtension.length === 0}
                    expandedContent
                    expandedContentData={filteredInvalidExtension}
                  />
                  <ResultItem
                    label="Do any URLs contain symbols?"
                    tooltip="Avoid symbols (+, %20, _, etc.) in URLs to make them more user-friendly and easier to read."
                    status={filteredInvalidSymbols.length === 0}
                    expandedContent
                    expandedContentData={filteredInvalidSymbols}
                  />
                  <ResultItem
                    label="Are all URLs in lowercase?"
                    tooltip="URLs should be lowercase to make them more user-friendly and easier to read."
                    status={filteredInvalidLength.length === 0}
                    expandedContent
                    expandedContentData={filteredInvalidLength}
                  />
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-sm font-semibold">METADATA SHARE</h2>
              <div className="border-s">
                <div className="py-3 space-y-3">
                  <ResultItem
                    label="Is Open Graph data available?"
                    tooltip="Add Open Graph metadata to your website to make it more shareable on social media platforms."
                    status={hasDataOnOpenGraph}
                  />
                  <ResultItem
                    label="Is Twitter Card data available?"
                    tooltip="Add Twitter Card metadata to your website to make it more shareable on Twitter."
                    status={hasDataOnTwitter}
                  />
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};
