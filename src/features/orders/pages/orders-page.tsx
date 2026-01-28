import OrdersContainer from "../components/orders-container";
import { SectionCards } from "../components/section-cards";

const OrdersPage = () => {
  return (
    <div className="flex flex-col">
      <div className="@container/main flex flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight"> Orders </h2>
              <p className="text-muted-foreground">
                Here & apos;s a list of your orders for this month!
              </p>
            </div>
          </div>
          <SectionCards />
          {/* <div className="">
                  <ChartAreaInteractive />
               </div> */}
          <OrdersContainer />
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
