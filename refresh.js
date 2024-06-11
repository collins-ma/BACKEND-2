const express=require('express')
const router=express.Router()
const tokenController=require('./tokenController/handleRefreshToken')


router.get('/', tokenController.handleRefreshToken)

module.exports=router