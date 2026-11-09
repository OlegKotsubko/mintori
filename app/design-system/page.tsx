import type { Metadata } from "next";
import { DSView } from "./DSView";

export const metadata: Metadata = { title: "Design system" };
export default function Page() {
  return <DSView />;
}
