import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { friendService } from "@/services/friend.service";

export const USER_KEYS = {
    all: ["users"] as const,
    discover: (search: string) =>
        [...USER_KEYS.all, "discover", search] as const,
    friends: () => [...USER_KEYS.all, "friends"] as const,
};

export function useDiscoverUsers(search: string) {
    return useQuery({
        queryKey: USER_KEYS.discover(search),
        queryFn: () => friendService.discoverUsers(search),
        staleTime: 1000 * 60 * 5,
    });
}

export function useSendFriendReq() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (receiverId: string) =>
            friendService.sendFriendReq(receiverId),

        onMutate: async (receiverId) => {
            await queryClient.cancelQueries({ queryKey: USER_KEYS.all });

            const previousUsers = queryClient.getQueryData<any[]>(
                USER_KEYS.discover(""),
            );

            if (previousUsers) {
                queryClient.setQueriesData(
                    { queryKey: USER_KEYS.all },
                    (old: any[]) => {
                        if (!old) return [];
                        return old.map((user) =>
                            user.id === receiverId
                                ? { ...user, relationship: "REQUEST_SENT" }
                                : user,
                        );
                    },
                );
            }
            return { previousUsers };
        },
        onError: (err, newTodo, context) => {
            if (context?.previousUsers) {
                queryClient.setQueriesData(
                    { queryKey: USER_KEYS.all },
                    context.previousUsers,
                );
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
        },
    });
}

export function useFriend() {
    return useQuery({
        queryKey: USER_KEYS.friends(),
        queryFn: () => friendService.getFriends(),
        staleTime: 1000 * 60 * 5,
    });
}
