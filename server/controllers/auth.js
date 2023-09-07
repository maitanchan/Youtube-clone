import User from "../models/User.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { createError } from "../error.js";

export const register = async (req, res, next) => {

    try {

        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(req.body.password, salt)

        const newUser = new User({
            ...req.body,
            password: hashedPassword
        })

        await newUser.save()

        res.status(200).json("Tạo tài khoản thành công")

    } catch (err) {

        next(createError(403, "Thông tin tài khoản hoặc email đã có người sử dụng"))

    }


}

export const login = async (req, res) => {

    try {

        const user = await User.findOne({

            name: req.body.name

        })

        if (!user)
            return next(createError(404, "Thông tin tài khoản hoặc mật khẩu không chính xác"))

        const isCorrectPassword = bcrypt.compare(req.body.password, user.password)

        if (!isCorrectPassword)
            return next(createError(404, "Thông tin tài khoản hoặc mật khẩu không chính xác"))

        const token = jwt.sign({ id: user._id }, process.env.JWT)

        const { password, ...others } = user._doc

        res.cookie("access_token", token, { httpOnly: true }).status(200).json(others)


    } catch (err) {

        next(err)

    }

}

export const googleAuth = async (req, res, next) => {

    try {

        const user = await User.findOne({

            email: req.body.email,

        })

        if (user) {

            const token = jwt.sign({ id: user._id }, process.env.JWT)

            res.cookie("access_token", token, { httpOnly: true }).status(200).json(user._doc)

        } else {

            const newUser = new User({

                ...req.body,
                fromGoogle: true

            })

            const savedUser = await newUser.save()

            const token = jwt.sign({ id: savedUser._id }, process.env.JWT)

            res.cookie("access_token", token, { httpOnly: true }).status(200).json(savedUser._doc)

        }

    } catch (err) {

        next(err)

    }

}