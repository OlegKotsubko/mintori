import type { Metadata } from "next";
import { Checkout } from "./Checkout";

export const metadata: Metadata = { title: "Cart & checkout" };
export default function Page() {
  return <Checkout />;
}
