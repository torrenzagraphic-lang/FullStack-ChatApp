import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    TextInput,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [secureText, setSecureText] = useState(true);

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: Colors.background,
            }}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: "center",
                        padding: 24,
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={{ alignItems: "center", marginBottom: 48 }}>
                        <View
                            style={{
                                width: 72,
                                height: 72,
                                borderRadius: 20,
                                backgroundColor: Colors.primary,
                                justifyContent: "center",
                                alignItems: "center",
                                marginBottom: 16,
                            }}
                        >
                            <Ionicons name="chatbubbles" size={36} color="#fff" />
                        </View>

                        <Text
                            style={{
                                color: Colors.textPrimary,
                                fontSize: 28,
                                fontWeight: 700,
                            }}
                        >
                            Welcome Back
                        </Text>

                        <Text
                            style={{
                                color: Colors.textSecondary,
                                fontSize: 15,
                                marginTop: 6,
                            }}
                        >
                            Sign in to continue chatting
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignIn;

const styles = StyleSheet.create({});
