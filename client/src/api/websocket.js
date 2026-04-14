import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { Platform } from "react-native";
import { BASE_URL } from "./client";

const WS_HTTP_URL = `${BASE_URL}/ws`;
const WS_NATIVE_URL = `${BASE_URL.replace(/^http(s?)/, "ws$1")}/ws`;

export function subscribeToOrders(onMessage, onError) {
  const client = new Client({
    ...(Platform.OS === "web"
      ? { webSocketFactory: () => new SockJS(WS_HTTP_URL) }
      : { brokerURL: WS_NATIVE_URL }),
    reconnectDelay: 5000,
    onConnect: () => {
      client.subscribe("/topic/orders", (message) => {
        try {
          const payload = JSON.parse(message.body);
          onMessage?.(payload);
        } catch (error) {
          onError?.(error);
        }
      });
    },
    onStompError: (frame) => {
      onError?.(new Error(frame.headers?.message || "WebSocket subscription failed"));
    },
    onWebSocketError: (event) => {
      onError?.(event);
    },
  });

  client.activate();

  return () => {
    client.deactivate();
  };
}

export { WS_HTTP_URL, WS_NATIVE_URL };
