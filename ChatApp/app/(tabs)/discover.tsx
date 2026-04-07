import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import React, { useState } from "react";
import {
    useAcceptFriendRequest,
    useCancelFriendRequest,
    useDiscoverUsers,
    useRejectFriendRequest,
    useSendFriendReq,
} from "@/hooks/useFriendQueries";
import { UserCard } from "@/components/useCard";

const Discover = () => {
    const [search, setSearch] = useState("");
    const { data: users = [], isLoading } = useDiscoverUsers(search);
    const sendReqMutation = useSendFriendReq();
    const acceptReqMutation = useAcceptFriendRequest();
    const rejectReqMutation = useRejectFriendRequest();
    const cancelReqMutation = useCancelFriendRequest();

    const handleSenReq = async (receiverId: string) => {
        sendReqMutation.mutate(receiverId);
    };
    const handleAcpReq = async (requestId: string) => {
        console.log("ACCEPT CLICKED:", requestId);
        acceptReqMutation.mutate(requestId);
    };
    const handleRejReq = async (requestId: string) => {
        rejectReqMutation.mutate(requestId);
    };
    const handleCanReq = async (requestId: string) => {
        cancelReqMutation.mutate(requestId);
    };
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Discover People</Text>
            <TextInput
                style={styles.searchInput}
                placeholder="Search by email or name..."
                placeholderTextColor={"#aaa"}
                value={search}
                onChangeText={setSearch}
            />

            {isLoading && !users.length ? (
                <ActivityIndicator
                    size={"large"}
                    color={"#007aff"}
                    style={{ marginTop: 20 }}
                />
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <UserCard
                            user={item}
                            onSendRequest={handleSenReq}
                            onAcceptRequest={handleAcpReq}
                            onRejectRequest={handleRejReq}
                            onCancelRequest={handleCanReq}
                        />
                    )}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No user Found</Text>
                    }
                    contentContainerStyle={{
                        paddingBottom: 20,
                    }}
                />
            )}
        </View>
    );
};

export default Discover;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#121212",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 16,
        marginTop: 40,
    },
    searchInput: {
        backgroundColor: "#1e1e1e",
        color: "#fff",
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#333",
    },
    emptyText: {
        color: "#aaa",
        textAlign: "center",
        marginTop: 20,
    },
});
