import type { BlogCategory, BlogPost, BlogTag, ListApiResponse, User } from "@/types";

const createMockAuthor = (
   id: number,
   first_name: string,
   last_name: string,
   email: string,
   pic: string
): User => ({
   id,
   email,
   first_name,
   last_name,
   user_type: "ARTIST",
   profile: {
      bio: "Editorial contributor for Myanmar Art Space.",
      about: "Covering contemporary art, cultural heritage, and gallery showcases in Southeast Asia.",
      profile_picture: pic,
      cover_photo: null,
      website: "https://myanmarartspace.com",
      show_email: true,
      features_photos: [],
      is_following: false,
      isBlocked: false,
   },
});

export const MOCK_BLOG_CATEGORIES: BlogCategory[] = [
   {
      id: "cat-1",
      name: "Press Releases",
      slug: "press-releases",
      description: "Official corporate statements, platform launches, and institutional announcements.",
      post_count: 3,
   },
   {
      id: "cat-2",
      name: "Exhibitions & Events",
      slug: "exhibitions-events",
      description: "Coverage of contemporary art showcases, Yangon gallery walks, and global fairs.",
      post_count: 2,
   },
   {
      id: "cat-3",
      name: "Artist Spotlights",
      slug: "artist-spotlights",
      description: "In-depth profiles, studio visits, and exclusive conversations with Myanmar master artists.",
      post_count: 2,
   },
   {
      id: "cat-4",
      name: "Platform Updates",
      slug: "platform-updates",
      description: "New features, collector verification, and e-commerce innovations.",
      post_count: 1,
   },
   {
      id: "cat-5",
      name: "Partnerships",
      slug: "partnerships",
      description: "Collaborations with cultural foundations, international embassies, and museum partners.",
      post_count: 1,
   },
];

export const MOCK_BLOG_TAGS: BlogTag[] = [
   { id: "tag-1", name: "Contemporary Art", slug: "contemporary-art", post_count: 4 },
   { id: "tag-2", name: "Yangon Art Scene", slug: "yangon-art-scene", post_count: 3 },
   { id: "tag-3", name: "Master Artists", slug: "master-artists", post_count: 2 },
   { id: "tag-4", name: "Digital Innovation", slug: "digital-innovation", post_count: 2 },
   { id: "tag-5", name: "Cultural Heritage", slug: "cultural-heritage", post_count: 2 },
   { id: "tag-6", name: "Global Showcase", slug: "global-showcase", post_count: 1 },
];

