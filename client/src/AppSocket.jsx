import { useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { authService } from "./services/authService";
export default function AppSocket() {
  const { isAuthenticated } = authService();
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    import.meta.env.VITE_WS_URL
  );

  useEffect(() => {
    if (isAuthenticated && readyState === ReadyState.OPEN) {
      sendJsonMessage({
        token: localStorage.getItem("token"),
      });
      console.log("WS: connection ready & token sent");
    }
  }, [readyState]);

  useEffect(() => {
    console.log("WS: new message received");
    if (lastJsonMessage && lastJsonMessage.event) {
      console.log("WS: event received", lastJsonMessage.event);
    }
  }, [lastJsonMessage]);
  
  return <></>;
}
