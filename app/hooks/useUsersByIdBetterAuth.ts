"use client";

// app/api/users/route.ts

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetUserByIdBetterAuth = (id: string) => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/userdata/betterauth/id/${id}`);
        return res.data;
      } catch (error: any) {
        console.error(error);
      }
    },
  });
};
