import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import userApi from '@/api/userApi';
import queryKeys from '@/utils/queryKeys';

const errorMessage = (error) => error?.response?.data?.message || error?.message || 'User request failed.';

export const useGetUsers = (params = {}) =>
  useQuery({
    queryKey: queryKeys.users.all(params),
    queryFn: () => userApi.getAllUsers(params),
    placeholderData: (previous) => previous,
  });

export const useGetUser = (id) =>
  useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => userApi.getUserById(id),
    enabled: Boolean(id),
  });

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully.');
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => userApi.updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.id) });
      toast.success('User updated successfully.');
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully.');
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
};

export const useUploadProfilePic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }) => userApi.uploadProfilePic(id, formData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.id) });
      toast.success('Profile picture updated.');
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
};

export const useFarmerStats = (id) =>
  useQuery({
    queryKey: queryKeys.users.stats(id),
    queryFn: () => userApi.getFarmerStats(id),
    enabled: Boolean(id),
  });
