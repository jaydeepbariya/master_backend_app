import vine, { errors } from "@vinejs/vine";
import cloudinary from "cloudinary";
import { newsSchema } from "../validations/newsValidation.js";
import { imageValidator } from "../util/validateImage.js";
import prisma from "../config/dbConfig.js";
import { createClient } from "redis";
import mailSender from "../util/sendEmail.js";
import { messages } from "@vinejs/vine/defaults";


export const createNews = async (req, res) => {
    try {
        const user = req.user;
        const body = req.body;

        const validator = vine.compile(newsSchema);
        const payload = await validator.validate(body);

        if (!req.files || Object.keys(req.files).length == 0) {
            return res.status(400).json({
                success: false,
                message: "Image required"
            });
        }

        const image = req.files.image;
        const message = imageValidator(image?.size, image?.mimetype);

        if (message !== null) {
            return res.status(400).json({
                success: false,
                message
            });
        }

        const response = await cloudinary.v2.uploader.upload(image.tempFilePath);

        const news = await prisma.news.create({
            data: {
                title: payload.title,
                content: payload.content,
                image: response.secure_url,
                user_id: req.user.id
            }
        });

        return res.status(200).json({
            success: true,
            message: "News created",
            news
        });

    } catch (error) {
        if (error instanceof errors.E_VALIDATION_ERROR) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
        else {
            console.log("create news error ", error.message);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }


}

export const getAllNews = async (req, res) => {

    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 1);

    if (page <= 0) {
        page = 1;
    }

    if (limit <= 0 || limit > 10) {
        limit = 2;
    }

    const skip = (page - 1) * limit;

    const news = await prisma.news.findMany({
        take: limit,
        skip: skip,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    profile: true
                }
            }
        }
    });

    const totalNews = await prisma.news.count();
    const totalPages = Math.ceil(totalNews / limit);

    return res.status(200).json({ success: true, message: "News Fetched", metadata: { totalNews, totalPages, currentPage: page, currentLimit: limit }, news });

}

export const getNews = async (req, res) => {
    const { id } = req.params;

    const client = createClient();
    await client.on("error", err => console.log("Redis Client Error ", err)).connect();

    const value = await client.get(id);

    let news = null;

    if (!value) {
        news = await prisma.news.findUnique({
            where: {
                id: Number(id)
            }
        });
    }
    else {
        news = JSON.parse(value);
    }

    await client.disconnect();

    return res.status(200).json({ success: true, message: "News Fetched", news });
}

export const updateNews = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const news = await prisma.news.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (user.id !== news.user_id) {
            return res.status(400).json({
                success: false,
                message: "you cannot update this news"
            });
        }

        let imageUrl;

        if (req.files.image) {
            const image = req.files.image;
            const message = imageValidator(image?.size, image?.mimetype);

            if (message !== null) {
                return res.status(400).json({
                    success: false,
                    message
                });
            }

            const response = await cloudinary.v2.uploader.upload(image.tempFilePath);
            imageUrl = response.secure_url;
        }

        const title = req.body.title || news.title;
        const content = req.body.content || news.content;
        const image = req.body.image || news.image;

        const updatedNews = await prisma.news.update({
            where: {
                id: Number(id)
            },
            data: {
                title,
                content,
                image
            }
        });

        return res.status(200).json({
            success: true,
            message: "News Updated",
            news: updatedNews
        });

    } catch (error) {
        if (error instanceof errors.E_VALIDATION_ERROR) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }
        else {
            console.log("UPDATE NEWS ERROR ", error.message);
            return res.status(500).json({
                success: false,
                message: "Something went wrong"
            });
        }
    }




}

export const deleteNews = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const news = await prisma.news.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (user.user_id !== news.user_id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        await prisma.news.delete({
            where: {
                id: Number(id)
            }
        });

        return res.status(200).json({
            success: true,
            message: "News Deleted"
        });
    } catch (error) {
        console.log("NEWS DELETE ERROR ", error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }



}

export const sendEmail = async (req, res) => {
    const news = await prisma.news.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    profile: true
                }
            }
        }
    });

    const response = await mailSender(process.env.MAIL_USER, "News Today", news);

    return res.status(200).json({
        success: true,
        message: "Mail Sent"
    });
}