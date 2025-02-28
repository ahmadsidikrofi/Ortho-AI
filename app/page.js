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
      {/* <div className="px-5 fixed bottom-12">
        <DarkModeToggle />
      </div> */}
    </main>
  );
}
