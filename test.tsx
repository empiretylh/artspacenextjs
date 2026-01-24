import GlobalLayout from "@/components/layout/global-layout";
import MainLayout from "@/components/layout/main-layout";
import NotFound from "@/components/layout/not-found";
import { paths } from "@/config/paths";
import { createBrowserRouter, RouterProvider } from "react-router";
import PostCreateRoute from "./routes/app/posts/create";
import PostEditRoute from "./routes/app/posts/edit";
import PostRoute from "./routes/app/posts/post";
import PostsRoute from "./routes/app/posts/posts";
import { RequireAuth } from "@/components/layout/required-auth";
import LoginRoute from "./routes/auth/login";
import RegisterRoute from "./routes/auth/register";
import HomePageRoute from "./routes/app/home";
import ArtWorksRoute from "./routes/app/artworks/artworks";
import ArtworkDetailRoute from "./routes/app/artworks/artwork";
import CheckoutRoute from "./routes/app/checkout";
import DashboardLayout from "@/components/layout/dashboard-layout";
import UploadArtworkRoute from "./routes/app/dashboard/upload-artwork";
import DashboardRoute from "./routes/app/dashboard/dashboard";
import CartRoute from "./routes/app/cart";
import OrderListRoute from "./routes/app/dashboard/order-list";
import ProfileEditRoute from "./routes/app/dashboard/profile-edit";
import ArtworkEditRoute from "./routes/app/dashboard/edit-artwork";
import ArtistsRoute from "./routes/app/artists";
import ArtistDetailLayout from "@/features/artist/components/artist-detail-layout";
import DashboardArtistArtworksRoute from "./routes/app/dashboard/dashboard-artist-artworks";
import CollectorsRoute from "./routes/app/collectors/collectors-route";
import GalleriesRoute from "./routes/app/galleries/galleries-route";
import ChatsRoute from "./routes/app/chats/chats-route";
import InventoryRoute from "./routes/app/inventory/inventory-route";
import SettingsRoute from "./routes/app/settings/settings-route";
import ProfileRoute from "./routes/app/profile/profile-route";
import ProfileLayout from "@/features/profile/components/profile-layout";
import ProfileOverviewPage from "@/features/profile/pages/profile-overview-page";
import ProfileCollectionsPage from "@/features/profile/pages/profile-collections-page";
import ProfileSavePage from "@/features/profile/pages/profile-save-page";
import ProfileLikedArtworksPage from "@/features/profile/pages/profile-liked-artworks-page";
import ProfileArtworksPage from "@/features/profile/pages/profile-artworks-page";
import CollectorLayout from "@/features/collectors/components/collector-layout";
import CollectorOverviewRoute from "./routes/app/collectors/collector-overview-route";
import CollectorArtworksRoute from "./routes/app/collectors/collector-artwork-route";
import CollectorCollectionsRoute from "./routes/app/collectors/collector-collections-route";
import CollectorSaveRoute from "./routes/app/collectors/collector-save-route";
import CollectorLikedArtworksRoute from "./routes/app/collectors/collector-liked-artworks-route";
import GalleryLayout from "@/features/gallery/components/gallery-layout";
import GalleryOverviewRoute from "./routes/app/galleries/gallery-overview-route";
import GalleryArtworksRoute from "./routes/app/galleries/gallery-artwork-route";
import GalleryCollectionsRoute from "./routes/app/galleries/gallery-collections-route";
import GallerySaveRoute from "./routes/app/galleries/gallery-save-route";
import GalleryLikedArtworksRoute from "./routes/app/galleries/gallery-liked-artworks-route";
import ArtistOverviewRoute from "./routes/app/artists/artist-overview-route";
import ArtistCollectionsRoute from "./routes/app/artists/artist-collections-route";
import ArtistSaveRoute from "./routes/app/artists/artist-save-route";
import ArtistLikedArtworksRoute from "./routes/app/artists/artist-liked-artworks-route";
import ArtistArtworksRoute from "./routes/app/artists/artist-artwork-route";
import OrderRoute from "./routes/app/order/order-route";
import EventsRoute from "./routes/app/events/events-route";
import EventDetailRoute from "./routes/app/events/event-detail-route";
import ScrollToTopWrapper from "@/components/layout/scroll-to-top-wrapper";
import ProfileEventsPage from "@/features/profile/pages/profile-events-page";
import CollectionsRoute from "./routes/app/collections/collections-route";
import BlockedUsersRoute from "./routes/app/settings/blocked-users-route";
import AuthCheck from "@/components/layout/auth-check";

