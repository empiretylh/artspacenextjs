import AppImage from "@/components/common/app-image";
import Link from "@/components/common/link";
import { Card, CardContent } from "@/components/ui/card";
import LoginForm from "../components/login-form";

const LoginPage = () => {
   return (
      <div
         // className="flex min-h-svh w-full items-center justify-center p-6 md:p-10
         //         bg-[url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80')]
         //         bg-cover bg-center bg-no-repeat"
         className="bg-[#faf7ef] flex min-h-svh w-full flex-col gap-3 items-center justify-center p-6 md:p-10"
      >
         <div className="max-w-sm flex gap-3 flex-col items-center w-full">
            <Link to="/">
               <AppImage
                  title="logo"
                  loading="eager"
                  width={160}
                  height={160}
                  src={"/assets/logo.png"}
                  alt="Logo"
                  preload
                  className="mx-auto w-40 h-40 mb-4"
               />
            </Link>
            <div className="w-full max-w-sm">
               <Card>
                  <CardContent>
                     <LoginForm />
                  </CardContent>
               </Card>
            </div>
            <AppImage
               src={'/assets/banner-desktop.png'}
               alt="Logo"
               preload
               // width={384}
               // height={144}
               fill
               title="showcase-banner"
               loading="eager"
               containerClassName="h-[144px] w-full"
               className="mx-auto rounded-lg overflow-hidden max-w-sm"
            />
         </div>
      </div>
   );
};

export default LoginPage;
