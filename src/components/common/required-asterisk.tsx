const RequiredAsterisk = ({ className }: { className?: string }) => {
   return (
      <span className={className} title="This field is required!.">
         *
      </span>
   );
};

export default RequiredAsterisk;
