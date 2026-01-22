import { ChartAreaInteractive } from "../components/chart-area-interactive";
import { DataTable } from "../components/data-table";
import { SectionCards } from "../components/section-cards";

import data from "../data.json";

const OrdersPage = () => {
   return (
      <div className="flex flex-col">
         <div className="@container/main flex flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
               <SectionCards />
               {/* <div className="">
                  <ChartAreaInteractive />
               </div> */}
               <DataTable data={data} />
            </div>
         </div>
      </div>
   );
};

export default OrdersPage;
