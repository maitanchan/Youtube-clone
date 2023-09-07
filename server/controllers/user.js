import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const updateUser = async (req, res, next) => {

    if (req.params.id === req.user.id) {

        try {

            const userId = req.params.id

            const updatedUser = await User.findByIdAndUpdate(

                userId,
                {
                    $set: req.body
                },
                {
                    new: true
                },

            )

            const { password, ...others } = updatedUser._doc

            res.status(200).json(others)

        } catch (err) {

            next(err)

        }

    } else {

        return next(createError(401, "Bạn chỉ có thể thay đổi thông tin tài khoản của bạn"))

    }

}

export const deleteUser = async (req, res, next) => {

    if (req.params.id === req.user.id) {

        try {

            const userId = req.params.id

            await User.findByIdAndDelete(userId)

            res.status(200).json("Xóa tài khoản thành công")

        } catch (err) {

            next(err)

        }

    } else {

        return next(createError(401, "Bạn chỉ có thể xóa thông tin tài khoản của bạn"))

    }

}

export const getUser = async (req, res, next) => {

    try {

        const userId = req.params.id

        const user = await User.findById(userId)

        const { password, ...others } = user._doc

        res.status(200).json(others)

    } catch (err) {

        next(err)

    }

}

export const subscribe = async (req, res, next) => {

    try {

        await User.findByIdAndUpdate(

            req.user.id,
            {
                $addToSet: {
                    subscribedUsers: req.params.id
                }
            }
        )

        await User.findByIdAndUpdate(

            req.params.id,
            {
                $inc: {
                    subscribers: 1
                },
            },

        )

        res.status(200).json("Đăng ký thành công")

    } catch (err) {

        next(err)

    }

}

export const unSubscribe = async (req, res, next) => {

    try {

        await User.findByIdAndUpdate(

            req.user.id,
            {
                $pull: {
                    subscribedUsers: req.params.id
                },
            },

        )

        await User.findByIdAndUpdate(

            req.params.id,
            {
                $inc: {
                    subscribers: -1
                },
            },

        )

        res.status(200).json("Hủy đăng ký thành công")

    } catch (err) {

        next(err)

    }


}

export const like = async (req, res, next) => {

    try {

        const id = req.user.id
        const videoId = req.params.videoId

        await Video.findByIdAndUpdate(

            videoId,
            {
                $addToSet: {
                    like: id
                },

                $pull: {
                    dislike: id
                },
            },

        )

        res.status(200).json("Video vừa được thích")

    } catch (err) {

        next(err)

    }
}

export const disLike = async (req, res, next) => {

    try {

        const id = req.user.id
        const videoId = req.params.videoId

        await Video.findByIdAndUpdate(

            videoId,
            {
                $addToSet: {
                    dislike: id
                },

                $pull: {
                    like: id
                },
            },

        )

        res.status(200).json("Video vừa được bỏ thích")

    } catch (err) {

        next(err)

    }

}