import { Card, CardContent } from "@/components/ui/card";
import LoginForm from "../components/login-form";
import Image from "@/components/common/image";
import Link from "@/components/common/link";

const LoginPage = () => {
   return (
      <div
         // className="flex min-h-svh w-full items-center justify-center p-6 md:p-10
         //         bg-[url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80')]
         //         bg-cover bg-center bg-no-repeat"
         className="bg-[#faf7ef] flex min-h-svh w-full flex-col gap-3 items-center justify-center p-6 md:p-10"
      >
         <Link to="/">
            <Image
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
                  <LoginForm />
               </CardContent>
            </Card>
         </div>
         <Image
            src={'/assets/banner-desktop.png'}
            alt="Logo"
            width={200}
            height={200}
            title="showcase-banner"
            loading="eager"
            className="mx-auto rounded-lg overflow-hidden max-w-sm"
         />
      </div>
   );
};

export default LoginPage;
