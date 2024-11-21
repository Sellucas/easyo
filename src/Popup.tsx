import "./index.css";
import "./assets/fonts/Play-Regular.ttf";
import { Header } from "./components/header";
import { SeoTabs } from "./components/seo-tabs";

function Popup() {
  return (
    <div className="w-[500px] text-sm p-4 light:bg-gray-50 text-foreground font-[GeistVF]">
      <Header />
      <SeoTabs />
      <p className="text-sm text-muted-foreground text-center pt-6 ">
        © {new Date().getFullYear()} easyo.
      </p>
    </div>
  );
}

export default Popup;
