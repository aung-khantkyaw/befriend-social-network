import { PrismaClient } from "@prisma/client";
import express from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

/***
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export function auth(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(" ")[1];

  if (!token) {
    return res.status(400).json({ msg: "token required" });
  }

  const user = jwt.decode(token, process.env.JWT_SECRET);
  if (!user) {
    return res.status(401).json({ msg: "incorrect token" });
  }

  res.locals.user = user;

  next();
}

/***
 * @param {('posts' | 'comments')} type
 */
export function isOwner(type) {
  /***
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */

  return async (req, res, next) => {
    const { id } = req.params;
    const user = res.locals.user;

    if (type == "posts") {
      const post = await prisma.post.findUnique({
        where: { id: Number(id) },
        include: {
          comments: true,
          likes: true,
          shares: true,
        },
      });

      if (post.userId !== user.id) {
        return res.status(403).json({ msg: "not authorized" });
      }

      next();
    }

    if (type == "comments") {
      const comment = await prisma.comment.findUnique({
        where: { id: Number(id) },
        include: {
          post: true,
          likes: true,
        },
      });

      if (comment.userId !== user.id) {
        return res.status(403).json({ msg: "not authorized" });
      }

      next();
    }

    return res.status(400).json({ msg: "invalid type" });
  };
}
