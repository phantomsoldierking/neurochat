import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { translateText } from "../controllers/translate.controller.js"

const router = express.Router()

router.post("/", protectRoute, translateText)

export default router
