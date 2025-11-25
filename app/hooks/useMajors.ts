import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useGetMajors = () => {
  return useQuery({
    queryKey: ["majors"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/major");
        return res.data;
      } catch (error) {
        console.error(error);
      }
    },
  });
};

export const useCreateMajor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.post("/api/major", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["majors"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdateMajor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.put("/api/major", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["majors"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useDeleteMajor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(`/api/major/`, { data: { id } });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["majors"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
