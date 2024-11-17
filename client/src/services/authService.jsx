import { create } from "zustand";
const api = import.meta.env.VITE_API_URL;

const API_URL = `${api}/auth`;
const ImageAPI_URL = `${api}`;

const token = localStorage.getItem("token");

export const authService = create((set) => ({
  user: null,
  isAuthenticated: false,
  errorType: null,
  errorMessage: null,
  successType: null,
  successMessage: null,
  isLoading: true,
  isCheckingAuth: true,

  loadAuthState: async () => {
    try {
      const res = await fetch(`${api}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      console.log("Response from verify:", json);

      set({
        user: json.data,
        isAuthenticated: true,
        isLoading: false,
        isCheckingAuth: false,
      });
    } catch (error) {
      console.error("Error in loadAuthState Function: ", error);
    }
  },

  register: async (data) => {
    console.log("Register function called with data:", data);
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      console.log("JSON parsed response:", json);

      if (json.success === "false") {
        set({
          errorType: json.type || "error",
          errorMessage: json.message || "An unknown error occurred.",
        });
        return;
      }

      if (json.success === "true") {
        const user = {
          name: json.data.name,
          username: json.data.username,
          profile: `${ImageAPI_URL}/${json.data.profile}`,
          isVerified: json.data.isVerified,
        };

        set({
          user: user,
          isAuthenticated: true,
          errorType: null,
          errorMessage: null,
        });

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("token", json.token);

        console.log("State after registration:", { user: json.data });
      }
    } catch (error) {
      console.error("Error in register function:", error);
      set({
        errorType: "error",
        errorMessage: error.message || "An unexpected error occurred.",
      });
    }
  },

  verifyEmail: async (data) => {
    console.log("Verification code:", data);
    try {
      const res = await fetch(`${API_URL}/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const json = await res.json();
      console.log("JSON parsed response:", json);

      if (json.success === "false") {
        set({
          errorMessage: json.message || "An unknown error occurred.",
        });
        return;
      }

      if (json.success === "true") {
        localStorage.removeItem("user");
        const user = {
          name: json.data.name,
          username: json.data.username,
          profile: `${ImageAPI_URL}/${json.data.profile}`,
          isVerified: json.data.isVerified,
        };

        set({
          user: user,
          isAuthenticated: true,
        });

        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch (error) {
      console.error("Error in verification function:", error);
      set({
        errorType: "error",
        errorMessage: error.message || "An unexpected error occurred.",
      });
    }
  },

  resendVerifyEmail: async (data) => {
    console.log("Resend Verify Email address:", data);
    try {
      const res = await fetch(`${API_URL}/resend-verification-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const json = await res.json();
      console.log("JSON parsed response:", json);

      if (json.success === "false") {
        set({
          errorMessage: json.message || "An unknown error occurred.",
        });
        return;
      }

      if (json.success === "true") {
        set({
          successMessage: json.message,
        });
      }
    } catch (error) {
      console.error("Error in resend verification function:", error);
      set({
        errorType: "error",
        errorMessage: error.message || "An unexpected error occurred.",
      });
    }
  },

  login: async (data) => {
    console.log("Login function called with data:", data);
    console.log("API URL:", `${API_URL}/login`);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const json = await res.json();
      console.log("JSON parsed response:", json);

      if (json.success === "false") {
        set({
          errorType: json.type || "error",
          errorMessage: json.message || "An unknown error occurred.",
        });
        return;
      }

      if (json.success === "true") {
        const user = {
          name: json.data.name,
          username: json.data.username,
          profile: `${ImageAPI_URL}/${json.data.profile}`,
          isVerified: json.data.isVerified,
        };

        set({
          user: user,
          isAuthenticated: true,
          errorType: null,
          errorMessage: null,
        });

        // localStorage.setItem("user", JSON.stringify(user));
        // localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("token", json.token);

        console.log("State after login:", { user: json.data }); // Log the updated state
      }
    } catch (error) {
      console.error("Error in login function:", error); // Log any errors
      set({
        errorType: "error",
        errorMessage: error.message || "An unexpected error occurred.",
      });
    }
  },

  forgotPassword: async (data) => {
    console.log("Forgot Password function called with data:", data);
    try {
      const res = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const json = await res.json();
      console.log("JSON parsed response:", json);

      if (json.success === "false") {
        set({
          errorType: json.type || "error",
          errorMessage: json.message || "An unknown error occurred.",
        });
        return;
      }

      if (json.success === "true") {
        set({
          successMessage: json.message,
        });
      }
    } catch (error) {
      console.error("Error in Forgot Password function:", error); // Log any errors
      set({
        errorType: "error",
        errorMessage: error.message || "An unexpected error occurred.",
      });
    }
  },

  resetPassword: async (data) => {
    console.log("Reset Password function called with data:", data);
    try {
      const res = await fetch(`${API_URL}/reset-password/${data.token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const json = await res.json();
      console.log("JSON parsed response:", json);

      if (json.success === "false") {
        set({
          errorType: json.type || "error",
          errorMessage: json.message || "An unknown error occurred.",
        });
        return;
      }

      if (json.success === "true") {
        set({
          successMessage: json.message,
        });
      }
    } catch (error) {
      console.error("Error in Reset Password function:", error); // Log any errors
      set({
        errorType: "error",
        errorMessage: error.message || "An unexpected error occurred.",
      });
    }
  },

  getUserData: async (username) => {
    try {
      const res = await fetch(`${API_URL}/getUserData/${username}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const json = await res.json();
      console.log("JSON parsed response:", json);

      if (json.success === "false") {
        set({
          errorType: json.type || "error",
          errorMessage: json.message || "An unknown error occurred.",
        });
        return;
      }

      if (json.success === "true") {
        return json.data;
      }
    } catch (error) {
      console.error("Error in profile function:", error);
      set({
        errorType: "error",
        errorMessage: error.message || "An unexpected error occurred.",
      });
    }
  },

  logout: async () => {
    try {
      const res = await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const json = await res.json();
      console.log("JSON parsed response:", json);

      if (json.success === "true") {
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("token");

        set({
          user: null,
          isAuthenticated: false,
          errorType: null,
          errorMessage: null,
        });
        console.log("State after logout:", { user: null });
      }
    } catch (error) {
      console.error("Error in logout function:", error);
      set({
        errorType: "error",
        errorMessage: error.message || "An unexpected error occurred.",
      });
    }
  },

  accountDelete: async (username) => {
    console.log(username);
    try {
      const res = await fetch(`${API_URL}/accountDelete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(username),
      });

      const json = await res.json();
      console.log("JSON parsed response:", json);

      if (json.success === "true") {
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("token");

        set({
          user: null,
          isAuthenticated: false,
          errorType: null,
          errorMessage: null,
        });
        console.log("State after logout:", { user: null });
      }
    } catch (error) {
      console.error("Error in account delete function:", error);
      set({
        errorType: "error",
        errorMessage: error.message || "An unexpected error occurred.",
      });
    }
  },

  updateAvarter: async (formData) => {
    try {
      const res = await fetch(`${API_URL}/update-avarter`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const json = await res.json();
      console.log("Server response:", json);

      if (json.success === "false") {
        set({
          errorType: json.type || "error",
          errorMessage: json.message || "An unknown error occurred.",
          successType: null,
          successMessage: null,
        });
        return;
      }

      if (json.success === "true") {
        const user = {
          name: json.data.name,
          username: json.data.username,
          profile: `${ImageAPI_URL}/${json.data.profile}`,
          isVerified: json.data.isVerified,
        };

        set({
          user: user,
          successType: "updated-avatar",
          successMessage: json.message,
          errorType: null,
          errorMessage: null,
        });

        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch (error) {
      console.error("Error in updateAvarter function:", error);
      set({
        errorType: "error",
        errorMessage: error.message || "An unexpected error occurred.",
      });
    }
  },

  updateProfile: async (data) => {
    console.log("Update Profile function called with data:", data);
    try {
      const res = await fetch(`${API_URL}/update-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const json = await res.json();
      console.log("JSON parsed response:", json);

      if (json.success === "false") {
        set({
          errorType: json.type || "error",
          errorMessage: json.message || "An unknown error occurred.",
          successType: null,
          successMessage: null,
        });
        return;
      }

      if (json.success === "true") {
        const user = {
          name: json.data.name,
          username: json.data.username,
          profile: `${ImageAPI_URL}/${json.data.profile}`,
          isVerified: json.data.isVerified,
        };

        set({
          user: user,
          successType: "updated-profile",
          successMessage: json.message,
          errorType: null,
          errorMessage: null,
        });

        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch (error) {
      console.error("Error in update profile function:", error);
      set({
        errorType: "error",
        errorMessage: error.message || "An unexpected error occurred.",
      });
    }
  },

  addLink: async (data) => {
    console.log("Add Link function called with data:", data);
    try {
      const res = await fetch(`${API_URL}/add-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const json = await res.json();
      console.log("JSON Response:", json);

      if (json.success === "false") {
        set({
          errorType: json.type || "error",
          errorMessage: json.message || "An unknown error occurred.",
          successType: null,
          successMessage: null,
        });
        return;
      }

      set({
        successType: "added-link",
        successMessage: json.message,
        errorType: null,
        errorMessage: null,
      });

      return json;
    } catch (error) {
      console.error("Error in updatePassword function:", error);
      throw error;
    }
  },

  updatePassword: async (data) => {
    try {
      const res = await fetch(`${API_URL}/update-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const json = await res.json();
      console.log("JSON Response:", json);

      if (json.success === "false") {
        set({
          errorType: json.type || "error",
          errorMessage: json.message || "An unknown error occurred.",
          successType: null,
          successMessage: null,
        });
        return;
      }

      set({
        successType: "updated-password",
        successMessage: json.message,
        errorType: null,
        errorMessage: null,
      });

      return json;
    } catch (error) {
      console.error("Error in updatePassword function:", error);
      throw error;
    }
  },
}));
