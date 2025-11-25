"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useRolesByIdUser = (id: string) => {
  return useQuery({
    queryKey: ["class", id],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/roles/user/id/${id}`);
        return res.data;
      } catch (error) {
        console.error(error);
      }
    },
  });
};
