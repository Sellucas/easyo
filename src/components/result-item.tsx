import { useState } from "react";
import { Check, ChevronDown, ChevronRight, Info, X } from "lucide-react";

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

interface ResultItemProps {
  label: string;
  status: boolean;
  tooltip?: string;
}

const ResultItem = ({ label, status, tooltip }: ResultItemProps) => {
  return (
    <div className="flex items-center justify-between gap-2">
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
      {status === true ? (
        <Check className="size-4 text-green-500" />
      ) : (
        <X className="size-4 text-red-500" />
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
                    status={pageData.allInternalLinksValid}
                  />
                  <ResultItem
                    label="Do any broken URLs return a 404 status code?"
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
                    status={pageData.links.internal.every(
                      (link) => link.length < 100
                    )}
                  />
                  <ResultItem
                    label="Are the URLs indexable?"
                    tooltip="To ensure a URL is indexable, it must be accessible without restrictions in the robots.txt file, not contain a noindex tag, and be functional without redirects or 404 errors."
                    status={pageData.indexable}
                  />
                  <ResultItem
                    label="Do the URLs have valid extensions?"
                    tooltip="Keep URLs clean by avoiding unnecessary extensions like .html, .php, or .asp, as they don’t add value for users and can make URLs longer and less user-friendly."
                    status={pageData.links.internal.every(
                      (link) =>
                        !invalidSuffixes.some((suffix) => link.endsWith(suffix))
                    )}
                  />
                  <ResultItem
                    label="Do any URLs contain symbols?"
                    tooltip="Avoid symbols (+, %20, _, etc.) in URLs to make them more user-friendly and easier to read."
                    status={pageData.links.internal.every(
                      (link) =>
                        !link.includes("+") &&
                        !link.includes("%20") &&
                        !link.includes("_")
                    )}
                  />
                  <ResultItem
                    label="Are all URLs in lowercase?"
                    tooltip="URLs should be lowercase to make them more user-friendly and easier to read."
                    status={pageData.links.internal.every(
                      (link) => link === link.toLowerCase()
                    )}
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
