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
        func: async () => {
          const title = document.title;
          const keywordsMeta = document.querySelector("meta[name='keywords']") as HTMLMetaElement;
          const robotsMeta = document.querySelector("meta[name='robots']")?.getAttribute("content");
          const canonicalLink = document.querySelector("link[rel='canonical']")?.getAttribute("href");
          const ttCard = document.querySelector("meta[name='twitter:card']")?.getAttribute("content");
          const ogTitle = document.querySelector("meta[property='og:title']")?.getAttribute("content");
          const ogImage = document.querySelector("meta[property='og:image']")?.getAttribute("content");
          const ttTitle = document.querySelector("meta[name='twitter:title']")?.getAttribute("content");
          const ttImage = document.querySelector("meta[name='twitter:image']")?.getAttribute("content");
          const description = document.querySelector("meta[name='description']")?.getAttribute("content");
          const ogDescription = document.querySelector("meta[property='og:description']")?.getAttribute("content");
          const ttDescription = document.querySelector("meta[name='twitter:description']")?.getAttribute("content");
          const internalLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href^='/']")).map((link) => link.href);
          const externalLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href^='http']")).map((link) => link.href);
          const frames = Array.from(document.querySelectorAll("iframe")).map((el) => el.textContent?.trim());
          const h1Content = Array.from(document.querySelectorAll("h1")).map((el) => el.textContent?.trim());
          const h2Content = Array.from(document.querySelectorAll("h2")).map((el) => el.textContent?.trim());
          const h3Content = Array.from(document.querySelectorAll("h3")).map((el) => el.textContent?.trim());
          const h4Content = Array.from(document.querySelectorAll("h4")).map((el) => el.textContent?.trim());
          const h5Content = Array.from(document.querySelectorAll("h5")).map((el) => el.textContent?.trim());
          const h6Content = Array.from(document.querySelectorAll("h6")).map((el) => el.textContent?.trim());
          const robotsMetaT = robotsMeta;
          const url = window.location.href;
          const response = await fetch(url);
          const httpStatus = response.status;
          const h1Elements = h1Content.length;
          const h2Elements = h2Content.length;
          const h3Elements = h3Content.length;
          const h4Elements = h4Content.length;
          const h5Elements = h5Content.length;
          const h6Elements = h6Content.length;
          const bodyText = document.body.innerText.trim();
          const wordsArray = bodyText.split(/\s+/).filter(Boolean);
          const totalWords = wordsArray.length;
          const totalCharacters = bodyText.length;
          const imageElements = document.querySelectorAll("img");
          const totalImages = imageElements.length;
          const canonicalURL = canonicalLink === url;
          const language = document.documentElement.lang;
          const keywords = keywordsMeta?.content? keywordsMeta.content.split(","): [];
          const isIndexable =
            httpStatus === 200 &&
            !robotsMetaT?.includes("noindex") &&
            canonicalURL;
          const imgAlts = Array.from(document.querySelectorAll("img[alt]")).map(
            (img) => img.getAttribute("alt")
          );
          const invalidLinks: string[] = [];
          const checkInternalLinksStatus = await Promise.all(
            internalLinks.map(async (link) => {
              try {
                const response = await fetch(link);
                if (response.status < 200 || response.status >= 300) {
                  invalidLinks.push(link);
                  return false;
                }
                return true;
              } catch (error) {
                invalidLinks.push(link);
                return false;
              }
            })
          );
          const allInternalLinksValid = checkInternalLinksStatus.every((result) => result === true);
          const brokenUrlStatus = await fetch(url + "/page-not-found-seo-check");
          const isBrokenUrl = brokenUrlStatus.status === 404;

          chrome.runtime.sendMessage({
            url,
            title,
            ttCard,
            imgAlts,
            ogTitle,
            frames,
            ogImage,
            ttTitle,
            ttImage,
            keywords,
            language,
            h1Content,
            h2Content,
            h3Content,
            h4Content,
            h5Content,
            h6Content,
            totalWords,
            httpStatus,
            h1Elements,
            h2Elements,
            h3Elements,
            h4Elements,
            h5Elements,
            h6Elements,
            isBrokenUrl,
            robotsMetaT,
            description,
            isIndexable,
            totalImages,
            invalidLinks,
            canonicalURL,
            internalLinks,
            externalLinks,
            ogDescription,
            ttDescription,
            totalCharacters,
            allInternalLinksValid,
          });
        },
      });
    } else {
      console.error("No active tab found.");
    }
  }
});
