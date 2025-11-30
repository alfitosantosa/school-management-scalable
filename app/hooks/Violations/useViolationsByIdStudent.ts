"use client";

// app/api/violations/student/[id]/route.ts

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetViolationsByIdStudent = (id: string) => {
  return useQuery({
    queryKey: ["violations", id],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/violations/student/${id}`);
        return res.data;
      } catch (error) {
        console.error(error);
      }
    },
  });
};
