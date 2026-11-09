import type { Metadata } from "next";
import { CollectionView } from "./CollectionView";

export const metadata: Metadata = { title: "My collection" };

export default function Page() {
  return <CollectionView />;
}
