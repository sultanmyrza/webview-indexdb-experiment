import { useStaticServer } from "@/contexts/StaticServerContext";
import React, { useEffect, useRef } from "react";
import { Button, ScrollView, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ThemedText } from "./ThemedText";

const StaticServerDebugger = () => {
  const { restartServer, serverLogs, clearServerLogs } = useStaticServer();

  const scrollViewRef = useRef<ScrollView | null>(null);

  const open = useSharedValue(false);
  const height = useDerivedValue(() =>
    withTiming(open.value ? 200 : 0, { duration: 500 })
  );
  const animatedStyle = useAnimatedStyle(() => ({
    maxHeight: height.value,
  }));

  const toggleExpand = () => {
    open.value = !open.value;
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [serverLogs.length]);

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Debugger" onPress={toggleExpand}></Button>
      </View>
      <Animated.View style={[styles.animatedView, animatedStyle]}>
        <ScrollView ref={scrollViewRef} style={styles.logs}>
          {serverLogs.map((log, index) => (
            <ThemedText key={index}>{log}</ThemedText>
          ))}
        </ScrollView>
        <View style={styles.staticServerButtons}>
          <Button title="Restart Server" onPress={restartServer} />
          <Button title="Clear Logs" onPress={clearServerLogs} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  buttonContainer: {
    display: "flex",
    alignItems: "flex-end",
  },
  animatedView: {
    width: "100%",
    overflow: "hidden",
  },
  staticServerButtons: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    justifyContent: "space-around",
  },
  logs: {
    height: 120,
  },
});

export default StaticServerDebugger;
