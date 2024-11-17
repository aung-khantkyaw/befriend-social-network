import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect } from "react";
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
function App() {
  const { isAuthenticated, isLoading, isCheckingAuth, loadAuthState } =
    authService();

  const { getPosts } = beFriendService();

  useEffect(() => {
    loadAuthState();
    getPosts();
  }, [loadAuthState, getPosts]);

  if (isLoading || isCheckingAuth) {
    return <Loading />;
  }

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

        { path: "/friends", element: <div>Friend List</div> },
        { path: "/chat", element: <div>Chat</div> },
        { path: "/chat/:username", element: <div>Chat with</div> },

        { path: "/notifications", element: <div>Notifications</div> },
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
