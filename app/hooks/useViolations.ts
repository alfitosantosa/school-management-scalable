import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useGetViolations = () => {
  return useQuery({
    queryKey: ["violations"],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/violations");
        return response.data;
      } catch (error) {
        console.error(error);
      }
    },
  });
};

export const useCreateViolation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post("/api/violations", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["violations"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdateViolation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.put("/api/violations", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["violations"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useDeleteViolation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete("/api/violations", { data: { id } });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["violations"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
