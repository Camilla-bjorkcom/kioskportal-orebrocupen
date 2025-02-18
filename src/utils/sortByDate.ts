const sortByDate = <T extends { inventoryDate?: string }>(items: T[]) => {
  return items.sort((a, b) => {
    const dateA = new Date(a.inventoryDate!);
    const dateB = new Date(b.inventoryDate!);
    return dateA > dateB ? -1 : 1;
  });
};

export const sortByInventoryDate = sortByDate;
