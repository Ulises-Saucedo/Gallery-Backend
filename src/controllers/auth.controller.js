import User from "../models/user.model.js";
import { createAccessToken } from "../libs/jwt.lib.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
    const { password, email, username, ...body } = req.body;

    try {
        const userFound = await User.findOne({
            $or: [{ email }, { username }],
        });
        if (userFound)
            return res.status(400).json({ message: "User already exists." });

        const salt = await bcrypt.genSalt(5);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            username,
            ...body,
            password: passwordHash,
        });

        const savedUser = await newUser.save();
        const token = await createAccessToken({ uid: savedUser._id });

        res.cookie("token", token);

        res.status(201).json({ message: "User saved successfully" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const userFound = await User.findOne({ username });
        if (!userFound)
            return res.status(400).json({ message: "User not found" });

        const isPasswordMatch = await bcrypt.compare(
            password,
            userFound.password
        );
        if (!isPasswordMatch)
            return res.status(400).json({ message: "Invalid credentials" });

        const token = await createAccessToken({ uid: userFound._id });

        res.cookie("token", token);

        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = (req, res) => {
    res.clearCookie("token");
    res.sendStatus(200);
};

export const verifyUser = async (req, res) => {
    const { uid } = req;

    const user = await User.findById(uid);

    res.json(user);
};
