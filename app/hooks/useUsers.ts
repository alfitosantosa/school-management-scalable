// app/api/users/route.ts

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/userdata");
        return res.data;
      } catch (error) {
        console.error(error);
      }
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.post("/api/userdata", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.put("/api/userdata", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(`/api/userdata/`, { data: { id } });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/userdata/id/${id}`);
        return res.data;
      } catch (error) {
        console.error(error);
      }
    },
    enabled: !!id, // Only run query if id exists
  });
};
