import { StatusBar } from "@/components/ui/StatusBar";
import { BottomNav } from "@/components/app/BottomNav";
import { HomeContent } from "@/components/app/HomeContent";
import { TrackingToast } from "@/components/app/TrackingToast";

export default function HomePage() {
  return (
    <div className="relative flex h-full flex-col bg-offwhite">
      <StatusBar />
      <TrackingToast />
      <HomeContent />
      <BottomNav />
    </div>
  );
}
