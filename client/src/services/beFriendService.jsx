import { create } from "zustand";
const api = import.meta.env.VITE_API_URL;

const API_URL = `${api}/befriend`;
const ImageAPI_URL = `${api}`;

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
}));
