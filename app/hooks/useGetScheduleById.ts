"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetScheduleById = (id: string) => {
  return useQuery({
    queryKey: ["schedules", id],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/schedules/${id}`);
        return res.data;
      } catch (error) {
        console.error(error);
      }
    },
  });
};

export const useGetScheduleByIdTeacher = (id: string) => {
  return useQuery({
    queryKey: ["schedules", id],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/schedules/teacher/${id}`);
        return res.data;
      } catch (error) {
        console.error(error);
      }
    },
  });
};
