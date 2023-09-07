import express from 'express'
import { verifyToken } from '../verifyToken.js'
import { addVideo, addView, deleteVideo, getByTags, getVideo, random, search, sub, trend, updateVideo } from '../controllers/video.js'

const router = express.Router()

//create video
router.post("/", verifyToken, addVideo)

//update video
router.put("/:id", verifyToken, updateVideo)

//delete video
router.delete("/:id", verifyToken, deleteVideo)

//get a video
router.get("/find/:id", getVideo)

//add view for video
router.put("/view/:videoId", addView)

//get trend video
router.get("/trend", trend)

//get random video
router.get("/random", random)

//get sub video
router.get("/sub", verifyToken, sub)

//get tags video
router.get("/tags", getByTags)

//get video from title 
router.get("/search", search)

export default router