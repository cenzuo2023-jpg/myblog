export const craftConfig = {
  apiUrl: import.meta.env.CRAFT_API_URL,
  collectionId: import.meta.env.CRAFT_COLLECTION_ID,
};

// Map logical fields to actual Craft API field keys
export const craftFields = {
  title: "title",
  slug: "Slug", // Will be synthesized or mapped if exists
  summary: "Summary",
  publishDate: "_2", // Based on our API inspection: 发布日期
  tags: "_3", // Based on our API inspection: 标签
  published: "Published",
  featured: "Featured",
  coverImage: "CoverImage",
};
