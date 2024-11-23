import { useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { beFriendService } from "./services/beFriendService";

export default function AppSocket() {
  const isAuthenticated = localStorage.getItem("token");
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    import.meta.env.VITE_WS_URL
  );
  const { getNotis } = beFriendService();

  useEffect(() => {
    if (isAuthenticated && readyState === ReadyState.OPEN) {
      sendJsonMessage({
        token: localStorage.getItem("token"),
      });
      console.log("WS: connection ready & token sent");
    }
  }, [readyState, isAuthenticated, sendJsonMessage]);

  useEffect(() => {
    console.log("WS: new message received");
    if (lastJsonMessage?.event) {
      async function handleEvent() {
        await getNotis();
      }
      handleEvent();
      console.log("WS: event received", lastJsonMessage.event);
    }
  }, [lastJsonMessage, getNotis]);

  return <></>;
}
