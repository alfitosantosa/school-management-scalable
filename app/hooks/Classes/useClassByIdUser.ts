"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useClassByIdUser = (id: string) => {
  return useQuery({
    queryKey: ["class", id],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/class/user/${id}`);
        return res.data;
      } catch (error) {
        console.error(error);
      }
    },
    enabled: !!id,
  });
};
