import { paths } from "@/config/paths";
import Link from "../common/link";
import FacebookIcon from "../icons/facebook-icon";
import InstagramIcon from "../icons/instagram-icon";
import TwitterIcon from "../icons/twitter-icon";
import { useTranslations } from "next-intl";

const AppSidebarFooter = () => {
   const t = useTranslations("Header");

   return (
      <div className="flex flex-col gap-2">
         <Link to={paths.root.path} className="uppercase font-display text-sm">{t("title")}</Link>
         <div className="flex gap-2">
            <span className="hover:text-primary cursor-pointer">
               <FacebookIcon />
            </span>
            <span className="hover:text-primary cursor-pointer">
               <InstagramIcon />
            </span>
            <span className="hover:text-primary cursor-pointer">
               <TwitterIcon />
            </span>
         </div>
      </div>
   );
};

export default AppSidebarFooter;
