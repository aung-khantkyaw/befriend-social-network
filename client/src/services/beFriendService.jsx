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
      const response = await fetch(`${API_URL}/get-posts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      set({
        allPosts: data,
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

  getFriendPosts: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/getFriendPosts/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      set({
        friendPosts: data,
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

      setTimeout(() => {
        set({
          errorType: null,
          errorMessage: null,
          successType: null,
          successMessage: null,
        });
      }, 3000);
    } catch (error) {
      set({
        errorType: "createPost",
        errorMessage: error.message,
        isLoading: false,
      });
      setTimeout(() => {
        set({
          errorType: null,
          errorMessage: null,
          successType: null,
          successMessage: null,
        });
      }, 3000);
    }
  },

  editPost: async (postId, content) => {
    console.log("Editing post:", postId, content);
  },

  deletePost: async (postId) => {
    const token = localStorage.getItem("token");
    console.log("Deleting post:", postId);
    console.log("Token:", token);

    try {
      const response = await fetch(`${API_URL}/delete-post/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status !== 200) {
        set({
          errorType: "deletePost",
          errorMessage: data.error,
          isLoading: false,
        });
        throw new Error(data.error);
      }

      set({
        successType: "deletePost",
        successMessage: data.message,
        isLoading: false,
      });

      setTimeout(() => {
        set({
          errorType: null,
          errorMessage: null,
          successType: null,
          successMessage: null,
        });
      }, 3000);
    } catch (error) {
      set({
        errorType: "deletePost",
        errorMessage: error.message,
        isLoading: false,
      });

      setTimeout(() => {
        set({
          errorType: null,
          errorMessage: null,
          successType: null,
          successMessage: null,
        });
      }, 3000);
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

  addComment: async (postId, userId, content) => {
    console.log("Adding comment:", postId, userId, content);

    try {
      const response = await fetch(`${API_URL}/add-comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, userId, content }),
      });

      const data = await response.json();

      if (response.status !== 201) {
        set({
          errorType: "addComment",
          errorMessage: data.error,
          isLoading: false,
        });
        throw new Error(data.error);
      }

      set({
        successType: "addComment",
        successMessage: data.message,
        isLoading: false,
      });
    } catch (error) {
      set({
        errorType: "addComment",
        errorMessage: error.message,
        isLoading: false,
      });
    }
  },

  getFriends: async (userId) => {
    console.log("Getting friends:", userId);
    try {
      const response = await fetch(`${API_URL}/get-friends/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      set({
        friends: data,
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

  getFriendRequests: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/get-friend-requests/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      set({
        friendRequests: data,
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

  sendFriendRequest: async (userId, friendId) => {
    try {
      const response = await fetch(`${API_URL}/send-friend-request/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, friendId }),
      });

      const data = await response.json();

      if (response.status !== 201) {
        set({
          errorType: "sendFriendRequest",
          errorMessage: data.error,
          isLoading: false,
        });
        throw new Error(data.error);
      }

      set({
        successType: "sendFriendRequest",
        successMessage: data.message,
        isLoading: false,
      });
    } catch (error) {
      set({
        errorType: "sendFriendRequest",
        errorMessage: error.message,
        isLoading: false,
      });
    }
  },

  acceptFriendRequest: async (friendshipId) => {
    console.log("Accepting friend request:", friendshipId);
    try {
      const response = await fetch(
        `${API_URL}/accept-friend-request/${friendshipId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.status !== 200) {
        set({
          errorType: "acceptFriendRequest",
          errorMessage: data.error,
          isLoading: false,
        });
        throw new Error(data.error);
      }

      set({
        successType: "acceptFriendRequest",
        successMessage: data.message,
        isLoading: false,
      });
    } catch (error) {
      set({
        errorType: "acceptFriendRequest",
        errorMessage: error.message,
        isLoading: false,
      });
    }
  },

  unfriend: async (friendshipId) => {
    try {
      const response = await fetch(`${API_URL}/unfriend/${friendshipId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.status !== 200) {
        set({
          errorType: "unfriend",
          errorMessage: data.error,
          isLoading: false,
        });
        throw new Error(data.error);
      }

      set({
        successType: "unfriend",
        successMessage: data.message,
        isLoading: false,
      });
    } catch (error) {
      set({
        errorType: "unfriend",
        errorMessage: error.message,
        isLoading: false,
      });
    }
  },

  getFriendsSuggestions: async (userId) => {
    try {
      const response = await fetch(
        `${API_URL}/get-friends-suggestions/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      set({
        friendsSuggestions: data,
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

  getNotis: async () => {
    try {
      const response = await fetch(`${API_URL}/notis`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      set({
        notifications: data,
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

  markAsRead: async (notiId) => {
    console.log("Marking as read:", notiId);

    try {
      const resposne = await fetch(`${API_URL}/mark-as-read/${notiId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await resposne.json();

      if (resposne.status !== 200) {
        set({
          errorType: "markAsRead",
          errorMessage: data.error,
          isLoading: false,
        });
        throw new Error(data.error);
      }

      set({
        successType: "markAsRead",
        successMessage: data.message,
        isLoading: false,
      });
    } catch (error) {
      set({
        errorType: "markAsRead",
        errorMessage: error.message,
        isLoading: false,
      });
    }
  },
}));
