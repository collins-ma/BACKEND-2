const express=require('express')
const router=express.Router()
const logoutController=require('./logoutController/handleLogout')

router.get('/', logoutController.handleLogout)

module.exports=router