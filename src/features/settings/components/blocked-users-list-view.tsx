import { Fragment, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";

import ProfileCard from "@/components/app/profile/profile-card";
import { EmptyState } from "@/components/layout/empty-state";

import type { ColumnFiltersState, SortingState, User } from "@/types";
import LoadingPage from "@/components/page/loading-page";
import UserListItem from "@/components/app/user-list-item";
import { UnblockUserDialog } from "@/components/app/unblock-user-dialog";
import UnblockUserListCard from "@/components/app/unblock-user-list-card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import BlockedUsersListSkeleton from "./blocked-users-list-skeleton";

interface Props {
   title?: string;
   isLoading: boolean;
   filters: ColumnFiltersState;
   setFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
   sorts: SortingState;
   setSorts: (v: SortingState) => void;
   pagesToRender: any[];
   isDataEmpty: () => boolean;
   removeFromFilter: (id: string, key: string) => void;
   fetchNextPage: () => void;
   hasNextPage?: boolean;
   isFetchingNextPage: boolean;
   onSearchChange?: (value: string) => void;
}

const BlockedUsersListView = ({
   isLoading,
   filters,
   setFilters,
   sorts,
   setSorts,
   pagesToRender,
   isDataEmpty,
   removeFromFilter,
   fetchNextPage,
   hasNextPage,
   isFetchingNextPage,
   onSearchChange,
}: Props) => {
   const [isUnblockModalOpen, setIsUnblockModalOpen] = useState(false);
   const [selectedUser, setSelectedUser] = useState<User | null>(null);

   return (
      <>
         <div>
            <Input
               onChange={(e) => onSearchChange?.(e.target.value)}
               className="w-full max-w-md mx-auto"
               placeholder="Search by name"
            />
         </div>
         <div className="flex-grow transition-all duration-300">
            <div className="flex flex-col lg:flex-row transition-all duration-300">
               <div className="transition-all duration-300 w-full space-y-3">
                  {/* <FilterRow filters={filters} setFilters={setFilters} /> */}

                  {filters.length > 0 &&
                     filters.some((f) => f.id !== "price_range") && (
                        <>
                           <span className="inline-block mr-2">SearchBy:</span>
                           <div className="inline-flex flex-wrap gap-2 mb-4">
                              {filters
                                 .filter((f) => f.id !== "price_range")
                                 .map((f) => (
                                    <Badge
                                       className="bg-primary/15 text-primary"
                                       key={`${f.id}-${f.value}`}
                                    >
                                       {f.value}
                                       <Button
                                          onClick={() =>
                                             removeFromFilter(
                                                f.id,
                                                String(f.value)
                                             )
                                          }
                                          size="icon"
                                          className="size-4 hover:text-destructive"
                                          variant="link"
                                       >
                                          <XIcon />
                                       </Button>
                                    </Badge>
                                 ))}
                           </div>
                        </>
                     )}

                  {isLoading && <BlockedUsersListSkeleton />}
                  {!isLoading && (
                     <div className="mb-4">
                        {isDataEmpty() && <EmptyState />}

                        {!isDataEmpty() && (
                           <>
                              <div
                                 className={cn(
                                    "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2"
                                 )}
                              >
                                 {pagesToRender.map((page) => (
                                    <Fragment key={page.data.next}>
                                       {page.data.results.map(
                                          (blockedUser: any) => (
                                             <UnblockUserListCard
                                                border
                                                key={blockedUser.id}
                                                user={blockedUser}
                                                onClick={() => {
                                                   setSelectedUser(blockedUser);
                                                   setIsUnblockModalOpen(true);
                                                }}
                                             />
                                          )
                                       )}
                                    </Fragment>
                                 ))}
                              </div>

                              <div className="flex justify-center my-2">
                                 <Button
                                    onClick={fetchNextPage}
                                    disabled={
                                       !hasNextPage || isFetchingNextPage
                                    }
                                 >
                                    {isFetchingNextPage
                                       ? "Loading more..."
                                       : hasNextPage
                                         ? "Load More"
                                         : "Nothing more to load"}
                                 </Button>
                              </div>
                           </>
                        )}
                     </div>
                  )}
               </div>
            </div>
         </div>
         {selectedUser && (
            <UnblockUserDialog
               open={isUnblockModalOpen}
               setOpen={setIsUnblockModalOpen}
               entityId={String(selectedUser.id)}
               entityType={selectedUser.user_type}
               entityName={
                  selectedUser.first_name + " " + selectedUser.last_name
               }
            />
         )}
      </>
   );
};

export default BlockedUsersListView;
