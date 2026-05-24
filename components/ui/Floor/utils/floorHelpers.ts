export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    paid: "#22c55e",
    pending: "#f59e0b",
  };
  return colors[status] || "#64748b";
};

export const getStatusBgColor = (status: string): string => {
  const colors: Record<string, string> = {
    paid: "#14532d33",
    pending: "#78350f33",
  };
  return colors[status] || "#1e293b";
};

export const getProgressColor = (status: string): string => {
  return status === "paid" ? "#22c55e" : "#f43f5e";
};

export const getPendingColor = (pending: number): string => {
  return pending > 0 ? "#f59e0b" : "#22c55e";
};

export const calculateProgress = (collected: number, total: number): number => {
  return total > 0 ? (collected / total) * 100 : 0;
};
