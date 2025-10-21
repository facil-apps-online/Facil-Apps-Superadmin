import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export interface User {
  id: string;
  email: string;
  full_name: string;
}

const fetchUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase.from('users').select('id, email, raw_user_meta_data->>full_name as full_name');
  if (error) {
    throw new Error(error.message);
  }
  return data as User[];
};

export const useUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
};
