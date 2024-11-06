import { MoveRight } from "lucide-react";

export const HeadingButton = () => {
  return (
    <MoveRight
      onClick={() => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const tabId = tabs[0].id;
          chrome.scripting.executeScript({
            target: { tabId: tabId! },
            func: () => {
              const legendId = "heading-legend";
              const existingLegend = document.getElementById(legendId);

              if (existingLegend) return;

              const legend = document.createElement("div");
              legend.id = legendId;
              legend.style.position = "fixed";
              legend.style.bottom = "10px";
              legend.style.left = "10px";
              legend.style.padding = "12px";
              legend.style.backgroundColor = "rgba(30, 30, 30, 0.95)";
              legend.style.borderRadius = "8px";
              legend.style.border = "1px solid #999";
              legend.style.fontSize = "14px";
              legend.style.zIndex = "9999";
              legend.style.color = "white";
              legend.style.display = "flex";
              legend.style.flexDirection = "column";
              legend.style.width = "180px";
              legend.style.position = "fixed";

              const closeButton = document.createElement("button");
              closeButton.innerText = "✕";
              closeButton.style.position = "absolute";
              closeButton.style.top = "6px";
              closeButton.style.right = "6px";
              closeButton.style.width = "24px";
              closeButton.style.height = "24px";
              closeButton.style.color = "white";
              closeButton.style.backgroundColor = "transparent";
              closeButton.style.border = "none";
              closeButton.style.fontSize = "18px";
              closeButton.style.cursor = "pointer";
              closeButton.onclick = () => document.body.removeChild(legend);

              legend.innerHTML = `
                <div style="display: flex; flex-direction: column;">
                  <div><strong style="font-size: 16px;">Legend:</strong></div>
                  <div style="display: flex; align-items: center; margin-top: 6px;">
                    <span style="background-color: rgba(255, 0, 0, 0.5); width: 20px; height: 12px; margin-right: 8px;"></span> 
                    <span>H1: Red</span>
                  </div>
                  <div style="display: flex; align-items: center; margin-top: 6px;">
                    <span style="background-color: rgba(0, 0, 255, 0.5); width: 20px; height: 12px; margin-right: 8px;"></span> 
                    <span>H2: Blue</span>
                  </div>
                  <div style="display: flex; align-items: center; margin-top: 6px;">
                    <span style="background-color: rgba(0, 255, 0, 0.5); width: 20px; height: 12px; margin-right: 8px;"></span> 
                    <span>H3: Green</span>
                  </div>
                  <div style="display: flex; align-items: center; margin-top: 6px;">
                    <span style="background-color: rgba(0, 255, 255, 0.5); width: 20px; height: 12px; margin-right: 8px;"></span> 
                    <span>H4: Cyan</span>
                  </div>
                  <div style="display: flex; align-items: center; margin-top: 6px;">
                    <span style="background-color: rgba(255, 255, 0, 0.5); width: 20px; height: 12px; margin-right: 8px;"></span> 
                    <span>H5: Yellow</span>
                  </div>
                  <div style="display: flex; align-items: center; margin-top: 6px;">
                    <span style="background-color: rgba(255, 0, 255, 0.5); width: 20px; height: 12px; margin-right: 8px;"></span> 
                    <span>H6: Magenta</span>
                  </div>
                </div>
              `;

              legend.appendChild(closeButton);
              document.body.appendChild(legend);

              const h1Elements = document.querySelectorAll("h1");
              const h2Elements = document.querySelectorAll("h2");
              const h3Elements = document.querySelectorAll("h3");
              const h4Elements = document.querySelectorAll("h4");
              const h5Elements = document.querySelectorAll("h5");
              const h6Elements = document.querySelectorAll("h6");

              h1Elements.forEach(
                (el) => (el.style.backgroundColor = "rgba(255, 0, 0, 0.2)")
              );
              h2Elements.forEach(
                (el) => (el.style.backgroundColor = "rgba(0, 0, 255, 0.2)")
              );
              h3Elements.forEach(
                (el) => (el.style.backgroundColor = "rgba(0, 255, 0, 0.2)")
              );
              h4Elements.forEach(
                (el) => (el.style.backgroundColor = "rgba(0, 255, 255, 0.2)")
              );
              h5Elements.forEach(
                (el) => (el.style.backgroundColor = "rgba(255, 255, 0, 0.2)")
              );
              h6Elements.forEach(
                (el) => (el.style.backgroundColor = "rgba(255, 0, 255, 0.2)")
              );
            },
          });
        });
      }}
      className="size-6 bg-accent text-accent-foreground hover:bg-background hover:border p-1 cursor-pointer rounded"
    />
  );
};
