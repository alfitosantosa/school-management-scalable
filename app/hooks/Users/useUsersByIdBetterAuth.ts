"use client";

// app/api/users/route.ts

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetUserByIdBetterAuth = (id: string) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      const response = await axios.get(`/api/userdata/betterauth/id/${id}`);
      return response?.data || null;
    },
    enabled: !!id,
  });
};
