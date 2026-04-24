'use client'
// import UsersIcon from "@/components/icons/users-icon";
import AwardIcon from "@/components/icons/award-icon";
import CheckMarkIcon from "@/components/icons/check-mark-icon";
import Layers2Icon from "@/components/icons/layers-2-icon";
import SquareStackIcon from "@/components/icons/square-stack-icon";
import { useProfileUser } from "@/components/providers/profile-user-provider";
import { getImage } from "@/lib/utils";

const UserOverviewPage = () => {
   const { data: user } = useProfileUser();

   return (
      <section className="" aria-labelledby="user-overview-title">
         <div className="space-y-4 col-span-3 md:col-span-2">
            <div>
               <h2
                  id="user-overview-title"
                  className="text-lg font-semibold font-display mb-3"
               >
                  About the user
               </h2>
               <p className="text-base">
                  {user?.profile?.about || "No about yet"}
               </p>
            </div>
            <div>
               <h3 className="text-lg font-semibold font-display mb-3">
                  Summary
               </h3>
               <ul className="space-y-4 text-sm font-normal">
                  <li className="flex gap-2 items-center">
                     {/* <UsersIcon /> */}
                     <span className="">Kind of Fine Art</span>
                     <span className="text-muted-foreground">
                        Digital Impressionism
                     </span>
                  </li>
                  <li className="flex gap-2 items-center">
                     <AwardIcon />
                     <span className="">Kind of Fine Art</span>
                     <div className="flex justify-between items-center bg-success/10 p-1.5 text-xs font-normal gap-1 rounded-xl text-success">
                        <CheckMarkIcon size={18} className="w-4 h-4" /> Verified
                     </div>
                  </li>
                  <li className="flex gap-2 items-center">
                     <Layers2Icon />
                     <span className="">Kind of Fine Art</span>
                     <div className="flex justify-between items-center bg-success/10 p-1.5 text-xs font-normal gap-1 rounded-xl text-success">
                        <CheckMarkIcon size={18} className="w-4 h-4" /> Verified
                     </div>
                  </li>
                  <li className="flex gap-2 items-center">
                     <SquareStackIcon />
                     <span className="">Kind of Fine Art</span>
                     <div className="flex justify-between items-center bg-success/10 p-1.5 text-xs font-normal gap-1 rounded-xl text-success">
                        <CheckMarkIcon size={18} className="w-4 h-4" /> Verified
                     </div>
                  </li>
               </ul>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
               {user.profile.features_photos?.map((image) => (
                  <figure key={image.id} className="relative">
                     <img
                        src={getImage(image.image)}
                        className="rounded-2xl w-full border h-[400px]"
                        alt={image.description || "Featured photo"}
                     />
                  </figure>
               ))}
            </div>
         </div>
         {/* <div className="col-span-3 md:col-span-1">
            <UserArtworksList />
         </div> */}
      </section>
   );
};

export default UserOverviewPage;
