import { useStaticServer } from "@/contexts/StaticServerContext";
import { useNetworkState } from "expo-network";
import React, { useEffect, useState } from "react";
import { Animated, Button, Text, TouchableOpacity, View } from "react-native";

const StaticServerDebugger = () => {
  const { restartServer } = useStaticServer();
  const networkState = useNetworkState();
  const [isExpanded, setIsExpanded] = useState(false);
  const [animatedHeight] = useState(new Animated.Value(0));
  const [expandedHeight, collapsedHeight] = [48, 0];

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isExpanded ? expandedHeight : collapsedHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleExpand}>
        <Text style={{ fontWeight: "bold" }}>Toggle Debugger</Text>
      </TouchableOpacity>
      <Animated.View style={{ height: animatedHeight, overflow: "hidden" }}>
        {isExpanded && (
          <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
            <Text>
              Network State: {networkState.isConnected ? "Online" : "Offline"}
            </Text>
            <Button title="Restart Server" onPress={restartServer} />
          </View>
        )}
      </Animated.View>
    </View>
  );
};

export default StaticServerDebugger;
