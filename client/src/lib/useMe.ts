import { trpc } from "./trpc";

export function useMe() {
  const query = trpc.auth.me.useQuery(undefined, {
    retry: false,
    // 401 when logged out is expected, not an error to surface to the user
    throwOnError: false,
  });
  return {
    user: query.data,
    isLoading: query.isLoading,
    isLoggedIn: !!query.data,
    refetch: query.refetch,
  };
}
