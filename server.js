import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import "dotenv/config";
import authRouter from "./routes/authRoute.js";
import { cloudinaryConnect } from "./config/cloudinaryConfig.js";
import helmet from "helmet";
import limiter from "./config/rateLimitConfig.js";
import logger from "./config/logConfig.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
    return res.json({ message: "Hello Backend" });
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
);
app.use(express.static("public"));
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(helmet());
app.use(limiter);




app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

app.use("/api/v1/", authRouter);

cloudinaryConnect();

logger.log("info", "info level log added");
logger.log("error", "error level log added");