export const router = createBrowserRouter([
  {
    element: <GlobalLayout />,
    children: [
      {
        element: <MainLayout />,
        children: [

          {
            element: <AuthCheck />,
            children: [
              // Profile
              {
                element: (
                  <ScrollToTopWrapper>
                    <ProfileLayout />
                  </ScrollToTopWrapper>
                ),
                children: [
                  {
                    path: paths.profile.path,
                    element: <ProfileOverviewPage />,
                  },
                  {
                    path: paths.profile.collections.path,
                    element: <ProfileCollectionsPage />,
                  },
                  {
                    path: paths.profile.events.path,
                    element: <ProfileEventsPage />,
                  },
                  {
                    path: paths.profile.save.path,
                    element: <ProfileSavePage />,
                  },
                  {
                    path: paths.profile.likedArtworks.path,
                    element: <ProfileLikedArtworksPage />,
                  },
                  {
                    path: paths.profile.artworks.path,
                    element: <ProfileArtworksPage />,
                  },
                ],
              },
              {
                path: paths.settings.path,
                element: (
                  <ScrollToTopWrapper>
                    <SettingsRoute />
                  </ScrollToTopWrapper>
                ),
              },

              {
                path: paths.settings.privacyAndSafety.blockedUsers.path,
                element: (
                  <ScrollToTopWrapper>
                    <BlockedUsersRoute />
                  </ScrollToTopWrapper>
                ),
              },
            ],
          },

          {
            path: paths.collections.path,
            element: (
              <ScrollToTopWrapper>
                <CollectionsRoute />
              </ScrollToTopWrapper>
            ),
          },

          // Home
          {
            index: true,
            element: (
              <ScrollToTopWrapper>
                <HomePageRoute />
              </ScrollToTopWrapper>
            ),
          },

          // Artworks
          {
            path: paths.artworks.path,
            children: [
              {
                index: true,
                element: (
                  <ScrollToTopWrapper>
                    <ArtWorksRoute />
                  </ScrollToTopWrapper>
                ),
              },
              {
                path: paths.artworks.detail.path,
                element: (
                  <ScrollToTopWrapper>
                    <ArtworkDetailRoute />
                  </ScrollToTopWrapper>
                ),
              },
            ],
          },

          // Events
          {
            path: paths.events.path,
            children: [
              {
                index: true,
                element: (
                  <ScrollToTopWrapper>
                    <EventsRoute />
                  </ScrollToTopWrapper>
                ),
              },
              {
                path: paths.events.detail.path,
                element: (
                  <ScrollToTopWrapper>
                    <EventDetailRoute />
                  </ScrollToTopWrapper>
                ),
              },
            ],
          },

          // Galleries
          {
            path: paths.galleries.path,
            children: [
              {
                index: true,
                element: (
                  <ScrollToTopWrapper>
                    <GalleriesRoute />
                  </ScrollToTopWrapper>
                ),
              },
              {
                element: <GalleryLayout />,
                children: [
                  {
                    path: paths.galleries.detail.path,
                    element: (
                      <ScrollToTopWrapper>
                        <GalleryOverviewRoute />
                      </ScrollToTopWrapper>
                    ),
                  },
                  {
                    path: paths.galleries.artworks.path,
                    element: (
                      <ScrollToTopWrapper>
                        <GalleryArtworksRoute />
                      </ScrollToTopWrapper>
                    ),
                  },
                  {
                    path: paths.galleries.collections.path,
                    element: (
                      <ScrollToTopWrapper>
                        <GalleryCollectionsRoute />
                      </ScrollToTopWrapper>
                    ),
                  },
                  {
                    path: paths.galleries.save.path,
                    element: (
                      <ScrollToTopWrapper>
                        <GallerySaveRoute />
                      </ScrollToTopWrapper>
                    ),
                  },
                  {
                    path: paths.galleries.likedArtworks.path,
                    element: (
                      <ScrollToTopWrapper>
                        <GalleryLikedArtworksRoute />
                      </ScrollToTopWrapper>
                    ),
                  },
                ],
              },
            ],
          },

          // Artists
          {
            path: paths.artists.path,
            children: [
              {
                index: true,
                element: (
                  <ScrollToTopWrapper>
                    <ArtistsRoute />
                  </ScrollToTopWrapper>
                ),
              },
              {
                element: <ArtistDetailLayout />,
                children: [
                  {
                    path: paths.artists.detail.path,
                    element: (
                      <ScrollToTopWrapper>
                        <ArtistOverviewRoute />
                      </ScrollToTopWrapper>
                    ),
                  },
                  {
                    path: paths.artists.artworks.path,
                    element: (
                      <ScrollToTopWrapper>
                        <ArtistArtworksRoute />
                      </ScrollToTopWrapper>
                    ),
                  },
                  {
                    path: paths.artists.collections.path,
                    element: (
                      <ScrollToTopWrapper>
                        <ArtistCollectionsRoute />
                      </ScrollToTopWrapper>
                    ),
                  },
                  {
                    path: paths.artists.save.path,
                    element: (
                      <ScrollToTopWrapper>
                        <ArtistSaveRoute />
                      </ScrollToTopWrapper>
                    ),
                  },
                  {
                    path: paths.artists.likedArtworks.path,
                    element: (
                      <ScrollToTopWrapper>
                        <ArtistLikedArtworksRoute />
                      </ScrollToTopWrapper>
                    ),
                  },
                ],
              },
            ],
          },

          // Collectors
          {
            path: paths.collectors.path,
            children: [
              {
                index: true,
                element: (
                  <ScrollToTopWrapper>
                    <CollectorsRoute />
                  </ScrollToTopWrapper>
                ),
              },
              {
                element: <CollectorLayout />,
                children: [
                  {
                    path: paths.collectors.detail.path,
                    element: (
                      <ScrollToTopWrapper>
                        <CollectorOverviewRoute />
                      </ScrollToTopWrapper>
                    ),
                  },
                  {
                    path: paths.collectors.artworks.path,
                    element: (
                      <ScrollToTopWrapper>
                        <CollectorArtworksRoute />
                      </ScrollToTopWrapper>
                    ),
                  },

                  {
                    path: paths.collectors.collections.path,
                    element: (
                      <ScrollToTopWrapper>
                        <CollectorCollectionsRoute />
                      </ScrollToTopWrapper>
                    ),
                  },
                  {
                    path: paths.collectors.save.path,
                    element: (
                      <ScrollToTopWrapper>
                        <CollectorSaveRoute />
                      </ScrollToTopWrapper>
                    ),
                  },
                  {
                    path: paths.collectors.likedArtworks.path,
                    element: (
                      <ScrollToTopWrapper>
                        <CollectorLikedArtworksRoute />
                      </ScrollToTopWrapper>
                    ),
                  },
                ],
              },
            ],
          },

          // Other Routes
          {
            path: paths.cart.path,
            element: (
              <ScrollToTopWrapper>
                <CartRoute />
              </ScrollToTopWrapper>
            ),
          },
          {
            path: paths.order.path,
            element: (
              <ScrollToTopWrapper>
                <OrderRoute />
              </ScrollToTopWrapper>
            ),
          },
          {
            element: <RequireAuth />,
            children: [
              {
                path: paths.checkout.path,
                element: (
                  <ScrollToTopWrapper>
                    <CheckoutRoute />
                  </ScrollToTopWrapper>
                ),
              },
            ],
          },

          // Posts
          {
            path: paths.posts.path,
            children: [
              {
                index: true,
                element: (
                  <ScrollToTopWrapper>
                    <PostsRoute />
                  </ScrollToTopWrapper>
                ),
              },
              {
                path: ":postId",
                element: (
                  <ScrollToTopWrapper>
                    <PostRoute />
                  </ScrollToTopWrapper>
                ),
              },
              {
                path: "create",
                element: (
                  <ScrollToTopWrapper>
                    <PostCreateRoute />
                  </ScrollToTopWrapper>
                ),
              },
              {
                path: "edit/:id",
                element: (
                  <ScrollToTopWrapper>
                    <PostEditRoute />
                  </ScrollToTopWrapper>
                ),
              },
            ],
          },
        ],
      },

      // Auth Routes
      {
        path: paths.auth.login.path,
        element: <LoginRoute />,
      },
      {
        path: paths.auth.register.path,
        element: <RegisterRoute />,
      },

      // Fallback
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}


const test = {
  "id": "ord_1000",
  "buyerId": 200,
  "buyer": {
    "id": 200,
    "name": "User 1",
    "email": "user1@example.com"
  },
  "total_price": 345.42,
  "shipping_address": "100 Innovation Way, Tech City, 90210",
  "stripe_session_id": null,
  "status": "PENDING",
  "paid_at": null,
  "created_at": "2025-12-31T17:30:00.000Z",
  "updated_at": "2026-01-01T17:30:00.000Z",
  "items": [
    {
      "id": "item_0_1",
      "orderId": "ord_1000",
      "productId": 50,
      "quantity": 2,
      "price": 25
    }
  ]
}
