// src/webSocket.ts
export const BASE_WS_URL = "wss://askbalapi.staging.xeai.uk";

let socket: WebSocket | null = null;

export const connectWebSocket = () => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    socket = new WebSocket(BASE_WS_URL);

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      console.log("Received message:", event.data);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = (event) => {
      console.log("WebSocket closed:", event.reason);
    };
  }
};

export const sendMessage = (message: string) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(message);
    console.log("Message sent:", message);
  } else {
    console.error("WebSocket is not open. Cannot send message.");
  }
};

export const disconnectWebSocket = () => {
  if (socket) {
    socket.close();
    console.log("WebSocket connection closed.");
  }
};
