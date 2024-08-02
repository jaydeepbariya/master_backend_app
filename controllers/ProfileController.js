import prisma from "../config/dbConfig.js";
import { imageValidator } from "../util/validateImage.js";
import cloudinary from "cloudinary";

export const getUser = async (req, res) => {
    try {

        const email = req.user.email;

        const user = await prisma.users.findUnique({
            where: {
                email
            }
        });

        user.password = undefined;

        return res.status(200).json({ success: true, message: "User Details Fetched", userData: user });

    } catch (error) {
        console.log("GET PROFILE ERROR ", error.message);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

export const updateProfile = async (req, res) => {
    try {

        const { id } = req.params;
        const user = req.user;

        if (!req.files || Object.keys(req.files).length == 0) {
            return res.status(400).json({
                success: false,
                message: "Image not provided"
            });
        }

        const profile = req.files.profile;
        const message = imageValidator(profile.size, profile.mimetype);

        if (message != null) {
            return res.status(400).json({
                success: false,
                message: message
            });
        }

        const response = await cloudinary.v2.uploader.upload(profile.tempFilePath);
        console.log(response);

        await prisma.users.update({
            data: {
                profile: response.secure_url
            },
            where: {
                id: Number(id)
            }
        });

        return res.status(200).json({ success: true, message: "profile updated" });

    } catch (error) {
        console.log("update profile error ", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}