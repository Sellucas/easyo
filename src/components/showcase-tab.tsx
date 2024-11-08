import { getBaseUrl } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { usePageData } from "@/provider/page-data-provider";
import { TwitterPreview } from "@/components/twitter-preview";
import { DiscordPreview } from "@/components/discord-preview";
import { FacebookPreview } from "@/components/facebook-preview";
import { LinkedInPreview } from "@/components/linkedin-preview";
import { SocialPreviewSection } from "@/components/social-preview-section";

export function ShowcaseTab() {
  const { pageData } = usePageData();
  const baseUrl = getBaseUrl(pageData.url);

  return (
    <div className="flex flex-col gap-4">
      <SocialPreviewSection
        title="FACEBOOK"
        className="animate-slide-from-down-and-fade-1"
      >
        <FacebookPreview
          image={pageData.openGraph.image}
          url={baseUrl}
          title={pageData.openGraph.title}
          description={pageData.openGraph.description}
        />
      </SocialPreviewSection>
      <SocialPreviewSection
        title="X(TWITTER)"
        className="animate-slide-from-down-and-fade-2"
      >
        <TwitterPreview image={pageData.twitter.image} url={baseUrl} />
      </SocialPreviewSection>
      <SocialPreviewSection
        title="LINKEDIN"
        className="animate-slide-from-down-and-fade-3"
      >
        <LinkedInPreview
          image={pageData.openGraph.image}
          url={baseUrl}
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
  );
}
