import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import web from "./routers/web.js";
import connectDb from "./db/connectDb.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.RequestPort,
  })
);
app.use(cookieParser());

app.use(express.json());
connectDb(process.env.DATABASE_URL);
const port = process.env.PORT;

app.use("/", web);
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
