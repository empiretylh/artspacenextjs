import FacebookIcon from "../icons/facebook-icon";
import Home from "../icons/home-icon";
import InstagramIcon from "../icons/instagram-icon";
import TwitterIcon from "../icons/twitter-icon";

const AppSidebarFooter = () => {
   return (
      <div className="flex flex-col gap-2">
         <h1 className="uppercase font-display text-sm">Myanmar Art Space</h1>
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
