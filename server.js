import express from "express";
import path from "path";
import conf from "./conf/conf.js";
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import announcementRoutes from "./routes/announcement.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import productRoutes from "./routes/product.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import orderRoutes from "./routes/order.routes.js";
import bookRoutes from "./routes/Bookservices.routes.js";
//import complaintRoutes from "./routes/complaint.routes.js"

import dotenv from "dotenv";
// import { v2 as cloudinary } from "cloudinary";

// dotenv.config()
// cloudinary.config({
//   cloud_name: conf.CLOUDINARY_CLOUD_NAME,
//   api_key: conf.CLOUDINARY_API_KEY,
//   api_secret: conf.CLOUDINARY_API_SECRET,
// });

const app = express();
const PORT = conf.PORT || 8000;
// const __dirname = path.resolve();
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "/frontend/dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
//   });
// }

app.use("/auth", authRoutes);
app.use("/announcement", announcementRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/service", serviceRoutes);
app.use("/product", productRoutes);
app.use("/blogs", blogRoutes);
app.use("/bookService", bookRoutes);
// app.use("/complaint", complaintRoutes);
app.use("/orders", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});
