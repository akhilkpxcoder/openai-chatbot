import { createToken } from './../utils/token-manager.js';
import { compare, hash } from "bcrypt";
import User from "../models/User.js";
import { COOKIE_NAME } from '../utils/constants.js';

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        return res.status(200).json({ message: "Ok", users });
    } catch (error) {
        return res.status(500).json({ message: "Error" });
    }
}

export const userSignup = async (req, res, next) => {
    try {
        //user signup
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(401).send("User already registered");
        const hashedPassword = await hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        //create token and store cookie
        res.clearCookie(COOKIE_NAME, { path: "/", domain: "localhost", httpOnly: true, signed: true })
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, { path: "/", domain: "localhost", expires, httpOnly: true, signed: true });
        return res.status(201).json({ message: "Ok", id: user._id.toString() });
    } catch (error) {
        return res.status(500).json({ message: "Error" });
    }
}

export const userLogin = async (req, res, next) => {
    try {
        //user login
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send("User not registered");
        }
        const isPassswordCorrect = await compare(password, user.password);
        if (!isPassswordCorrect) {
            return res.status(404).send("Incorrect Password");
        }
        //create token and store cookie
        res.clearCookie(COOKIE_NAME, { path: "/", domain: "localhost", httpOnly: true, signed: true })
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, { path: "/", domain: "localhost", expires, httpOnly: true, signed: true });
        return res.status(200).json({ message: "Ok", id: user._id.toString() });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error" });
    }
}