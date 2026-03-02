"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api-client";

export const useGetTahfidzRecords = (studentId: string) => {
  return useQuery({
    queryKey: ["tahfidzRecords", studentId],
    queryFn: async () => {
      const response = await apiGet(`/api/tahfidzrecord/${studentId}`);
      return response.data;
    },
  });
};

export const useCreateTahfidzRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await apiPost("/api/tahfidzrecord", data);
      console.log("Create data:", data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tahfidzRecords", data.studentId] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdateTahfidzRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await apiPut(`/api/tahfidzrecord/`, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tahfidzRecords", data.studentId] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useDeleteTahfidzRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await apiDelete(`/api/tahfidzrecord`, {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tahfidzRecords", data.studentId] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useGetTahfidzRecordByStudentId = (studentId: string) => {
  return useQuery({
    queryKey: ["tahfidzRecord", studentId],
    queryFn: async () => {
      const response = await apiGet(`/api/tahfidzrecord/${studentId}`);
      return response.data;
    },
  });
};

export const useGetTahfidzRecordByIdTeacherFromClass = (teacherId: string, classId: string) => {
  return useQuery({
    queryKey: ["tahfidzRecord", teacherId, classId],
    queryFn: async () => {
      const response = await apiGet(`/api/tahfidzrecord/teacher/${teacherId}/class/${classId}`);
      return response.data;
    },
  });
};
