import { create } from "zustand";
const api = import.meta.env.VITE_API_URL;

const API_URL = `${api}/befriend`;

export const beFriendService = create((set) => ({
  errorType: null,
  errorMessage: null,
  successType: null,
  successMessage: null,
  isLoading: true,

  getPosts: async () => {
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      set({
        posts: data,
        isLoading: false,
      });
    } catch (error) {
      set({
        errorType: "posts",
        errorMessage: error.message,
        isLoading: false,
      });
    }
  },

  createPost: async (formData) => {
    try {
      const response = await fetch(`${API_URL}/create-post`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();
      console.log("Server response:", data);

      if (response.status !== 201) {
        set({
          errorType: "createPost",
          errorMessage: data.error,
          isLoading: false,
        });
        throw new Error(data.error);
      }

      set({
        successType: "createPost",
        successMessage: data.message,
        isLoading: false,
      });
    } catch (error) {
      set({
        errorType: "createPost",
        errorMessage: error.message,
        isLoading: false,
      });
    }
  },

  likePost: async (postId, userId) => {
    try {
      const response = await fetch(`${API_URL}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, userId }),
      });

      const data = await response.json();

      if (response.status !== 200) {
        set({
          errorType: "likePost",
          errorMessage: data.error,
          isLoading: false,
        });
        throw new Error(data.error);
      }

      set({
        successType: "likePost",
        successMessage: data.message,
        isLoading: false,
      });
    } catch (error) {
      set({
        errorType: "likePost",
        errorMessage: error.message,
        isLoading: false,
      });
    }
  },

  unlikePost: async (postId, userId) => {
    try {
      const response = await fetch(`${API_URL}/unlike`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, userId }),
      });

      const data = await response.json();

      if (response.status !== 200) {
        set({
          errorType: "unlikePost",
          errorMessage: data.error,
          isLoading: false,
        });
        throw new Error(data.error);
      }

      set({
        successType: "unlikePost",
        successMessage: data.message,
        isLoading: false,
      });
    } catch (error) {
      set({
        errorType: "unlikePost",
        errorMessage: error.message,
        isLoading: false,
      });
    }
  },
}));
