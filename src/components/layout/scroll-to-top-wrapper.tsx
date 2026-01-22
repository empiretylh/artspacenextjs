import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";

const ScrollToTopWrapper = ({ children }: any) => {
   const { pathname } = useLocation();

   useEffect(() => {
      window.scrollTo(0, 0);
   }, [pathname]);

   return <>{children}</>;
};

export default ScrollToTopWrapper;
