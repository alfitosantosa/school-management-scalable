"use client";

// app/api/users/route.ts

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api-client";

export const useGetUserByIdBetterAuth = (id: string) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      const response = await apiGet(`/api/userdata/betterauth/id/${id}`);
      return response?.data || null;
    },
    enabled: !!id,
  });
};

export const useIsAdmin = (id: string) => {
  const { data, isLoading } = useGetUserByIdBetterAuth(id);
  return {
    isAdmin: data?.role?.name === "Admin",
    isLoading,
  };
};

export const useIsTeacher = (id: string) => {
  const { data, isLoading } = useGetUserByIdBetterAuth(id);
  if (data?.role?.name === "Teacher" || "Admin") {
    return {
      isTeacher: true,
      isLoading,
    };
  } else {
    return {
      isTeacher: false,
      isLoading,
    };
  }
};
