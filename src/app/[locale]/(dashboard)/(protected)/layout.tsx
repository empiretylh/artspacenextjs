import LoadingPage from "@/components/page/loading-page";
import { paths } from "@/config/paths";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const { user } = await getSession();

  if (!user) {
    redirect(paths.auth.login.path);
  }

  if (user) {
    return <>{children}</>;
  } else {
    return <LoadingPage />;
  }
};

export default ProtectedLayout;
