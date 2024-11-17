import { PrismaClient } from "@prisma/client";
import { clients } from "../routers/ws.js";

const prisma = new PrismaClient();

export const post = async (req, res) => {
  try {
    const data = await prisma.post.findMany({
      include: {
        user: true,
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
