'use client'
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import debounce from "lodash/debounce";
import { keepPreviousData } from "@tanstack/react-query";
import type {
   Artwork,
   ColumnFiltersState,
   ListApiResponse,
   SortingState,
} from "@/types";
import type { AxiosResponse } from "axios";
import ArtworksPageView from "@/features/artwork/components/artworks-page-view";
import ArtworkCard from "@/components/app/artwork-card";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { useSoftDeleteArtwork } from "../../service/artspace/soft-delete-artwork";
import DeleteConfirmDialog from "@/components/common/dialogs/delete-confirm-dialog";
import ArtworkUpdateModal from "@/features/artwork/components/artwork-update-modal";
import { useGetUploadedArtworksInfinite } from "@/features/service/artspace/get-uploaded-artworks";
import { ArtworkControlActions } from "@/components/app/artwork-control-actions";

type ControlledArtworkCardProps = {
   onUpdateButtonClick: (artwork: Artwork) => void;
   onDeleteButtonClick: (artwork: Artwork) => void;
   artwork: Artwork;
};

const ControlledArtworkCard: React.FC<ControlledArtworkCardProps> = ({
   onUpdateButtonClick,
   onDeleteButtonClick,
   artwork,
}) => {
   return (
      <div className="relative group inline-block break-inside-avoid mb-4 max-w-sm w-full">
         {/* Hover Buttons */}
         <ArtworkCard
            publicCard={false}
            variant="masonry"
            className="inline-block w-full h-auto"
            artwork={artwork}
         />
         <div className="absolute top-2 right-2 z-10 flex space-x-2 opacity-100 lg:opacity-0 group-hover:lg:opacity-100 transition-opacity">
            <ArtworkControlActions
               onUpdateButtonClick={() => onUpdateButtonClick(artwork)}
               onDeleteButtonClick={() => onDeleteButtonClick(artwork)}
            />
            {/* <Button
               size="sm"
               variant="ghost"
               className="p-1 text-primary"
               onClick={() => onUpdateButtonClick(artwork)}
            >
               <Edit className="w-4 h-4" />
            </Button>
            <Button
               size="sm"
               variant="ghost"
               className="p-1 text-destructive"
               onClick={() => onDeleteButtonClick(artwork)}
            >
               <Trash className="w-4 h-4" />
            </Button> */}
         </div>
      </div>
   );
};

