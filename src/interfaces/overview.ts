export type OverviewItem = {
    pk: string;
    sk: string;
    inventoryDate: string;
  };
  
  export type OverviewRecord = {
    [date: string]: OverviewItem[];
  };