import {
  Globe,
  Info,
  Hash,
  FileText,
  ExternalLink,
  GitBranch,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HeadingButton } from "@/components/heading-button";
import { usePageData } from "@/provider/page-data-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageDataType } from "@/types";

export function StructureTab() {
  const [isInternalOpen, setIsInternalOpen] = useState(false);
  const [isExternalOpen, setIsExternalOpen] = useState(false);
  const [isH1Open, setIsH1Open] = useState(false);
  const [isH2Open, setIsH2Open] = useState(false);
  const [isH3Open, setIsH3Open] = useState(false);
  const { pageData } = usePageData() as { pageData: PageDataType };

  return (
    <div className="space-y-6">
      <UrlInfoCard pageData={pageData} />
      <KeywordsCard pageData={pageData} />
      <div className="grid grid-cols-2 gap-6 animate-slide-from-down-and-fade-3">
        <HeadingsCard
          pageData={pageData}
          isH1Open={isH1Open}
          setIsH1Open={setIsH1Open}
          isH2Open={isH2Open}
          setIsH2Open={setIsH2Open}
          isH3Open={isH3Open}
          setIsH3Open={setIsH3Open}
        />
        <LinksCard
          pageData={pageData}
          isInternalOpen={isInternalOpen}
          setIsInternalOpen={setIsInternalOpen}
          isExternalOpen={isExternalOpen}
          setIsExternalOpen={setIsExternalOpen}
        />
      </div>
      <ContentStatisticsCard pageData={pageData} />
    </div>
  );
}

function UrlInfoCard({ pageData }: { pageData: PageDataType }) {
  return (
    <Card className="border animate-slide-from-down-and-fade-1">
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Globe className="h-5 w-5" />
          URL Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span>Status Code:</span>
            <Badge
              className={`lining-nums text-white text-xs cursor-default ${
                pageData.httpStatus === 200 ? "bg-green-600" : "bg-red-500"
              }`}
            >
              {pageData.httpStatus}
            </Badge>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="size-3" />
                </TooltipTrigger>
                <TooltipContent className="max-w-48 z-50">
                  <p>
                    This shows the HTTP status code, indicating if a request
                    succeeded (200), failed (404), or had a server error (500).
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-2">
            <span>URL:</span>
            <a href={pageData.url} className="text-blue-500 hover:underline">
              {pageData.url}
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function KeywordsCard({ pageData }: { pageData: PageDataType }) {
  return (
    <Card className="border animate-slide-from-down-and-fade-2">
      <CardHeader className="flex flex-row items-center gap-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Hash className="h-5 w-5" />
          Keywords
        </CardTitle>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <Info className="size-3 text-gray-500" />
            </TooltipTrigger>
            <TooltipContent className="max-w-48">
              <p>
                The HTML meta keywords tag defines keywords related to a
                webpage&apos;s content. However, search engines do not use it as
                a ranking factor, so its usage is discouraged.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex flex-wrap gap-2">
          {pageData.keywords.length > 0 ? (
            pageData.keywords.map((keyword: any) => (
              <Badge key={keyword} variant="secondary">
                {keyword}
              </Badge>
            ))
          ) : (
            <Badge variant="secondary">None</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function HeadingsCard({
  pageData,
  ...rest
}: {
  pageData: PageDataType;
  [key: string]: any;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row gap-2 items-center">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Headings
        </CardTitle>
        <HeadingButton />
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-4">
          <HeadingCollapsible
            heading="H1"
            isOpen={rest.isH1Open}
            setIsOpen={rest.setIsH1Open}
            count={pageData.headings.h1}
            content={pageData.headingsContent.h1}
          />
          <HeadingCollapsible
            heading="H2"
            isOpen={rest.isH2Open}
            setIsOpen={rest.setIsH2Open}
            count={pageData.headings.h2}
            content={pageData.headingsContent.h2}
          />
          <HeadingCollapsible
            heading="H3"
            isOpen={rest.isH3Open}
            setIsOpen={rest.setIsH3Open}
            count={pageData.headings.h3}
            content={pageData.headingsContent.h3}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function HeadingCollapsible({
  heading,
  isOpen,
  setIsOpen,
  count,
  content,
}: {
  heading: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  count: number;
  content: string[];
}) {
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <div className="flex justify-between items-center">
        <CollapsibleTrigger className="flex items-center gap-2">
          <span>{heading}</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <Badge variant="secondary">{count}</Badge>
      </div>
      <CollapsibleContent className="mt-2">
        <ScrollArea className="h-[150px] w-full rounded border p-2">
          <ul className="space-y-2">
            {content?.map((content, index) => (
              <li key={index}>
                <p>{content}</p>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  );
}

function LinksCard({
  pageData,
  ...rest
}: {
  pageData: PageDataType;
  [key: string]: any;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <ExternalLink className="h-5 w-5" />
          Links
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-4">
          <LinkCollapsible
            title="Internal Links"
            isOpen={rest.isInternalOpen}
            setIsOpen={rest.setIsInternalOpen}
            links={pageData.links.internal}
          />
          <LinkCollapsible
            title="External Links"
            isOpen={rest.isExternalOpen}
            setIsOpen={rest.setIsExternalOpen}
            links={pageData.links.external}
          />
          <div className="flex justify-between items-center">
            <span>Total Links</span>
            <Badge variant="secondary">
              {pageData.links.external.length + pageData.links.internal.length}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LinkCollapsible({
  title,
  isOpen,
  setIsOpen,
  links,
}: {
  title: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  links: string[];
}) {
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <div className="flex justify-between items-center">
        <CollapsibleTrigger className="flex items-center gap-2">
          <span>{title}</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <Badge variant="secondary">{links.length}</Badge>
      </div>
      <CollapsibleContent className="mt-2">
        <ScrollArea className="h-[150px] w-full rounded border p-2">
          <ul className="space-y-2">
            {links.map((link, index) => (
              <li key={index}>
                <a
                  href={link}
                  className="hover:underline text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  );
}

function ContentStatisticsCard({ pageData }: { pageData: PageDataType }) {
  return (
    <Card className="border animate-slide-from-down-and-fade-4">
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          Content Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="grid grid-cols-4 gap-4">
          <StatItem label="Words" value={pageData.totalWords} />
          <StatItem label="Characters" value={pageData.totalCharacters} />
          <StatItem label="Images" value={pageData.totalImages} />
          <StatItem
            label="Total Links"
            value={
              pageData.links.internal.length + pageData.links.external.length
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-2">
      <span className="text-sm">{label}</span>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