const ArtworksPageContainer = () => {
   const searchParams = useSearchParams();
   const pathname = usePathname();
   const { replace } = useRouter();
   // State
   const [oldData, setOldData] = useState<
      AxiosResponse<ListApiResponse<Artwork>, any>[]
   >([]);
   const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
   const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 12);
   const [globalFilter, setGlobalFilter] = useState({
      search: searchParams.get("search") || "",
   });
   const [filters, setFilters] = useState<ColumnFiltersState>(
      searchParams.get("filters")
         ? JSON.parse(searchParams.get("filters")!)
         : []
   );
   const [sorts, setSorts] = useState<SortingState>(
      searchParams.get("sorts") ? JSON.parse(searchParams.get("sorts")!) : []
   );
   const [debouncedSearch, setDebouncedSearch] = useState(globalFilter.search);
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
         },
      },
   });

   const onDeleteButtonClick = (artwork: Artwork) => {
      setSelectedArtwork(artwork);
      setIsDeleteModalOpen(true);
   };

   const handleDelete = async () => {
      softDeleteArtworkMutation.mutate({
         artworkId: String(selectedArtwork?.id),
      });
   };

   const onUpdateButtonClick = (artwork: Artwork) => {
      setSelectedArtwork(artwork);
      setIsArtworkUpdateModalOpen(true);
   };

   // Fetch Artworks
   const { isLoading, data, fetchNextPage, hasNextPage, isFetchingNextPage } =
      useGetUploadedArtworksInfinite({
         page,
         search: searchParams.get("search") || "",
         filters: [...filters].filter(Boolean) as ColumnFiltersState,
         sorts,
         limit,
         queryConfig: { placeholderData: keepPreviousData },
      });

   useEffect(() => {
      if (!isLoading && data) setOldData(data.pages);
   }, [data, isLoading]);

   // const pagesToRender = isLoading ? oldData : data?.pages || [];

   // Debounced search
   const debouncedSetSearch = useMemo(
      () =>
         debounce((value: string) => {
            setDebouncedSearch(value);
            setPage(1);
         }, 500),
      []
   );

   const removeFromFilter = (filterId: string, key: string) => {
      setFilters((prev) =>
         prev.filter((f) =>
            f.id === filterId ? String(f.value) !== String(key) : true
         )
      );
   };

   const buildParams = () => {
      const params: Record<string, string> = {};
      if (page && page !== 1) params.page = page.toString();
      if (limit && limit !== 12) params.limit = limit.toString();
      if (globalFilter.search) params.search = globalFilter.search;

      const filterGroups: Record<string, Set<string>> = {};
      for (const filter of filters) {
         if (filter.id && filter.value) {
            if (!filterGroups[filter.id]) filterGroups[filter.id] = new Set();
            filterGroups[filter.id].add(String(filter.value));
         }
      }

      if (filters.some((f) => f.id === "price_range")) {
         const priceFilters = filters.filter((f) => f.id === "price_range");
         filterGroups["price_range"] = new Set([
            String(priceFilters.at(-1)?.value),
         ]);
      }

      Object.entries(filterGroups).forEach(([key, values]) => {
         params[key] =
            key === "price_range"
               ? Array.from(values)[0]
               : Array.from(values).join("+");
      });

      if (sorts.length > 0) {
         params.sort = `${sorts[0].id}-${sorts[0].desc ? "desc" : "asc"}`;
      }

      return params;
   };

   // Update URL when state changes
   useEffect(() => {
      const params = buildParams();
      replace(`${pathname}?${decodeURI(
         Object.entries(params)
            .map(([k, v]) => `${k}=${v}`)
            .join("&")
      )}`);
   }, [page, limit, debouncedSearch, filters, sorts]);

   // Parse URL on mount
   useEffect(() => {
      const newPage = Number(searchParams.get("page")) || 1;
      const newLimit = Number(searchParams.get("limit")) || 12;
      const newSearch = searchParams.get("search") || "";
      const newFilters: ColumnFiltersState = [];

      searchParams.forEach((value, key) => {
         if (!["page", "limit", "search", "sort"].includes(key)) {
            if (key === "price_range") {
               if (value) newFilters.push({ id: key, value });
            } else {
               const values = String(value).split(" ");
               values.forEach((v) => {
                  if (v) newFilters.push({ id: key, value: Number(v) });
               });
            }
         }
      });

      const newSorts: SortingState = [];
      const sortParam = searchParams.get("sort");
      if (sortParam) {
         const [id, order] = sortParam.split("-");
         newSorts.push({ id, desc: order === "desc" });
      }

      setPage(newPage);
      setLimit(newLimit);
      setGlobalFilter({ search: newSearch });
      setDebouncedSearch(newSearch);
      setFilters(newFilters);
      setSorts(newSorts);
   }, []);

   return (
      <>
         <ArtworksPageView
            isLoading={isLoading}
            pagesToRender={data?.pages || []}
            filters={filters}
            setFilters={setFilters}
            sorts={sorts}
            setSorts={setSorts}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            removeFromFilter={removeFromFilter}
            artworkCard={(artwork) => {
               return (
                  <ControlledArtworkCard
                     onUpdateButtonClick={onUpdateButtonClick}
                     onDeleteButtonClick={onDeleteButtonClick}
                     artwork={artwork}
                  />
               );
            }}
            options={{
               enableFilters: false,
               enableSorting: false,
            }}
         />
         <DeleteConfirmDialog
            isDeleteModalOpen={isDeleteModalOpen}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
            handleDelete={handleDelete}
            isDeleting={softDeleteArtworkMutation.isPending}
            title={
               selectedArtwork?.title ? `${selectedArtwork?.title}` : "artwork"
            }
            description="Are you sure you want to delete this artwork? This action cannot be undone."
         />
         <ArtworkUpdateModal
            artwork={selectedArtwork}
            isArtworkUpdateModalOpen={isArtworkUpdateModalOpen}
            setIsArtworkUpdateModalOpen={setIsArtworkUpdateModalOpen}
         />
      </>
   );
};

export default ArtworksPageContainer;
