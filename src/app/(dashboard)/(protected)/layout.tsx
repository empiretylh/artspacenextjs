'use client'

import { useAuth } from "@/features/auth/store";
import LoadingPage from "@/components/page/loading-page";
import { paths } from "@/config/paths";
import { useRouter } from "next/navigation";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push(paths.auth.login.path);
  }

  if (user) {
    return <>{children}</>;
  } else {
    return <LoadingPage />;
  }
};

export default ProtectedLayout;