export const MOCK_BLOG_POSTS: BlogPost[] = [
   {
      id: "post-1",
      title: "Myanmar Art Space Announces Global Platform Launch and Verified Provenance Network",
      slug: "myanmar-art-space-global-platform-launch",
      excerpt:
         "Empowering Myanmar's contemporary artists with direct global collector access, transparent digital provenance, and cross-border art commerce.",
      body: `
<h2>A New Era for Myanmar Contemporary Art</h2>
<p>Today marks a transformative milestone for Southeast Asian visual arts as <strong>Myanmar Art Space</strong> officially opens its doors to international collectors, galleries, and art patrons across the globe.</p>

<p>For decades, Myanmar’s vibrant fine art community has produced visionary painters, sculptors, and multimedia creators whose works capture profound cultural depth, resilient optimism, and remarkable technical mastery. However, international accessibility, logistical infrastructure, and verifiable provenance tracking have remained persistent challenges.</p>

<blockquote>
“Our mission is simple yet foundational: give every Myanmar creator the sovereign digital platform and global reach they deserve, while giving collectors undisputed provenance and direct artist relationships.”
</blockquote>

<h3>Key Platform Features Introduced Today:</h3>
<ul>
   <li><strong>Verified Certificate of Authenticity (CoA)</strong>: Every primary acquisition is directly bound to the artist or representing gallery with cryptographic verification.</li>
   <li><strong>Integrated Multi-Currency Settlement</strong>: Frictionless checkout supporting MMK (Myanmar Kyat) for local patrons and USD with major credit systems for worldwide shipping.</li>
   <li><strong>Curated Gallery Virtual Showcases</strong>: Immersive virtual viewing rooms allowing international curators to explore Yangon and Mandalay exhibitions from anywhere.</li>
</ul>

<h3>Connecting Local Masters with International Collectors</h3>
<p>With an inaugural collection featuring over 150 curated masterworks from acclaimed painters in Yangon, Mandalay, and Shan State, Myanmar Art Space stands as the primary digital bridge between local artistic expression and the international art market.</p>

<p>Galleries and independent artists interested in joining the verified roster can submit their applications through our verified creator portal.</p>
      `,
      language: "en",
      translation_group: "group-1",
      category: MOCK_BLOG_CATEGORIES[0],
      tags: [MOCK_BLOG_TAGS[0], MOCK_BLOG_TAGS[3]],
      cover_asset: {
         id: "asset-1",
         display_url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1400&q=80",
         card_url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
         thumbnail_url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80",
      },
      cover_alt: "Contemporary art gallery showcase and digital exhibition launch",
      is_featured: true,
      status: "PUBLISHED",
      published_at: "2026-08-24T09:00:00Z",
      created_at: "2026-08-24T08:00:00Z",
      updated_at: "2026-08-24T09:00:00Z",
      reading_time_minutes: 4,
      author: createMockAuthor(
         1,
         "Art Space",
         "Media",
         "press@myanmarartspace.com",
         "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
      ),
      translations: [
         {
            id: "post-1-my",
            title: "Myanmar Art Space တရားဝင် မိတ်ဆက်ခြင်းနှင့် နိုင်ငံတကာ အနုပညာဈေးကွက်သို့ ချိတ်ဆက်ခြင်း",
            slug: "myanmar-art-space-global-platform-launch-my",
            language: "my",
         },
      ],
   },
   {
      id: "post-2",
      title: "Yangon Contemporary Art Week 2026: Official Exhibition Schedule & Curatorial Theme",
      slug: "yangon-contemporary-art-week-2026-announcement",
      excerpt:
         "Over 40 leading artists and 12 contemporary galleries unite across Downtown Yangon to present 'Echoes of Continuity'.",
      body: `
<h2>Celebrating Yangon's Enduring Creative Spirit</h2>
<p>Myanmar Art Space is honored to announce our principal partnership with <strong>Yangon Contemporary Art Week 2026</strong>, happening across 12 historic venues and galleries throughout Yangon from September 15 to 22.</p>

<p>Curated around the theme <em>'Echoes of Continuity'</em>, the week-long event highlights the interplay between classical Burmese motifs—such as lacquerware craftsmanship, gold-leaf techniques, and pagoda frescoes—and bold contemporary expressionism.</p>

<h3>Exhibition Highlights</h3>
<ul>
   <li><strong>Opening Gala at The Strand Gallery</strong>: Featuring newly commissioned monumental canvases by emerging Mandalay colorists.</li>
   <li><strong>Panel Discussion: The Future of Southeast Asian Art Collecting</strong>: A hybrid symposium featuring regional gallery directors and digital preservation specialists.</li>
   <li><strong>Live Studio Access</strong>: Open-door studio tours in Sanchaung and Dagon art districts.</li>
</ul>

<p>Digital previews and exclusive collector early-access for all featured exhibition works will be hosted live on Myanmar Art Space starting September 10.</p>
      `,
      language: "en",
      translation_group: "group-2",
      category: MOCK_BLOG_CATEGORIES[1],
      tags: [MOCK_BLOG_TAGS[0], MOCK_BLOG_TAGS[1]],
      cover_asset: {
         id: "asset-2",
         display_url: "https://images.unsplash.com/photo-1578321272176-b7bbc0679a52?auto=format&fit=crop&w=1400&q=80",
         card_url: "https://images.unsplash.com/photo-1578321272176-b7bbc0679a52?auto=format&fit=crop&w=800&q=80",
         thumbnail_url: "https://images.unsplash.com/photo-1578321272176-b7bbc0679a52?auto=format&fit=crop&w=400&q=80",
      },
      cover_alt: "Yangon Art Exhibition with contemporary oil paintings on display",
      is_featured: false,
      status: "PUBLISHED",
      published_at: "2026-08-20T14:30:00Z",
      created_at: "2026-08-20T12:00:00Z",
      updated_at: "2026-08-20T14:30:00Z",
      reading_time_minutes: 3,
      author: createMockAuthor(
         2,
         "Kyaw",
         "Zin Oo",
         "curator@myanmarartspace.com",
         "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
      ),
      translations: [],
   },
   {
      id: "post-3",
      title: "Master in Profile: Min Wae Aung on Light, Movement, and Monastic Serenity",
      slug: "master-in-profile-min-wae-aung",
      excerpt:
         "An intimate studio conversation exploring the legendary painter's iconic processions, warm acrylic gradients, and international acclaim.",
      body: `
<h2>The Symphony of Stride and Solitude</h2>
<p>Few artists in Southeast Asia have articulated spiritual calm with such visceral precision as <strong>Min Wae Aung</strong>. His iconic depictions of monks and nuns strolling under the tropical sun—their saffron, crimson, and blush pink robes billowing against stark gold backdrops—are celebrated in museums from London to Singapore.</p>

<p>In this exclusive profile, we sat down with the master at his Yangon studio to discuss his early watercolours, the evolution of his minimalist compositions, and his advice for young Myanmar artists today.</p>

<blockquote>
“When I paint the back of a monk, I am not painting an individual. I am painting the journey itself—the universal pilgrimage toward inner peace.”
</blockquote>

<h3>Formative Years and the Pursuit of Purity</h3>
<p>Graduating from the State School of Fine Arts in Yangon in the 1970s, Min Wae Aung initially worked extensively with landscape oils and book illustrations. His breakthrough came when he stripped away all superfluous background elements, choosing instead to focus entirely on human posture, flowing robes, and luminous warmth.</p>
      `,
      language: "en",
      translation_group: "group-3",
      category: MOCK_BLOG_CATEGORIES[2],
      tags: [MOCK_BLOG_TAGS[0], MOCK_BLOG_TAGS[2], MOCK_BLOG_TAGS[4]],
      cover_asset: {
         id: "asset-3",
         display_url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1400&q=80",
         card_url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
         thumbnail_url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80",
      },
      cover_alt: "Master artist painting in studio with radiant color palette",
      is_featured: false,
      status: "PUBLISHED",
      published_at: "2026-08-18T10:00:00Z",
      created_at: "2026-08-18T09:00:00Z",
      updated_at: "2026-08-18T10:00:00Z",
      reading_time_minutes: 5,
      author: createMockAuthor(
         1,
         "Art Space",
         "Media",
         "press@myanmarartspace.com",
         "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
      ),
      translations: [],
   },
   {
      id: "post-4",
      title: "Strategic Partnership with Southeast Asian Heritage Trust for Cultural Preservation",
      slug: "partnership-southeast-asian-heritage-trust",
      excerpt:
         "Collaborative initiative to archive, digitize, and document over 500 historic modern Myanmar artworks from 1920–1980.",
      body: `
<h2>Preserving Modern Myanmar Art History for Future Generations</h2>
<p>Myanmar Art Space is proud to announce a multi-year collaborative partnership with the <strong>Southeast Asian Heritage Trust (SEAHT)</strong>.</p>

<p>Through this initiative, our team is providing high-resolution archival scanning, oral history documentation, and digital catalogue raisonné infrastructure for significant modern works dating back to the early 20th century.</p>

<h3>Three Pillars of the Partnership:</h3>
<ol>
   <li><strong>High-Resolution Digital Archiving</strong>: Ultra-high fidelity colour-accurate digitization of fragile oil and watercolour pieces.</li>
   <li><strong>Educational Open-Access Repository</strong>: Making high-res research materials freely accessible to art historians and students worldwide.</li>
   <li><strong>Conservation Support Grants</strong>: Direct micro-grants for physical restoration of aging canvases in private collections.</li>
</ol>
      `,
      language: "en",
      translation_group: "group-4",
      category: MOCK_BLOG_CATEGORIES[4],
      tags: [MOCK_BLOG_TAGS[4], MOCK_BLOG_TAGS[5]],
      cover_asset: {
         id: "asset-4",
         display_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1400&q=80",
         card_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
         thumbnail_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80",
      },
      cover_alt: "Art archives, historic documents and gallery catalog preservation",
      is_featured: false,
      status: "PUBLISHED",
      published_at: "2026-08-14T11:00:00Z",
      created_at: "2026-08-14T10:00:00Z",
      updated_at: "2026-08-14T11:00:00Z",
      reading_time_minutes: 3,
      author: createMockAuthor(
         1,
         "Art Space",
         "Media",
         "press@myanmarartspace.com",
         "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
      ),
      translations: [],
   },
];

