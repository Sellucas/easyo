import {
  calculateOverallScore,
  calculateContentDepthScore,
  calculateLinkStructureScore,
} from "@/lib/utils";
import { PageDataType } from "@/types";
import { Separator } from "@/components/ui/separator";
import { RadialChart } from "@/components/radial-chart";
import { OverviewItem } from "@/components/result-item";
import { usePageData } from "@/provider/page-data-provider";

export function AnalysisTab() {
  const { pageData } = usePageData() as { pageData: PageDataType };

  return (
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
      <div className="flex flex-col gap-4">
        <OverviewItem />
        <Separator />
      </div>
    </div>
  );
}
