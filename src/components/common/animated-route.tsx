import { AnimatePresence, motion } from "framer-motion";
import { Outlet, useLocation } from "react-router";

export default function AnimatedRoutes() {
   const location = useLocation();

   return (
      <AnimatePresence mode="wait">
         <motion.div
            key={location.pathname} // important: key triggers animation on route change
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
         >
            <Outlet />
         </motion.div>
      </AnimatePresence>
   );
}
