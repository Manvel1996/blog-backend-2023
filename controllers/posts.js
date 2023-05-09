import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

export const createPost = async (req, res) => {
  try {
    const { title, text } = req.body;
    const user = await User.findById(req.userId);

    if (req.files) {
      let fileName = Date.now().toString() + req.files.image.name;
      const __dirname = dirname(fileURLToPath(import.meta.url));
      req.files.image.mv(path.join(__dirname, "..", "uploads", fileName));

      const newPostWithImage = new Post({
        userName: user.userName,
        title,
        text,
        imgUrl: fileName,
        author: req.userId,
      });

      await newPostWithImage.save();
      await User.findByIdAndUpdate(req.userId, {
        $push: { posts: newPostWithImage },
      });
      return res.json({
        post: newPostWithImage,
        message: "Post create success",
      });
    }

    const newPostWithotImage = new Post({
      userName: user.userName,
      title,
      text,
      imgUrl: "",
      author: req.userId,
    });

    await newPostWithotImage.save();
    await User.findByIdAndUpdate(req.userId, {
      $push: { posts: newPostWithotImage },
    });

    res.json({ post: newPostWithotImage, message: "Post create success" });
  } catch (error) {
    res.json({ message: "Can't create post" });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await Post.find().sort("-createAtd");
    const popularPosts = await Post.find().limit(5).sort("-views");
    if (!posts) {
      return res.json({ message: "Not posts" });
    }
    res.json({ posts, popularPosts });
  } catch (error) {
    res.json({ message: "Can't get posts" });
  }
};

export const getById = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    if (!post) {
      return res.json({ message: "Not FullPost" });
    }
    res.json(post);
  } catch (error) {
    res.json({ message: "Can't get postById" });
  }
};

export const getMyPosts = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const myPosts = await Promise.all(
      user.posts.map((post) => Post.findById(post._id))
    );
    res.json(myPosts);
  } catch (error) {
    res.json({ message: "Can't get your posts" });
  }
};

export const removePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.json({ message: "Can't find that post" });
    }
    await User.findByIdAndUpdate(req.userId, {
      $pull: { posts: req.params.id },
    });
    res.json({ message: "Remove post success" });
  } catch (error) {
    res.json({ message: "Can't remove post" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { title, text, id } = req.body;
    const post = await Post.findById(id);

    if (req.files) {
      let fileName = Date.now().toString() + req.files.image.name;
      const __dirname = dirname(fileURLToPath(import.meta.url));
      req.files.image.mv(path.join(__dirname, "..", "uploads", fileName));
      post.imgUrl = fileName || "";
    }
    post.title = title;
    post.text = text;

    await post.save();
    res.json(post);
  } catch (error) {
    res.json({ message: "Can't uodate that post" });
  }
};

export const getPostComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const postComments = await Promise.all(
      post.comments.map(comment=>{
        return Comment.findById(comment)
      })
    );
    res.json(postComments)
  } catch (error) {
    res.json({ message: "Can't get post comments" });
  }
};
