import AppImage from "@/components/common/app-image";
import Link from "@/components/common/link";
import { Card, CardContent } from "@/components/ui/card";
import RegisterForm from "../components/register-form";

const RegisterPage = () => {
   return (
      <div
         // className="flex min-h-svh w-full items-center justify-center p-6 md:p-10
         //         bg-[url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80')]
         //         bg-cover bg-center bg-no-repeat"
         className="bg-[#faf7ef] flex min-h-svh w-full flex-col gap-3 items-center justify-center p-6 md:p-10"
      >
         <Link to="/">
            <AppImage
               title="logo"
               loading="eager"
               width={80}
               height={80}
               src={"/assets/logo.png"}
               alt="Logo"
               className="mx-auto w-20 h-20"
            />
         </Link>
         <div className="w-full max-w-sm">
            <Card>
               <CardContent>
                  <RegisterForm />
               </CardContent>
            </Card>
         </div>
         <AppImage
            src={'/assets/banner-desktop.png'}
            alt="Logo"
            width={384}
            height={144}
            title="showcase-banner"
            loading="eager"
            className="mx-auto rounded-lg overflow-hidden max-w-sm"
         />
      </div>
   );
};

export default RegisterPage;
