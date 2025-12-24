// // hooks/useAutoSave.ts
// import { useEffect, useRef, useCallback } from "react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";
// import axiosInstance from "@/lib/axios";

// interface AutoSaveOptions {
//   delay?: number;
//   onSuccess?: (data?: any) => void;
//   onError?: (error: any) => void;
//   showToast?: boolean;
// }

// /**
//  * Auto-save hook for Module
//  * Creates new module if no backendId, updates if exists
//  */
// export function useAutoSaveModule(
//   backendId: string | null | undefined,
//   courseId: string,
//   options: AutoSaveOptions = {}
// ) {
//   const { delay = 1000, onSuccess, onError, showToast = false } = options;
//   const queryClient = useQueryClient();
//   const timeoutRef = useRef<NodeJS.Timeout>();
//   const pendingDataRef = useRef<any>(null);

//   const createMutation = useMutation({
//     mutationFn: async (data: any) => {
//       const res = await axiosInstance.post(`/courses/${courseId}/modules`, data);
//       return res.data;
//     },
//     onSuccess: (newModule) => {
//       queryClient.invalidateQueries({ queryKey: ["modules", courseId] });
//       if (showToast) toast.success("Module created");
//       onSuccess?.(newModule);
//     },
//     onError: (error: any) => {
//       toast.error(error.response?.data?.message || "Failed to create module");
//       onError?.(error);
//     },
//   });

//   const updateMutation = useMutation({
//     mutationFn: async (data: any) => {
//       const { backendId: id, ...updateData } = data;
//       const res = await axiosInstance.patch(`/modules/${id}`, updateData);
//       return res.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["modules", courseId] });
//       if (showToast) toast.success("Module saved");
//       onSuccess?.();
//     },
//     onError: (error: any) => {
//       toast.error(error.response?.data?.message || "Failed to save module");
//       onError?.(error);
//     },
//   });

//   const save = useCallback(
//     (data: any) => {
//       pendingDataRef.current = data;

//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }

//       timeoutRef.current = setTimeout(() => {
//         if (!backendId) {
//           createMutation.mutate(pendingDataRef.current);
//         } else {
//           updateMutation.mutate({ ...pendingDataRef.current, backendId });
//         }
//       }, delay);
//     },
//     [backendId, delay, createMutation, updateMutation]
//   );

//   const saveImmediate = useCallback(
//     (data: any) => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }

//       if (!backendId) {
//         createMutation.mutate(data);
//       } else {
//         updateMutation.mutate({ ...data, backendId });
//       }
//     },
//     [backendId, createMutation, updateMutation]
//   );

//   useEffect(() => {
//     return () => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }
//     };
//   }, []);

//   return {
//     save,
//     saveImmediate,
//     isSaving: createMutation.isPending || updateMutation.isPending,
//     isError: createMutation.isError || updateMutation.isError,
//     createdData: createMutation.data,
//   };
// }

// /**
//  * Auto-save hook for Lesson
//  * Creates new lesson if no backendId, updates if exists
//  */
// export function useAutoSaveLesson(
//   backendId: string | null | undefined,
//   moduleId: string,
//   options: AutoSaveOptions = {}
// ) {
//   const { delay = 1000, onSuccess, onError, showToast = false } = options;
//   const queryClient = useQueryClient();
//   const timeoutRef = useRef<NodeJS.Timeout>();
//   const pendingDataRef = useRef<any>(null);

//   const createMutation = useMutation({
//     mutationFn: async (data: any) => {
//       const formData = new FormData();

//       // Append all fields
//       Object.keys(data).forEach((key) => {
//         if (data[key] !== null && data[key] !== undefined) {
//           if (key === "attachments" && Array.isArray(data[key])) {
//             data[key].forEach((file: File) => {
//               formData.append("attachments", file);
//             });
//           } else if (key === "video" && data[key] instanceof File) {
//             formData.append("video", data[key]);
//           } else if (typeof data[key] === "object") {
//             formData.append(key, JSON.stringify(data[key]));
//           } else {
//             formData.append(key, data[key]);
//           }
//         }
//       });

//       const res = await axiosInstance.post(
//         `/modules/${moduleId}/lessons`,
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );
//       return res.data;
//     },
//     onSuccess: (newLesson) => {
//       queryClient.invalidateQueries({ queryKey: ["lessons", moduleId] });
//       if (showToast) toast.success("Lesson created");
//       onSuccess?.(newLesson);
//     },
//     onError: (error: any) => {
//       toast.error(error.response?.data?.message || "Failed to create lesson");
//       onError?.(error);
//     },
//   });

//   const updateMutation = useMutation({
//     mutationFn: async (data: any) => {
//       const { backendId: id, ...updateData } = data;

//       const formData = new FormData();
//       Object.keys(updateData).forEach((key) => {
//         if (updateData[key] !== null && updateData[key] !== undefined) {
//           if (key === "attachments" && Array.isArray(updateData[key])) {
//             updateData[key].forEach((file: File) => {
//               formData.append("attachments", file);
//             });
//           } else if (key === "video" && updateData[key] instanceof File) {
//             formData.append("video", updateData[key]);
//           } else if (typeof updateData[key] === "object") {
//             formData.append(key, JSON.stringify(updateData[key]));
//           } else {
//             formData.append(key, updateData[key]);
//           }
//         }
//       });

//       const res = await axiosInstance.patch(`/lessons/${id}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       return res.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["lessons", moduleId] });
//       if (showToast) toast.success("Lesson saved");
//       onSuccess?.();
//     },
//     onError: (error: any) => {
//       toast.error(error.response?.data?.message || "Failed to save lesson");
//       onError?.(error);
//     },
//   });

//   const save = useCallback(
//     (data: any) => {
//       pendingDataRef.current = data;

//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }

//       timeoutRef.current = setTimeout(() => {
//         if (!backendId) {
//           createMutation.mutate(pendingDataRef.current);
//         } else {
//           updateMutation.mutate({ ...pendingDataRef.current, backendId });
//         }
//       }, delay);
//     },
//     [backendId, delay, createMutation, updateMutation]
//   );

//   const saveImmediate = useCallback(
//     (data: any) => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }

//       if (!backendId) {
//         createMutation.mutate(data);
//       } else {
//         updateMutation.mutate({ ...data, backendId });
//       }
//     },
//     [backendId, createMutation, updateMutation]
//   );

//   useEffect(() => {
//     return () => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }
//     };
//   }, []);

//   return {
//     save,
//     saveImmediate,
//     isSaving: createMutation.isPending || updateMutation.isPending,
//     isError: createMutation.isError || updateMutation.isError,
//     createdData: createMutation.data,
//   };
// }
