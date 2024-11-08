import { Globe, Bot, Share2, Twitter, FileText, List } from "lucide-react";

import { getDomain } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/floating-label-input";
import { usePageData } from "@/provider/page-data-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageDataType } from "@/types";

export function MetadataTab() {
  const { pageData } = usePageData() as { pageData: PageDataType };
  const baseUrl = getDomain(pageData.url);

  return (
    <div className="space-y-6">
      <BasicMetadataCard pageData={pageData} />
      <RobotsAndSitemapCard pageData={pageData} baseUrl={baseUrl} />
      <OpenGraphCard pageData={pageData} />
      <TwitterCardCard pageData={pageData} />
    </div>
  );
}

function BasicMetadataCard({ pageData }: { pageData: PageDataType }) {
  return (
    <Card className="animate-slide-from-down-and-fade-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Globe className="w-5 h-5" />
          Basic Metadata
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-0">
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
      </CardContent>
    </Card>
  );
}

function RobotsAndSitemapCard({
  pageData,
  baseUrl,
}: {
  pageData: PageDataType;
  baseUrl: string;
}) {
  return (
    <Card className="animate-slide-from-down-and-fade-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bot className="w-5 h-5" />
          Robots & Sitemap
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-0">
        <div className="grid grid-cols-2 gap-4">
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
        <div className="flex gap-4">
          <Button
            className="w-full"
            variant={"secondary"}
            onClick={() => {
              window.open(`${baseUrl}/robots.txt`, "_blank");
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            Robots.txt
          </Button>
          <Button
            className="w-full"
            variant={"secondary"}
            onClick={() => {
              window.open(`${baseUrl}/sitemap.xml`, "_blank");
            }}
          >
            <List className="mr-2 h-4 w-4" />
            Sitemap.xml
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function OpenGraphCard({ pageData }: { pageData: PageDataType }) {
  return (
    <Card className="animate-slide-from-down-and-fade-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Share2 className="w-5 h-5" />
          Open Graph
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-0">
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
      </CardContent>
    </Card>
  );
}

function TwitterCardCard({ pageData }: { pageData: PageDataType }) {
  return (
    <Card className="animate-slide-from-down-and-fade-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Twitter className="w-5 h-5" />
          Twitter Card
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-0">
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
      </CardContent>
    </Card>
  );
}
