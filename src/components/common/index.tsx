export const SectionTitle = ({ children, className = "" }: any) => (
   <h2
      className={`text-2xl font-semibold font-display tracking-tight text-foreground ${className}`}
   >
      {children}
   </h2>
);

export const SectionSubtitle = ({ children, className = "" }: any) => (
   <p
      className={`text-lg font-display text-muted-foreground mt-2 ${className}`}
   >
      {children}
   </p>
);
