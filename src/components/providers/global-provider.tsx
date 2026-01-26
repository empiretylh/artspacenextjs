import ComingSoonModal from "@/features/coming-soon/components/coming-soon-modal";

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <ComingSoonModal />
      {children}
    </div>
  );
};

export default GlobalProvider;
