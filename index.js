import "dotenv/config";
import "./src/database/db.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./src/routes/auth.routes.js";
import postRouter from "./src/routes/post.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;
const WHITELIST = [process.env.ORIGIN_FRONTEND, undefined];

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: function (origin, callback) {
            if (WHITELIST.includes(origin)) {
                return callback(null, origin);
            }
            return callback("CORS error: " + origin + " unauthorized origin");
        },
    })
);

app.use("/api/uploads", express.static("uploads"));
app.use("/api/auth", authRouter);
app.use("/api/gallery", postRouter);

app.listen(PORT, () => {
    console.log("http://localhost:" + PORT);
});
