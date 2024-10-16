async function getTab() {
  const tabs = await chrome.tabs.query({ currentWindow: true, active: true });
  return tabs[0];
}

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.action === "analyzePage") {
    const activeTab = await getTab();
    const tabId = activeTab?.id;
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
          const url = window.location.href;
          const keywords = keywordsMeta?.content
            ? keywordsMeta.content.split(",")
            : [];
          const canonicalURL = canonicalLink ? canonicalLink.href : url;
          const isIndexable =
            !robotsMetaT?.includes("noindex") && canonicalURL === url;
          const language = document.documentElement.lang;
          const h1Elements = document.querySelectorAll("h1").length;
          const h2Elements = document.querySelectorAll("h2").length;
          const h3Elements = document.querySelectorAll("h3").length;
          const h4Elements = document.querySelectorAll("h4").length;
          const h5Elements = document.querySelectorAll("h5").length;
          const h6Elements = document.querySelectorAll("h6").length;
          const bodyText = document.body.innerText.trim();
          const totalCharacters = bodyText.length;
          const wordsArray = bodyText.split(/\s+/).filter(Boolean);
          const totalWords = wordsArray.length;
          const imageElements = document.querySelectorAll("img");
          const totalImages = imageElements.length;

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
            totalWords,
            h1Elements,
            h2Elements,
            h3Elements,
            h4Elements,
            h5Elements,
            h6Elements,
            robotsMetaT,
            description,
            isIndexable,
            canonicalURL,
            totalImages,
            internalLinks,
            externalLinks,
            ogDescription,
            ttDescription,
            totalCharacters,
          });
        },
      });
    } else {
      console.error("No active tab found.");
    }
  }
});
