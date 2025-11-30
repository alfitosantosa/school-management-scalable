"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useGetAcademicYears = () => {
  return useQuery({
    queryKey: ["academicYears"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/academicyear");
        return res.data;
      } catch (error) {
        console.error(error);
      }
    },
  });
};

export const useCreateAcademicYear = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.post("/api/academicyear", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academicYears"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdateAcademicYear = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.put("/api/academicyear", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academicYears"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useDeleteAcademicYear = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(`/api/academicyear`, { data: { id } });

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academicYears"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
