import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { friendService } from "../services/friend.service";

export const USER_KEYS = {
    all: ["users"] as const,
    discover: (search: string) => ["users", "discover", search] as const,
    discoverAll: ["users", "discover"] as const,
    friends: () => ["users", "friends"] as const,
};

// 🔍 Discover
export function useDiscoverUsers(search: string) {
    return useQuery({
        queryKey: USER_KEYS.discover(search),
        queryFn: () => friendService.discoverUsers(search),
    });
}

// 📤 Send Request
export function useSendFriendReq() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (receiverId: string) =>
            friendService.sendFriendReq(receiverId),

        onMutate: async (receiverId) => {
            await queryClient.cancelQueries({
                queryKey: USER_KEYS.discoverAll,
            });

            const previousUsers = queryClient.getQueriesData({
                queryKey: USER_KEYS.discoverAll,
            });

            queryClient.setQueriesData(
                { queryKey: USER_KEYS.discoverAll },
                (old: any) => {
                    if (!old) return old;

                    return old.map((user: any) =>
                        user.id === receiverId
                            ? { ...user, relationship: "REQUEST_SENT" }
                            : user,
                    );
                },
            );

            return { previousUsers };
        },

        onError: (_, __, context) => {
            context?.previousUsers?.forEach(([key, data]) => {
                queryClient.setQueryData(key, data);
            });
        },

        onSuccess: (data, receiverId) => {
            queryClient.setQueriesData(
                { queryKey: USER_KEYS.discoverAll },
                (old: any) => {
                    if (!old) return old;

                    return old.map((user: any) =>
                        user.id === receiverId
                            ? {
                                  ...user,
                                  relationship: "REQUEST_SENT",
                                  friendRequestId:
                                      data?.id ??
                                      data?.friendRequestId ??
                                      data?.requestId ??
                                      null,
                              }
                            : user,
                    );
                },
            );
        },

        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: USER_KEYS.discoverAll,
            });
        },
    });
}

// 👥 Friends
export function useFriends() {
    return useQuery({
        queryKey: USER_KEYS.friends(),
        queryFn: () => friendService.getFriends(),
        staleTime: 1000 * 60 * 5,
    });
}

// ✅ Accept
export function useAcceptFriendRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (requestId: string) =>
            friendService.acceptFriendRequest(requestId),

        onMutate: async (requestId) => {
            await queryClient.cancelQueries({
                queryKey: USER_KEYS.discoverAll,
            });

            const previousUsers = queryClient.getQueriesData({
                queryKey: USER_KEYS.discoverAll,
            });

            queryClient.setQueriesData(
                { queryKey: USER_KEYS.discoverAll },
                (old: any) => {
                    if (!old) return old;

                    return old.map((user: any) =>
                        user.friendRequestId === requestId
                            ? { ...user, relationship: "FRIEND" }
                            : user,
                    );
                },
            );

            return { previousUsers };
        },

        onError: (_, __, context) => {
            context?.previousUsers?.forEach(([key, data]) => {
                queryClient.setQueryData(key, data);
            });
        },

        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: USER_KEYS.discoverAll,
            });
        },
    });
}

// ❌ Reject
export function useRejectFriendRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (requestId: string) =>
            friendService.rejectFriendRequest(requestId),

        onMutate: async (requestId) => {
            await queryClient.cancelQueries({
                queryKey: USER_KEYS.discoverAll,
            });

            const previousUsers = queryClient.getQueriesData({
                queryKey: USER_KEYS.discoverAll,
            });

            queryClient.setQueriesData(
                { queryKey: USER_KEYS.discoverAll },
                (old: any) => {
                    if (!old) return old;

                    return old.map((user: any) =>
                        user.friendRequestId === requestId
                            ? {
                                  ...user,
                                  relationship: "NONE",
                                  friendRequestId: null,
                              }
                            : user,
                    );
                },
            );

            return { previousUsers };
        },

        onError: (_, __, context) => {
            context?.previousUsers?.forEach(([key, data]) => {
                queryClient.setQueryData(key, data);
            });
        },

        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: USER_KEYS.discoverAll,
            });
        },
    });
}

// 🚫 Cancel
export function useCancelFriendRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (requestId: string) =>
            friendService.cancelFriendRequest(requestId),

        onMutate: async (requestId) => {
            await queryClient.cancelQueries({
                queryKey: USER_KEYS.discoverAll,
            });

            const previousUsers = queryClient.getQueriesData({
                queryKey: USER_KEYS.discoverAll,
            });

            queryClient.setQueriesData(
                { queryKey: USER_KEYS.discoverAll },
                (old: any) => {
                    if (!old) return old;

                    return old.map((user: any) =>
                        user.friendRequestId === requestId
                            ? {
                                  ...user,
                                  relationship: "NONE",
                                  friendRequestId: null,
                              }
                            : user,
                    );
                },
            );

            return { previousUsers };
        },

        onError: (_, __, context) => {
            context?.previousUsers?.forEach(([key, data]) => {
                queryClient.setQueryData(key, data);
            });
        },

        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: USER_KEYS.discoverAll,
            });
        },
    });
}
