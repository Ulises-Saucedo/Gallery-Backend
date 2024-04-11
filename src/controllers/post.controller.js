import Post from "../models/post.model.js";
import fs from "fs/promises";
import path from "path";

export const getImages = async (req, res) => {
    const { limit, offset } = req.query;
    const filters = {
        limit: parseInt(limit, 10) || 20,
        skip: parseInt(offset, 10) || 0,
        sort: { date: -1 },
    };

    try {
        const images = await Post.find({}, null, filters)
            .select(["image", "title", "user"])
            .populate("user", "username");

        res.json(images);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};

export const getImage = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findById({ _id: id }).populate("user");
        if (!post) return res.status(404).json({ message: "Image not found" });

        res.json(post);
    } catch (e) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getPostImages = async (req, res) => {
    const { limit, offset } = req.query;
    const filters = {
        limit: parseInt(limit, 10) || 20,
        skip: parseInt(offset, 10) || 0,
        sort: { date: -1 },
    };

    try {
        const images = await Post.find({ user: req.uid }, null, filters);

        if (!images) return res.status(404).json({ message: "User not found" });

        res.json(images);
    } catch (e) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const postImage = async (req, res) => {
    const { title } = req.body;

    try {
        const newPost = new Post({
            image: `/${req.file.filename}`,
            originalname: `${req.file.originalname}`,
            title,
            user: req.uid,
        });

        const savedPost = await newPost.save();

        res.status(201).json(savedPost);
    } catch (e) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const newPost = {
        ...(req.body ? { ...req.body } : {}),
        ...(req.file
            ? {
                  image: `/${req.file.filename}`,
                  originalname: req.file.originalname,
              }
            : {}),
    };

    try {
        const post = await Post.findById({ _id: id });
        if (!post) return res.status(404).json({ message: "Invalid post" });

        if (!post.user.equals(req.uid))
            return res.status(401).json({ message: "Unauthorized user" });

        if (newPost.image) {
            await fs.unlink(path.join("uploads") + post.image);
        }

        const savedPost = await Post.findByIdAndUpdate(id, newPost, {
            new: true,
        });

        res.status(200).json(savedPost);
    } catch (e) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findById({ _id: id });

        if (!post) return res.status(404).json({ message: "Invalid post" });

        if (!post.user.equals(req.uid))
            return res.status(401).json({ message: "Unauthorized user" });

        await fs.unlink(path.join("uploads") + post.image);
        await post.deleteOne();

        res.sendStatus(204);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};
