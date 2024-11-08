import { Gauge, LayoutDashboard, Braces, Eye } from "lucide-react";

import { AnalysisTab } from "./analysis-tab";
import { MetadataTab } from "./metadata-tab";
import { ShowcaseTab } from "./showcase-tab";
import { StructureTab } from "./structure-tab";
import { usePageData } from "@/provider/page-data-provider";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const scrollTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export function SeoTabs() {
  const { dataLoaded } = usePageData() as { dataLoaded: boolean };

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
            <AnalysisTab />
          </TabsContent>
          <TabsContent value="structure">
            <StructureTab />
          </TabsContent>
          <TabsContent value="metadata">
            <MetadataTab />
          </TabsContent>
          <TabsContent value="showcase">
            <ShowcaseTab />
          </TabsContent>
        </>
      )}
    </Tabs>
  );
}
