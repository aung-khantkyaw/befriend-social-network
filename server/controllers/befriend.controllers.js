import { PrismaClient } from "@prisma/client";
import { clients } from "../routers/ws.js";

const prisma = new PrismaClient();

export const getPosts = async (req, res) => {
  try {
    const data = await prisma.post.findMany({
      include: {
        user: true, // Include the user who created the post
        medias: true, // Include media associated with the post
        comments: {
          include: {
            user: true,
          },
        },
        likes: true, // Include likes
        shares: true, // Include shares
      },
      orderBy: { id: "desc" }, // Order by post ID in descending order
      take: 200, // Limit to 200 posts
    });

    res.status(200).json(data); // Send the data as a response
  } catch (e) {
    res.status(500).json({ error: e }); // Handle errors
  }
};

export const getFriendsPosts = async (req, res) => {
  // Convert userId to a number if it's passed as a string
  const userId = parseInt(req.params.userId, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [{ userId: userId }, { friendId: userId }],
      },
      select: {
        friendId: true,
        userId: true,
      },
    });

    const friendIds = friendships.map((friendship) => {
      return friendship.userId === userId
        ? friendship.friendId
        : friendship.userId;
    });

    const posts = await prisma.post.findMany({
      where: {
        userId: {
          in: friendIds,
        },
      },
      include: {
        user: true,
        medias: true,
        likes: true,
        comments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching friends' posts:", error); // Log the error for debugging
    res.status(500).json({ error: error.message }); // Send a more user-friendly error message
  }
};

export const createPost = async (req, res) => {
  const { content, userId } = req.body;
  const files = req.files;

  try {
    if (!content || !userId) {
      return res
        .status(400)
        .json({ error: "Content and User ID are required." });
    }

    const post = await prisma.post.create({
      data: {
        content,
        userId: parseInt(userId),
      },
    });

    if (files && files.length > 0) {
      const mediaData = files.map((file) => ({
        postId: post.id,
        mediaUrl: file.path.replace(/\\/g, "/"),
        mediaType: file.mimetype.split("/")[0],
      }));

      await prisma.postMedia.createMany({
        data: mediaData,
      });
    }

    res.status(201).json({ message: "Post created successfully.", post });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post." });
  }
};

export const editPost = async (req, res) => {
  console.log("Edit post");
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  });

  clients.forEach((client) => {
    if (client.userId == post.userId) {
      client.ws.send(JSON.stringify({ event: "postDelete" }));
      console.log(`WS: event sent to ${client.userId}: postDelete`);
    }
  });

  await prisma.post.delete({
    where: { id: Number(id) },
  });
};

export const likePost = async (req, res) => {
  const { postId, userId } = req.body;

  try {
    if (!postId || !userId) {
      return res
        .status(400)
        .json({ error: "Post ID and User ID are required." });
    }

    const like = await prisma.like.create({
      data: {
        postId: parseInt(postId),
        userId: parseInt(userId),
      },
    });

    const post = await prisma.post.findUnique({
      where: { id: parseInt(postId) },
    });

    const username = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        username: true,
      },
    });

    await addNotis({
      userId: post.userId,
      senderId: userId,
      title: "Like",
      message: `${username.username} liked your post.`,
      postId: postId,
    });

    res.status(201).json({ message: "Post liked successfully.", like });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ error: "Failed to like post." });
  }
};

export const unlikePost = async (req, res) => {
  const { postId, userId } = req.body;

  try {
    if (!postId || !userId) {
      return res
        .status(400)
        .json({ error: "Post ID and User ID are required." });
    }

    await prisma.like.deleteMany({
      where: {
        postId: parseInt(postId),
        userId: parseInt(userId),
      },
    });

    res.status(200).json({ message: "Post unliked successfully." });
  } catch (error) {
    console.error("Error unliking post:", error);
    res.status(500).json({ error: "Failed to unlike post." });
  }
};

export const addComment = async (req, res) => {
  const { postId, userId, content } = req.body;

  console.log("Adding comment:", postId, userId, content);

  try {
    if (!postId || !userId || !content) {
      return res.status(400).json({
        error: "Post ID, User ID, and Content are required.",
      });
    }

    const comment = await prisma.comment.create({
      data: {
        postId: parseInt(postId),
        userId: parseInt(userId),
        content,
      },
    });

    const post = await prisma.post.findUnique({
      where: { id: parseInt(postId) },
    });

    const username = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        username: true,
      },
    });

    await addNotis({
      userId: post.userId,
      senderId: userId,
      title: "Comment",
      message: `${username.username} commented on your post.`,
      postId: postId,
    });

    res.status(201).json({ message: "Comment added successfully.", comment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment." });
  }
};

export const getFriends = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [{ userId: userId }, { friendId: userId }],
        AND: { status: "accepted" },
      },
      select: {
        id: true,
        friendId: true,
        userId: true,
      },
    });

    const friendIds = friendships.map((friendship) => {
      return friendship.userId === userId
        ? friendship.friendId
        : friendship.userId;
    });

    const friends = await prisma.user.findMany({
      where: {
        id: {
          in: friendIds,
        },
      },
    });

    // Construct the response with friend data and friendship ID
    const friendsWithFriendshipId = friendships.map((friendship) => {
      const friend = friends.find(
        (u) =>
          u.id ===
          (friendship.userId === userId
            ? friendship.friendId
            : friendship.userId)
      );
      return {
        friendshipId: friendship.id, // Include the friendship ID
        friendId:
          friendship.userId === userId
            ? friendship.friendId
            : friendship.userId,
        ...friend, // Spread the user details (excluding password)
      };
    });

    const sanitizedFriends = friendsWithFriendshipId.map(
      ({ password, ...userWithoutPassword }) => userWithoutPassword
    );

    res.status(200).json(sanitizedFriends);
  } catch (error) {
    console.error("Error fetching friends' posts:", error); // Log the error for debugging
    res.status(500).json({ error: error.message }); // Send a more user-friendly error message
  }
};

