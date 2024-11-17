import { PrismaClient } from "@prisma/client";
import { clients } from "../routers/ws.js";

const prisma = new PrismaClient();

export const post = async (req, res) => {
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
