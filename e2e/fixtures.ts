import { test as base, expect } from '@playwright/test';

type MockArtworksOptions = {
  total?: number;
  pageSize?: number;
  delayMs?: number;
};

type Fixtures = {
  mockArtworks: (options?: MockArtworksOptions) => Promise<void>;
};

const test = base.extend<Fixtures>({
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('artspace:firstLoadPopup', 'true');
    });
    await use(page);
  },
  mockArtworks: async ({ page }, use) => {
    await use(async (options: MockArtworksOptions = {}) => {
      const defaultPageSize = options.pageSize ?? 2;
      const totalCount = options.total ?? defaultPageSize * 2;
      const delayMs = options.delayMs ?? 0;

      const makeUser = (id: number) => ({
        id,
        email: `user${id}@example.com`,
        first_name: 'Test',
        last_name: `User ${id}`,
        user_type: 'ARTIST',
        profile: {
          bio: '',
          about: '',
          profile_picture: null,
          cover_photo: null,
          website: '',
          features_photos: [],
          is_following: false,
          isBlocked: false,
        },
      });

      const makeArtwork = (index: number) => ({
        id: `art-${index}`,
        artist_name: `Artist ${index}`,
        category_name: 'Abstract',
        category: {
          id: 1,
          name: 'Abstract',
          image: '',
          slug: 'abstract',
        },
        image: 'https://picsum.photos/seed/art/400/300',
        genre: {
          id: 1,
          image: '',
          name: 'Modern',
          slug: 'modern',
        },
        styles: [],
        title: `Artwork ${index}`,
        description: 'Test artwork',
        original_width: 800,
        original_height: 600,
        hide_price: false,
        visibility: 'PUBLIC',
        price: '1000',
        medium: 'Oil on Canvas',
        dimensions: '30x40 cm',
        year: 2024,
        status: 'AVAILABLE',
        current_owner_display: makeUser(1),
        current_owner: 1,
        current_owner_name: 'Test User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        artist_profile: makeUser(2),
        artwork_styles: [],
        is_liked: false,
      });

      await page.route('**/artworks/artworks/**', async (route) => {
        const url = new URL(route.request().url());
        if (!url.pathname.endsWith('/artworks/artworks/')) {
          return route.fallback();
        }

        const pageParam = Number(url.searchParams.get('page') || '1');
        const pageSizeParam = Number(
          url.searchParams.get('page_size') || String(defaultPageSize)
        );
        const totalPages = Math.ceil(totalCount / pageSizeParam);
        const start = (pageParam - 1) * pageSizeParam;
        const end = Math.min(start + pageSizeParam, totalCount);
        const results = Array.from(
          { length: Math.max(0, end - start) },
          (_, i) => makeArtwork(start + i + 1)
        );

        const next =
          pageParam < totalPages ? `?page=${pageParam + 1}` : null;
        const previous =
          pageParam > 1 ? `?page=${pageParam - 1}` : null;

        if (delayMs > 0) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }

        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            count: totalCount,
            next,
            previous,
            results,
          }),
        });
      });
    });
  },
});

export { test, expect };
