import ProfileEditForm from "./components/profile-edit-form";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { ProfileMedia } from "./components/profile-media";
import { paths } from "@/config/paths";
import Link from "@/components/common/link";

const SettingsPage = () => {
   return (
      <div className="space-y-4 mb-4">
         <h1 className="text-xl font-bold capitalize font-display">Settings</h1>
         <div>
            <Card>
               <CardContent>
                  <ProfileMedia />
               </CardContent>
            </Card>
         </div>
         <div>
            <Card>
               <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Update your profile</CardDescription>
               </CardHeader>
               <CardContent>
                  <ProfileEditForm onUpdateSuccess={() => {}} />
               </CardContent>
            </Card>
         </div>
         {/* <div>
            <Card>
               <CardHeader>
                  <CardTitle className="font-bold text-lg">General</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                     <Item variant="default" className="w-full p-0">
                        <ItemContent>
                           <ItemTitle className="font-bold">
                              Enable Notifications
                           </ItemTitle>
                           <ItemDescription>
                              Receive email notifications
                           </ItemDescription>
                        </ItemContent>
                        <ItemActions>
                           <Switch id="airplane-mode" />
                        </ItemActions>
                     </Item>
                     <Item variant="default" className="w-full p-0">
                        <ItemContent>
                           <ItemTitle className="font-bold">
                              Dark Mode
                           </ItemTitle>
                           <ItemDescription>Enable dark theme</ItemDescription>
                        </ItemContent>
                        <ItemActions>
                           <Switch id="airplane-mode" />
                        </ItemActions>
                     </Item>
                     <Item variant="default" className="w-full p-0">
                        <ItemContent>
                           <ItemTitle className="font-bold">
                              Auto-Update
                           </ItemTitle>
                           <ItemDescription>
                              Automatically update the app
                           </ItemDescription>
                        </ItemContent>
                        <ItemActions>
                           <Switch id="airplane-mode" />
                        </ItemActions>
                     </Item>
                     <Item variant="default" className="w-full p-0">
                        <ItemContent>
                           <ItemTitle className="font-bold">
                              Location Services
                           </ItemTitle>
                           <ItemDescription>
                              Allow access to location.
                           </ItemDescription>
                        </ItemContent>
                        <ItemActions>
                           <Switch id="airplane-mode" />
                        </ItemActions>
                     </Item>
                  </div>
               </CardContent>
            </Card>
         </div> */}
         <div>
            <Card>
               <CardHeader>
                  <CardTitle>Privacy & Safety</CardTitle>
                  <CardDescription>
                     Manage your privacy and safety settings
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <ul>
                     <li className="text-sm p-2">
                        <Link
                           to={
                              paths.settings.privacyAndSafety.blockedUsers.path
                           }
                           className="hover:text-primary"
                        >
                           Blocked User List
                        </Link>
                     </li>
                  </ul>
               </CardContent>
            </Card>
         </div>
      </div>
   );
};

export default SettingsPage;
