import type { Metadata } from "next";
import { GradingStory } from "./GradingStory";

export const metadata: Metadata = {
  title: "From card to slab: how grading turns a card into money",
  description:
    "Follow one card from binder to sealed slab: what graders check, the difference between a 10 and a 9.5, how the slab is sealed and verified, and what sets the price.",
};

export default function Page() {
  return <GradingStory />;
}
