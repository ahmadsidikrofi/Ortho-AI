'use client'
import { TextShimmer } from "@/components/ui/text-shimmer";
import Chat from "../components/Chat";
import DarkModeToggle from "../components/DarkModeToggle"

export default function Home() {
  return (
    <main>
      <div>
        <Chat />
      </div>
    </main>
  );
}
