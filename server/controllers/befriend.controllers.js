import { PrismaClient } from "@prisma/client";
import { clients } from "../routers/ws.js";

const prisma = new PrismaClient();

export const getPosts = async (req, res) => {
  try {
    const data = await prisma.post.findMany({
      include: {
        user: true,
        medias: true,
        comments: true,
        likes: true,
        shares: true,
      },
      orderBy: { id: "desc" },
      take: 200,
    });

    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

export const getFriendsPosts = async (req, res) => {
  // Convert userId to a number if it's passed as a string
  const userId = parseInt(req.params.userId, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  console.log("User  ID:", userId);

  try {
    // Step 1: Fetch friendships
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [{ userId: userId }, { friendId: userId }],
      },
      select: {
        friendId: true,
        userId: true,
      },
    });

    // Step 2: Extract friend IDs
    const friendIds = friendships.map((friendship) => {
      return friendship.userId === userId
        ? friendship.friendId
        : friendship.userId;
    });

    console.log("Friend IDs:", friendIds);

    // Step 3: Fetch posts from friends
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

    // Step 4: Send response
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

export const getFriends = async (req, res) => {
  console.log("getFriend");
};
