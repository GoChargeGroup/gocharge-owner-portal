import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';

const useRoleMiddleware = (requiredRole) => {
  const { user } = useGlobalContext();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (!user) {
      
        router.push('/sign-in');
      } else if (user.role !== requiredRole) {
       
        router.push('/');
      }
    }
  }, [isMounted, user, requiredRole, router]);

  return user && user.role === requiredRole;
};

export default useRoleMiddleware;
