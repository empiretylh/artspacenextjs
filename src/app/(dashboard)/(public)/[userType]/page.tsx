import { UserRouteType } from "@/features/service/artspace/get-users";
import UsersPageContainer from "@/features/user/components/users-container";
import { User } from "@/types";
import { Suspense } from "react";

const UsersRoute = async ({ params }: { params: Promise<{ userType: UserRouteType }> }) => {
  const { userType } = await params;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UsersPageContainer userType={userType} />
    </Suspense>
  );
};

export default UsersRoute;
