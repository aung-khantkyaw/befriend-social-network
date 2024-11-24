import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import Home from "@/pages/Home.jsx";
import Account from "@/pages/Account.jsx";
import Login from "@/features/auth/LoginPage.jsx";
import Register from "@/features/auth/RegisterPage.jsx";
import ProtectedRoute from "@/components/ProtectedRoute.jsx";
import { authService } from "@/services/authService"; // Assuming you're using Zustand's useStore hook
import Loading from "@/components/ui/loading";
import Profile from "@/pages/Profile";
import ForgotPasswordPage from "@/features/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/features/auth/ResetPasswordPage";
import AppSocket from "./AppSocket";
import { beFriendService } from "./services/beFriendService";
import FriendList from "./features/befriend/FriendList";
import Notification from "./features/befriend/Notification";

function App() {
  const { user, isLoading, isCheckingAuth, loadAuthState } = authService();
  const {
    getNotis,
    getFriendPosts,
    getPosts,
    getFriends,
    getFriendsSuggestions,
    getFriendRequests,
  } = beFriendService();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false); // New state to track if auth check has been performed

  const token = localStorage.getItem("token");

  const checkAuth = useCallback(async () => {
    await loadAuthState();
    if (token) {
      setIsAuthenticated(true);
      try {
        await getPosts();
        if (user?.id) {
          await getFriendPosts(user.id);
          await getFriends(user.id);
          await getFriendsSuggestions(user.id);
          await getFriendRequests(user.id);
          await getNotis();
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    } else {
      setIsAuthenticated(false);
    }
    setHasCheckedAuth(true); // Mark that the auth check has been performed
  }, [
    loadAuthState,
    token,
    getPosts,
    getFriendPosts,
    getFriends,
    getFriendsSuggestions,
    getFriendRequests,
    getNotis,
    user,
  ]);

  useEffect(() => {
    if (!hasCheckedAuth) {
      checkAuth();
    }
  }, [checkAuth, hasCheckedAuth]);

  if (isLoading || isCheckingAuth) {
    return <Loading />;
  }

  // const { user, isLoading, isCheckingAuth, loadAuthState } = authService();
  // const {
  //   getNotis,
  //   getFriendPosts,
  //   getPosts,
  //   getFriends,
  //   getFriendsSuggestions,
  // } = beFriendService();
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  // const token = localStorage.getItem("token");

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     await loadAuthState();
  //     if (token) {
  //       setIsAuthenticated(true);
  //       try {
  //         await getPosts();
  //         if (user && user.id) {
  //           await getFriendPosts(user.id);
  //           await getFriends(user.id);
  //           await getFriendsSuggestions(user.id);
  //           await getNotis();
  //         }
  //       } catch (error) {
  //         console.error("Error fetching posts:", error);
  //       }
  //     } else {
  //       setIsAuthenticated(false);
  //     }
  //   };

  //   checkAuth();
  // }, [
  //   loadAuthState,
  //   getPosts,
  //   getFriendPosts,
  //   getFriends,
  //   getFriendsSuggestions,
  //   token,
  //   user,
  //   getNotis,
  // ]);

  // if (isLoading || isCheckingAuth) {
  //   return <Loading />;
  // }

  const routers = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPasswordPage />,
    },
    {
      path: "/reset-password/:token",
      element: <ResetPasswordPage />,
    },
    {
      path: "/",
      element: <ProtectedRoute isAuthenticated={isAuthenticated} />,
      children: [
        { path: "/account", element: <Account /> },
        { path: "/:username", element: <Profile /> },
        { path: "/squads", element: <div>Squads</div> },
        { path: "/squads/:squad", element: <div>Squad</div> },
        { path: "/squads/create", element: <div>Create Squad</div> },
        { path: "/squads/my-squads", element: <div>My Squads</div> },
        { path: "/channels", element: <div>Channels</div> },
        { path: "/channels/:channel", element: <div>Channel</div> },
        { path: "/channels/create", element: <div>Create Channel</div> },
        { path: "/channels/my-channels", element: <div>My Channels</div> },
        { path: "/friends", element: <FriendList /> },
        { path: "/chat", element: <div>Chat</div> },
        { path: "/chat/:username", element: <div>Chat with</div> },
        { path: "/notifications", element: <Notification /> },
      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={routers} />
      <AppSocket />
    </div>
  );
}

export default App;
