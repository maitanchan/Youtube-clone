import { createError } from "../error.js"
import User from "../models/User.js"
import Video from "../models/Video.js"

//Add video
export const addVideo = async (req, res, next) => {

    try {

        const newVideo = new Video({

            ...req.body,
            userId: req.user.id

        })

        const savedVideo = await newVideo.save()

        res.status(200).json(savedVideo)

    } catch (err) {

        next(err)

    }

}

//Update video
export const updateVideo = async (req, res, next) => {

    try {

        const video = await Video.findById(req.params.id)

        if (!video)
            return next(createError(404, "Không tìm thấy video"))

        if (req.user.id === video.userId) {

            const updatedVideo = await Video.findByIdAndUpdate(

                req.params.id,
                {
                    $set: req.body
                },
                {
                    new: true
                },

            )

            res.status(200).json(updatedVideo)

        } else {

            next(createError(401, "Bạn chỉ có thể thay đổi video của bạn"))

        }


    } catch (err) {

        next(err)

    }

}

//Delete video
export const deleteVideo = async (req, res, next) => {

    try {

        const video = await Video.findById(req.params.id)

        if (!video)
            return next(createError(404, "Không tìm thấy video"))

        if (req.user.id === video.userId) {

            await Video.findByIdAndDelete(req.params.id)

            res.status(200).json("Xóa video thành công")

        } else {

            next(createError(401, "Bạn chỉ có thể xóa video của bạn"))

        }


    } catch (err) {

        next(err)

    }

}

//Get a video
export const getVideo = async (req, res, next) => {

    try {

        const video = await Video.findById(req.params.id)

        res.status(200).json(video)

    } catch (err) {

        next(err)

    }

}

//Add view
export const addView = async (req, res, next) => {

    try {

        await Video.findByIdAndUpdate(

            req.params.videoId,
            {
                $inc: {
                    views: 1
                },
            },
        )

        res.status(200).json("Lượt xem đã được tăng lên")

    } catch (err) {

        next(err)

    }

}

// Get trend video
export const trend = async (req, res, next) => {

    try {

        const videos = await Video.find().sort(

            {
                views: -1
            },

        )

        res.status(200).json(videos)

    } catch (err) {

        next(err)

    }

}

// Get random video
export const random = async (req, res, next) => {

    try {

        const videos = await Video.aggregate([

            {
                $sample: {
                    size: 30
                },
            },
        ]

        )

        res.status(200).json(videos)

    } catch (err) {

        next(err)

    }

}

// Get subscribed video
export const sub = async (req, res, next) => {

    try {

        const user = await User.findById(req.user.id)

        const subscribeChannels = user.subscribedUsers

        const list = await Promise.all(

            subscribeChannels.map(async (channelId) => {

                return await Video.find(

                    {
                        userId: channelId
                    },

                )

            })

        )

        res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt))

    } catch (err) {

        next(err)

    }

}

// Get tags video
export const getByTags = async (req, res, next) => {

    try {

        const tags = req.query.tags.split(",")

        const videos = await Video.find(

            {
                tags: {
                    $in: tags
                },
            },

        ).limit(20)

        res.status(200).json(videos)

    } catch (err) {

        next(err)

    }

}

// Get video from title (search)
export const search = async (req, res, next) => {

    try {

        const query = req.query.q

        const videos = await Video.find(

            {
                title: {
                    $regex: query,
                    $options: "i"
                },
            },

        ).limit(40)

        res.status(200).json(videos)

    } catch (err) {

        next(err)

    }

}

