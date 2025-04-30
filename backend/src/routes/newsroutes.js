import {createNews, getAllNews, getNewsById, deleteNews} from "../controllers/newscontroller.js";
import express from "express";

const router = express.Router();

router.post("/createnews", createNews);
router.get('/getallnews/:category', getAllNews);
router.get("/getnews", getNewsById);
router.delete("/deletenews", deleteNews);

export default router;