import { Button } from "./ui/button";

export const HeadingButton = () => {
  return (
    <Button
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
              legend.style.padding = "10px";
              legend.style.backgroundColor = "rgba(15, 15, 15)";
              legend.style.border = "1px solid #ccc";
              legend.style.fontSize = "14px";
              legend.style.zIndex = "9999";
              legend.style.color = "white";
              legend.style.display = "flex";
              legend.style.justifyContent = "space-between";
              legend.style.width = "150px";

              const closeButton = document.createElement("button");
              closeButton.innerText = "X";
              closeButton.style.marginTop = "2px";
              closeButton.style.marginRight = "2px";
              closeButton.style.width = "20px";
              closeButton.style.height = "20px";
              closeButton.style.color = "white";
              closeButton.style.backgroundColor = "rgba(15, 15, 15)";
              closeButton.style.border = "none";
              closeButton.style.cursor = "pointer";
              closeButton.onclick = () => document.body.removeChild(legend);

              legend.innerHTML = `
                              <div>
                                <div><strong>Legend:</strong></div>
                                <div><span style="background-color: rgba(255, 0, 0, 0.2); padding: 2px 4px; margin-right: 5px;"></span> H1: Red</div>
                                <div><span style="background-color: rgba(0, 0, 255, 0.2); padding: 2px 4px; margin-right: 5px;"></span> H2: Blue</div>
                                <div><span style="background-color: rgba(0, 255, 0, 0.2); padding: 2px 4px; margin-right: 5px;"></span> H3: Green</div>
                                <div><span style="background-color: rgba(0, 255, 255, 0.2); padding: 2px 4px; margin-right: 5px;"></span> H4: Cyan</div>
                                <div><span style="background-color: rgba(255, 255, 0, 0.2); padding: 2px 4px; margin-right: 5px;"></span> H5: Yellow</div>
                                <div><span style="background-color: rgba(255, 0, 255, 0.2); padding: 2px 4px; margin-right: 5px;"></span> H6: Magenta</div>
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
    >
      H1 - H6
    </Button>
  );
};
