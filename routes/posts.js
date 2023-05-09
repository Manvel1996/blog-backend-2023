import { Router } from "express";
import { checkAuth } from "../utils/checkAuth.js";
import {
  createPost,
  getAll,
  getById,
  getMyPosts,
  removePost,
  updatePost,
  getPostComments
} from "../controllers/posts.js";

const router = new Router();

// Create post
router.post("/", checkAuth, createPost);

//All posts
router.get("/", getAll);

//Post by ID
router.get("/:id", getById);

//Get my posts
router.get("/user/me", checkAuth, getMyPosts);

//Remove post
router.delete("/:id",checkAuth, removePost);

//Update post
router.put("/:id",checkAuth, updatePost);

//Get post comments
router.get("/comments/:id", getPostComments);

export default router;
