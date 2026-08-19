import ComingSoonModal from "@/features/coming-soon/components/coming-soon-modal";
import { NavigationHistoryTracker } from "@/hooks/use-safe-back";

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <NavigationHistoryTracker />
      <ComingSoonModal />
      {children}
    </div>
  );
};

export default GlobalProvider;

