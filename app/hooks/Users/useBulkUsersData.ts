"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useBulkCreateUserData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.post("/api/userdata/bulk", data);
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
