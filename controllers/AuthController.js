import vine, { errors } from "@vinejs/vine";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/dbConfig.js";
import { loginSchema, registerSchema } from "../validations/authValidation.js";


export const register = async (req, res) => {

    try {
        const registerData = req.body;

        const validator = vine.compile(registerSchema);
        const payload = await validator.validate(registerData);

        const existingUser = await prisma.users.findUnique({
            where: {
                email: payload.email
            }
        });

        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        payload.password = await bcrypt.hash(payload.password, 12);

        const newUser = await prisma.users.create({ data: payload });

        return res.status(201).json({ success: true, message: "User Registration Successful", userData: newUser });

    } catch (error) {
        if (error instanceof errors.E_VALIDATION_ERROR) {
            console.log("REGISTRATION ERROR ", error.message);
            return res.status(400).json({ success: false, message: "Validation Failed", errors: error });
        } else {
            console.log("REGISTRATION ERROR ", error.message);
            return res.status(500).json({ success: false, message: "Something went wrong" });
        }
    }
}

export const login = async (req, res) => {
    try {

        const loginData = req.body;

        const validator = vine.compile(loginSchema);
        const payload = await validator.validate(loginData);

        const user = await prisma.users.findUnique({
            where: {
                email: payload.email
            }
        });

        if (!user) {
            return res.status(401).json({ success: false, message: "User does not exists" });
        }

        const comparePassword = await bcrypt.compare(payload.password, user.password);

        if (!comparePassword) {
            return res.status(401).json({ success: false, message: "Invalid Credentials" });

        }


        const payloadData = {
            name: user.name,
            email: user.email,
            user_id: user.id
        };

        let token = jwt.sign(payloadData, process.env.JWT_SECRET, {
            expiresIn: "2d"
        });

        token = "Bearer " + token;
        user.token = token;

        return res.status(200).json({ success: true, message: "Login Successful", user, token });

    } catch (error) {
        if (error instanceof errors.E_VALIDATION_ERROR) {
            console.log("LOGIN ERROR ", error.message);
            return res.status(400).json({ success: false, message: "Validation Failed", errors: error.message });
        } else {
            console.log("LOGIN ERROR ", error.message);
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}






