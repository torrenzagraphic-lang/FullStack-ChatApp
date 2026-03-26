import { Colors } from "@/constants/colors";
import { Tabs } from "expo-router";


export default function TabsLayout(){
    return(
        <Tabs
            screenOptions={{
                tabBarActiveTintColor:Colors.primary,
                tabBarInactiveBackgroundColor:Colors.textMuted,
                tabBarStyle:{
                    backgroundColor:Colors.surface,
                    borderTopColor:Colors.border,
                    borderTopWidth:0.5,
                }
            }}
            
        >
            <Tabs.Screen name="index"/>
        </Tabs>
    )
}