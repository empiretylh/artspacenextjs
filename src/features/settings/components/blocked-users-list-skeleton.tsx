import UnblockUserListCardSkeleton from "@/components/app/unblock-user-list-card-skeleton";

type BlockedUsersListSkeletonProps = {
   count?: number;
};

const BlockedUsersListSkeleton = ({
   count = 20,
}: BlockedUsersListSkeletonProps) => {
   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
         {Array.from({ length: count }).map((_, index) => (
            <UnblockUserListCardSkeleton key={index} border />
         ))}
      </div>
   );
};

export default BlockedUsersListSkeleton;
