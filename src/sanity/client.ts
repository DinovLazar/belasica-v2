import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, useCdn } from "./env";

// Read-only client for the public site. Published content only; no API token
// (public dataset). Used by server components to query Sanity.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  perspective: "published",
});
