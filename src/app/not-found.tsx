import { notFound } from "next/navigation";

// Catch-all for non-localized route requests (triggers 404 handling under [locale])
export default function NotFound() {
  notFound();
}
