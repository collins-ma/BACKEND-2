const express=require('express')
const router=express.Router()
const loginController=require('./loginController/handleLogin')
const limiter=require('./middleware/loginLimiter')
// const verifyJWT=require('./middleware/verifyJWT')

// router.route('/')
//     .post(loginLimiter, authController.login)

    router.post('/', limiter,loginController.handleLogin)
module.exports=router