/**
 * Filter mock posts by parameters for local development / fallback
 */
export function filterMockBlogPosts(params?: {
   category?: string;
   tag?: string;
   language?: string;
   search?: string;
   featured?: boolean | string;
   ordering?: string;
   page?: number;
   limit?: number;
}): ListApiResponse<BlogPost> {
   let list = [...MOCK_BLOG_POSTS];

   if (params?.featured !== undefined) {
      const isFeatured =
         typeof params.featured === "string"
            ? params.featured === "true"
            : Boolean(params.featured);
      list = list.filter((p) => Boolean(p.is_featured) === isFeatured);
   }

   if (params?.category) {
      list = list.filter((p) => p.category?.slug === params.category);
   }

   if (params?.tag) {
      list = list.filter((p) => p.tags?.some((t) => t.slug === params.tag));
   }

   if (params?.language) {
      list = list.filter((p) => p.language === params.language);
   }

   if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
         (p) =>
            p.title.toLowerCase().includes(q) ||
            p.excerpt?.toLowerCase().includes(q) ||
            p.body?.toLowerCase().includes(q)
      );
   }

   if (params?.ordering) {
      if (params.ordering === "-published_at") {
         list.sort(
            (a, b) =>
               new Date(b.published_at || "").getTime() -
               new Date(a.published_at || "").getTime()
         );
      } else if (params.ordering === "published_at") {
         list.sort(
            (a, b) =>
               new Date(a.published_at || "").getTime() -
               new Date(b.published_at || "").getTime()
         );
      } else if (params.ordering === "title") {
         list.sort((a, b) => a.title.localeCompare(b.title));
      } else if (params.ordering === "-title") {
         list.sort((a, b) => b.title.localeCompare(a.title));
      }
   }

   const page = params?.page || 1;
   const limit = params?.limit || 12;
   const total = list.length;
   const totalPages = Math.ceil(total / limit) || 1;
   const startIndex = (page - 1) * limit;
   const endIndex = startIndex + limit;
   const results = list.slice(startIndex, endIndex);

   return {
      count: total,
      total_pages: totalPages,
      current_page: page,
      next: page < totalPages ? `?page=${page + 1}` : null,
      previous: page > 1 ? `?page=${page - 1}` : null,
      results,
   };
}

export function findMockBlogPost(slug: string): BlogPost | undefined {
   return MOCK_BLOG_POSTS.find((p) => p.slug === slug);
}
