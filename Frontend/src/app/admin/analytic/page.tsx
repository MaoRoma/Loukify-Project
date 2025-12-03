import React from "react";
import { StateAnalytic } from "@/components/admin/analytic/StateAnalytic";
import { SaleOverview } from "@/components/admin/analytic/ChartAnalytic";
import { OrderVolume } from "@/components/admin/analytic/Barchart";

const AnalyticsPage = () => {
  return (
    <>
      <StateAnalytic />
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <SaleOverview />
          </div>
          <div className="space-y-4">
            <OrderVolume />
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalyticsPage;
