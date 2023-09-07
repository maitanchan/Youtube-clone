import express from 'express'
import { googleAuth, login, register } from '../controllers/auth.js'


const router = express.Router()

//Register
router.post("/register", register)

//Login
router.post("/login", login)

//Login with Google account
router.post("/google", googleAuth)

export default router