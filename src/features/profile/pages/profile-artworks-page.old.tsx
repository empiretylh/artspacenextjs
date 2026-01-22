import { useState } from "react";
import { useGetUploadedArtworks } from "../api/get-uploaded-artworks";
import ArtworkCard from "@/components/app/artwork-card";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import DeleteConfirmDialog from "@/components/common/dialogs/delete-confirm-dialog";
import { useSoftDeleteArtwork } from "../../service/artspace/soft-delete-artwork";
import { Pagination } from "@/components/common/pagination";
import { useSearchParams } from "react-router";
import { keepPreviousData } from "@tanstack/react-query";
import type { Artwork } from "@/types";
import ArtworkUpdateModal from "@/features/artwork/components/artwork-update-modal";

const ProfileArtworksPage = () => {
   const [searchParams, setSearchParams] = useSearchParams(); // ✅ for syncing URL
   const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
   const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 12);
   const uploadedArtworksQuery = useGetUploadedArtworks({
      page,
      limit,
      // search: debouncedSearch,
      // filters: [...filters].filter(Boolean) as ColumnFiltersState,
      // sorts,
      queryConfig: {
         placeholderData: keepPreviousData,
      },
   });
   const artworks = uploadedArtworksQuery.data?.data?.results ?? [];

   const [isArtworkUpdateModalOpen, setIsArtworkUpdateModalOpen] =
      useState(false);

   const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
   const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(
      null
   );

   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const softDeleteArtworkMutation = useSoftDeleteArtwork({
      mutationConfig: {
         onSuccess: () => {
            setIsDeleteModalOpen(false);
            uploadedArtworksQuery.refetch();
         },
      },
   });

   const openDeleteDialog = (id: string) => {
      setSelectedArtworkId(id);
      setIsDeleteModalOpen(true);
   };

   const handleDelete = async () => {
      softDeleteArtworkMutation.mutate({
         artworkId: String(selectedArtworkId),
      });
   };

   const meta = {
      total: uploadedArtworksQuery?.data?.data.count ?? 0,
   };

   const handlePageChange = (newPage: number) => {
      setPage(newPage);
   };

   const handleLimitChange = (newLimit: number) => {
      setLimit(newLimit);
      setPage(1);
   };

   const onUpdateButtonClick = (artwork: Artwork) => {
      setSelectedArtwork(artwork);
      setIsArtworkUpdateModalOpen(true);
   };

   return (
      <div className="p-4">
         <h2 className="text-2xl font-semibold mb-6">My Uploaded Artworks</h2>

         <div className="flex flex-wrap gap-4">
            {artworks.map((artwork) => (
               <div
                  key={artwork.id}
                  className="relative group inline-block break-inside-avoid mb-4 max-w-sm w-full"
               >
                  <ArtworkCard publicCard={false} artwork={artwork} />
                  {/* Hover Buttons */}
                  <div className="absolute top-2 right-2 flex space-x-2 opacity-100 lg:opacity-0 group-hover:lg:opacity-100 transition-opacity">
                     {/* <Link
                        to={paths.dashboard.artworkEdit.getHref(
                           String(artwork.id)
                        )}
                     >
                        <Button size="sm" variant="outline" className="p-1">
                           <Edit className="w-4 h-4" />
                        </Button>
                     </Link> */}
                     <Button
                        size="sm"
                        variant="outline"
                        className="p-1"
                        onClick={() => onUpdateButtonClick(artwork)}
                     >
                        <Edit className="w-4 h-4" />
                     </Button>
                     <Button
                        size="sm"
                        variant="destructive"
                        className="p-1"
                        onClick={() => openDeleteDialog(artwork.id)}
                     >
                        <Trash className="w-4 h-4" />
                     </Button>
                  </div>
               </div>
            ))}
         </div>

         <Pagination
            limit={limit}
            onLimitChange={handleLimitChange}
            total={meta.total}
            page={page}
            onPageChange={handlePageChange}
         />

         {/* Delete Confirmation Modal */}
         <DeleteConfirmDialog
            isDeleteModalOpen={isDeleteModalOpen}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
            handleDelete={handleDelete}
            isDeleting={softDeleteArtworkMutation.isPending}
            title="artwork"
            description="Are you sure you want to delete this artwork? This action cannot be undone."
         />
         <ArtworkUpdateModal
            artwork={selectedArtwork}
            isArtworkUpdateModalOpen={isArtworkUpdateModalOpen}
            setIsArtworkUpdateModalOpen={setIsArtworkUpdateModalOpen}
         />
      </div>
   );
};

export default ProfileArtworksPage;
