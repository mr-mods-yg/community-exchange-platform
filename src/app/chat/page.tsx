import Chat from "@/components/custom/chat";
import { Suspense } from "react";

export default function ChatPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <Chat />
    </Suspense>
  );
}
