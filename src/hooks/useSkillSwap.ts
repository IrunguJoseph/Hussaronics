import { useQuery, useMutation, useQueryClient } from 'react-query';
import api, { UserProfile, MatchedUser } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export function useCreateUser() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation(
    (userData: UserProfile) => api.createUser(userData),
    {
      onSuccess: () => {
        toast({
          title: 'Profile Created',
          description: 'Your profile has been created successfully!',
        });
        queryClient.invalidateQueries('matches');
      },
      onError: (error: any) => {
        toast({
          title: 'Error',
          description: error.message || 'Failed to create profile',
          variant: 'destructive',
        });
      },
    }
  );
}

export function useMatches(userId: number) {
  const { toast } = useToast();

  return useQuery<MatchedUser[]>(
    ['matches', userId],
    () => api.findMatches(userId),
    {
      onError: (error: any) => {
        toast({
          title: 'Error',
          description: error.message || 'Failed to fetch matches',
          variant: 'destructive',
        });
      },
      enabled: !!userId,
    }
  );
}