import { paths } from "@/config/paths";
import Link from "../common/link";
import FacebookIcon from "../icons/facebook-icon";
import YoutubeIcon from "../icons/youtube-icon";
import TiktokIcon from "../icons/tiktok-icon";
import { useTranslations } from "next-intl";

const AppSidebarFooter = () => {
   const t = useTranslations("Header");

   return (
      <div className="flex flex-col gap-2">
         <Link to={paths.root.path} className="uppercase font-display text-sm">{t("title")}</Link>
         <div className="flex gap-2">
            <a
               href="https://www.facebook.com/myanamarartspace?mibextid=wwXIfr&mibextid=wwXIfr"
               target="_blank"
               rel="noopener noreferrer"
               className="hover:text-primary transition-colors cursor-pointer"
               aria-label="Facebook"
            >
               <FacebookIcon />
            </a>
            <a
               href="https://youtube.com/@myanmarartspace?si=kz-EYYSd8RSzWnI0"
               target="_blank"
               rel="noopener noreferrer"
               className="hover:text-primary transition-colors cursor-pointer"
               aria-label="YouTube"
            >
               <YoutubeIcon />
            </a>
            <a
               href="https://vt.tiktok.com/ZSXr1t4rF/"
               target="_blank"
               rel="noopener noreferrer"
               className="hover:text-primary transition-colors cursor-pointer"
               aria-label="TikTok"
            >
               <TiktokIcon />
            </a>
         </div>
      </div>
   );
};

export default AppSidebarFooter;
