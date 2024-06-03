import { Router } from "express";
import PostController from "../controller/PostController.js";
import authMiddleware from "../middleware/AuthMiddleware.js";

const router = Router();

router.get("/getpost", PostController.index);
router.post("/post",authMiddleware,PostController.store);

router.get("/home",(req,res) => {
    console.log("lllllllllllllllllllllllllllllllllllllll")
 res.send("Hellooooooooo")
})

export default router;