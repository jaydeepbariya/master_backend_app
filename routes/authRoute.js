import { Router } from "express";
import { login, register } from "../controllers/AuthController.js";
import { getUser, updateProfile } from "../controllers/ProfileController.js";
import auth from "../middlwares/Auth.js";
import { sendEmail, createNews, deleteNews, getAllNews, getNews, updateNews } from "../controllers/NewsController.js";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);

router.get("/auth/profile", auth, getUser);
router.put("/profile/:id", auth, updateProfile);

router.post("/news", auth, createNews);
router.get("/news", getAllNews);
router.get("/news/:id", getNews);
router.put("/news/:id", auth, updateNews);
router.delete("/news/:id", auth, deleteNews);

router.post("/send-email", auth, sendEmail);

export default router;