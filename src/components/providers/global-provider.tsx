import ComingSoonModal from "@/features/coming-soon/components/coming-soon-modal";
import { OfflineOverlay } from "@/features/network/components/offline-overlay";
import { NavigationHistoryTracker } from "@/hooks/use-safe-back";

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <NavigationHistoryTracker />
      <ComingSoonModal />
      <OfflineOverlay />
      {children}
    </div>
  );
};

export default GlobalProvider;

