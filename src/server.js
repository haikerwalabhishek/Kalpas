import { config } from "dotenv";
config();

//Routes
import userRoutes from "./routes/User.route.js";
import bookRoutes from "./routes/Book.route.js";
import libraryRoutes from "./routes/Library.route.js";
import borrowerRoutes from "./routes/Borrow.route.js";
import langI18nMiddleware from "./middlewares/Langi18n.middleware.js";

//Upload Photo
import { upload, uploadImage } from "./utils/UploadImage.util.js";

//Importing Libraries
import express, { json, urlencoded } from "express";
import i18n from "i18n";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { existsSync, mkdirSync, createWriteStream } from "fs";
import { fileURLToPath } from "url";
import { join, dirname } from "path";
import connectDB from "./configs/DB.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Logs Directory
const logsDir = join(__dirname, "logs");
if (!existsSync(logsDir)) {
  mkdirSync(logsDir, { recursive: true });
}
const logStream = createWriteStream(join(logsDir, "API.log"), {
  flags: "a",
});

const app = express();

//CORS Options
const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

//Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(i18n.init);
app.use(langI18nMiddleware);
app.use(json());
app.use(compression());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(morgan("combined", { stream: logStream }));
app.use(morgan("combined"));
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Book Keeper API Server is Running!");
});

// Use Routes
app.post("/upload", upload.single("file"), uploadImage);
app.use("/api/users/", userRoutes);
app.use("/api/books/", bookRoutes);
app.use("/api/libraries/", libraryRoutes);
app.use("/api/", borrowerRoutes);

//Connecting DataBase
connectDB();

const IP = process.env.IP || "127.0.0.1";
const PORT = process.env.PORT || 4101;

app.listen(PORT, IP, () => {
  console.log(`server is running on http://${IP}:${PORT}`);
});
