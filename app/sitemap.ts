import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://yunfei07.github.io",
      lastModified: new Date(),
    },
    {
      url: "https://yunfei07.github.io/letters",
      lastModified: new Date(),
    },
    {
      url: "https://yunfei07.github.io/stack",
      lastModified: new Date(),
    },
  ];
}
