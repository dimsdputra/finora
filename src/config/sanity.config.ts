import { createClient, type SanityClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const sanityReadConfig = {
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  apiVersion: "2025-06-11",
  useCdn: false, // <-- Keep this TRUE for reading data
  token: import.meta.env.VITE_SANITY_TOKEN_API, //
};

export const sanityWriteConfig = {
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  apiVersion: "2025-06-11",
  useCdn: false, // <-- Keep this TRUE for reading data
  token: import.meta.env.VITE_SANITY_TOKEN_API, //
};

export const sanityReadClient: SanityClient = createClient(sanityReadConfig);

const builder = imageUrlBuilder(sanityReadClient);

export function urlFor(source: any) {
  return builder.image(source);
}

export const sanityWriteClient: SanityClient = createClient(sanityWriteConfig);