export const getFriendRequests = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const friendRequests = await prisma.friendship.findMany({
      where: {
        friendId: userId,
        status: "pending",
      },
      include: {
        user: true,
      },
    });

    const sanitizedFriendRequests = friendRequests.map(
      ({ user, ...friendRequest }) => {
        const { password, ...userWithoutPassword } = user;
        return {
          ...friendRequest,
          user: userWithoutPassword,
        };
      }
    );

    res.status(200).json(sanitizedFriendRequests);
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    res.status(500).json({ error: "Failed to fetch friend requests." });
  }
};

export const sendFriendRequest = async (req, res) => {
  const { userId, friendId } = req.body;
  console.log("Sending friend request");
  console.log(userId, friendId);
  try {
    if (!userId || !friendId) {
      return res
        .status(400)
        .json({ error: "User ID and Friend ID are required." });
    }

    const friendship = await prisma.friendship.create({
      data: {
        userId: parseInt(userId),
        friendId: parseInt(friendId),
        status: "pending",
      },
    });

    const username = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        username: true,
      },
    });

    await addNotis({
      userId: friendId,
      senderId: userId,
      title: "Friend Request Received",
      message: `${username.username} sent you a friend request.`,
      routeTo: `/${username.username}`,
    });

    res.status(201).json({ message: "Friend request sent.", friendship });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ error: "Failed to send friend request." });
  }
};

export const acceptFriendRequest = async (req, res) => {
  const friendshipId = parseInt(req.params.friendshipId, 10);
  console.log("Accepting friend request:", friendshipId);

  try {
    const friendship = await prisma.friendship.update({
      where: {
        id: friendshipId,
      },
      data: {
        status: "accepted",
      },
    });

    const friend = await prisma.user.findUnique({
      where: { id: friendship.friendId },
    });

    await addNotis({
      userId: friendship.userId,
      senderId: friendship.friendId,
      title: "Friend Request Accepted",
      message: `${friend.username} accepted your friend request.`,
      routeTo: `/${friend.username}`,
    });

    res.status(200).json({ message: "Friend request accepted.", friendship });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ error: "Failed to accept friend request." });
  }
};

export const unfriend = async (req, res) => {
  const friendshipId = parseInt(req.params.friendshipId, 10);
  console.log("Unfriending:", friendshipId);

  try {
    await prisma.friendship.deleteMany({
      where: {
        id: friendshipId,
      },
    });

    res.status(200).json({ message: "unfriend success" });
  } catch (error) {
    console.error("Error unfriend:", error);
    res.status(500).json({ error: "Failed to unfriend." });
  }
};

export const getFriendsSuggestions = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [{ userId: userId }, { friendId: userId }],
      },
      select: {
        friendId: true,
        userId: true,
      },
    });

    const friendIds = friendships.map((friendship) => {
      return friendship.userId === userId
        ? friendship.friendId
        : friendship.userId;
    });

    const friendsSuggestions = await prisma.user.findMany({
      where: {
        NOT: {
          id: {
            in: friendIds,
          },
        },
        id: {
          not: userId,
        },
      },
    });

    const sanitizedFriendsSuggestions = friendsSuggestions.map(
      ({ password, ...userWithoutPassword }) => userWithoutPassword
    );

    res.status(200).json(sanitizedFriendsSuggestions);
  } catch (error) {
    console.error("Error fetching friends' posts:", error); // Log the error for debugging
    res.status(500).json({ error: error.message }); // Send a more user-friendly error message
  }
};

export const getNotis = async (req, res) => {
  const user = res.locals.user;
  const notis = await prisma.notification.findMany({
    where: {
      userId: Number(user.id),
    },
    include: { sender: true },
    orderBy: { id: "desc" },
  });

  res.json(notis);
};

export const addNotis = async (notificationData) => {
  const {
    userId,
    senderId,
    routeTo,
    title,
    message,
    postId,
    commentId,
    replyId,
    shareId,
  } = notificationData;

  try {
    const noti = await prisma.notification.create({
      data: {
        userId: Number(userId),
        senderId: Number(senderId),
        routeTo: routeTo,
        title: title,
        message: message,
        postId: Number(postId) || null,
        commentId: Number(commentId) || null,
        replyId: Number(replyId) || null,
        shareId: Number(shareId) || null,
      },
    });

    clients.forEach((client) => {
      console.log(client.userId, userId);
      if (client.userId == userId) {
        client.ws.send(JSON.stringify({ event: "notiAdd" }));
        console.log(
          `WS: event sent to ${client.userId} from ${senderId}: notiAdd`
        );
      }
    });

    return noti;
  } catch (error) {
    console.error("Error adding notification:", error);
    throw new Error("Failed to add notification.");
  }
};

export const markAsRead = async (req, res) => {
  const { notiId } = req.params;
  const user = res.locals.user;
  console.log("Marking notification as read:", notiId);
  try {
    await prisma.notification.update({
      where: { id: Number(notiId) },
      data: {
        isRead: true,
      },
    });

    clients.forEach((client) => {
      if (client.userId == user.id) {
        client.ws.send(JSON.stringify({ event: "notiRead" }));
        console.log(`WS: event sent to ${client.userId}: notiRead`);
      }
    });

    res.status(200).json({ message: "Notification marked as read." });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Failed to mark notification as read." });
  }
};
