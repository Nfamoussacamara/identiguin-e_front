import { useQuery } from '@tanstack/react-query';
import { getMyVerificationHistory } from '@/api/verification';

export const useVerificationHistory = () => {
  return useQuery({
    queryKey: ['verification-history'],
    queryFn: getMyVerificationHistory,
    refetchOnWindowFocus: false,
  });
};
