export type Floor = {
  id: number;
  name: string;
  status: string;
  totalBilled: number;
  totalPaid: number;
  remaining: number;
};

export type FloorMenuAction = "view" | "edit" | "delete" | "setting";
