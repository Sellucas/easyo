async function getTabId(): Promise<number | undefined> {
  const tabs = await chrome.tabs.query({ currentWindow: true, active: true });
  return tabs[0]?.id;
}

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.action === "analyzePage") {
    const tabId = await getTabId();
    if (tabId !== undefined) {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: () => {
          const title = document.title;
          const ogTitle = document
            .querySelector("meta[property='og:title']")
            ?.getAttribute("content");
          const description = document
            .querySelector("meta[name='description']")
            ?.getAttribute("content");
          const keywordsMeta = document.querySelector(
            "meta[name='keywords']"
          ) as HTMLMetaElement;
          const internalLinks = Array.from(
            document.querySelectorAll<HTMLAnchorElement>("a[href^='/']")
          ).map((link) => link.href);
          const externalLinks = Array.from(
            document.querySelectorAll<HTMLAnchorElement>("a[href^='http']")
          ).map((link) => link.href);
          const robotsMeta = document
            .querySelector("meta[name='robots']")
            ?.getAttribute("content");
          const canonicalLink = document.querySelector(
            "link[rel='canonical']"
          ) as HTMLLinkElement;
          const ogDescription = document
            .querySelector("meta[property='og:description']")
            ?.getAttribute("content");
          const ogImage = document
            .querySelector("meta[property='og:image']")
            ?.getAttribute("content");
          const ttCard = document
            .querySelector("meta[name='twitter:card']")
            ?.getAttribute("content");
          const ttTitle = document
            .querySelector("meta[name='twitter:title']")
            ?.getAttribute("content");
          const ttImage = document
            .querySelector("meta[name='twitter:image']")
            ?.getAttribute("content");
          const ttDescription = document
            .querySelector("meta[name='twitter:description']")
            ?.getAttribute("content");

          const robotsMetaT = robotsMeta;
          const url = document.URL;
          const keywords = keywordsMeta?.content
            ? keywordsMeta.content.split(",")
            : [];
          const canonicalURL = canonicalLink ? canonicalLink.href : url;
          const isIndexable =
            !robotsMetaT?.includes("noindex") && canonicalURL === url;
          const language = document.documentElement.lang;

          chrome.runtime.sendMessage({
            url,
            title,
            ttCard,
            ogTitle,
            ogImage,
            ttTitle,
            ttImage,
            keywords,
            language,
            robotsMetaT,
            description,
            isIndexable,
            canonicalURL,
            internalLinks,
            externalLinks,
            ogDescription,
            ttDescription,
          });
        },
      });
    } else {
      console.error("No active tab found.");
    }
  }
});
