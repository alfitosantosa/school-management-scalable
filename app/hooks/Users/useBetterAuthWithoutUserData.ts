"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetBetterAuthWithoutUserData = () => {
  return useQuery({
   queryKey: ["betterauth", "users", "withoutUserData"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/betterauth/users/withoutuserdata");
        return res.data;
      } catch (error) {
        console.error(error);
      }
    },
  });
};