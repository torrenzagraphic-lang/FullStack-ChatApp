import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useAuth } from "@/contexts/auth-contexts";

const HomeScreen = () => {
    const { signOut, user } = useAuth(); // 👈 user le

    return (
        <View style={{ padding: 20 }}>
            <Pressable onPress={() => signOut()}>
                <Text>Sign out</Text>
            </Pressable>

            {/* 👇 Username show */}
            <Text style={{ marginTop: 20, fontSize: 18 }}>
                Username: {user?.name || user?.email || "No user"}
            </Text>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    btn: {
        backgroundColor: "black",
        borderRadius: 20,
        padding: 10,
    },
    btnt: {
        color: "white",
    },
});
