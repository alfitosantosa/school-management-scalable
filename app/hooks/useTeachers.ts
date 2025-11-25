"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetTeachers = () => {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/teachers");
        return res.data;
      } catch (error) {
        console.error(error);
      }
    },
  });
};

export const useCreateTeacher = () => {
  return async (data: any) => {
    try {
      const res = await axios.post("/api/teachers", data);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };
};

export const useUpdateTeacher = () => {
  return async (data: any) => {
    try {
      const res = await axios.put("/api/teachers", data);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };
};

export const useDeleteTeacher = () => {
  return async (id: string) => {
    try {
      const res = await axios.delete(`/api/teachers`, { data: { id } });
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };
};
