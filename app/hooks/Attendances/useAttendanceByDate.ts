  import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api-client";

export const useAttendanceByDate = ({ fromdate, todate }: { fromdate?: Date; todate?: Date }) => {
  return useQuery({
    queryKey: ["attendances-by-date"],
    queryFn: async () => {
      if (!fromdate || !todate) return [];
      const response = await apiGet("/api/attendance/filterdate", {
        params: {
          fromdate: fromdate.toISOString().split("T")[0],
          todate: todate.toISOString().split("T")[0],
        },
      });
      return response.data;
    },
 enabled: !!fromdate && !!todate, // Hanya fetch jika ada tanggal
  });
};
