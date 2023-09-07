import jwt from 'jsonwebtoken'
import { createError } from './error.js'

export const verifyToken = (req, res, next) => {

    const token = req.cookies.access_token

    if (!token)
        return next(createError(401, "Bạn chưa đăng nhập"))

    jwt.verify(token, process.env.JWT, (err, user) => {

        if (err) {

            return next(createError(403, "Mã cookie không hợp lệ"))

        } else {

            req.user = user

        }

        next()

    })
}