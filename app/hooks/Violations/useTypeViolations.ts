import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useGetTypeViolations = () => {
  return useQuery({
    queryKey: ["typeViolations"],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/typeviolations");
        return response.data;
      } catch (error) {
        console.error(error);
      }
    },
  });
};

export const useCreateTypeViolation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post("/api/typeviolations", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["typeViolations"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdateTypeViolation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.put("/api/typeviolations", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["typeViolations"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useDeleteTypeViolation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete("/api/typeviolations", { data: { id } });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["typeViolations"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
