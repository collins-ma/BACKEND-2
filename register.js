const express=require('express')
const router=express.Router()
const newController=require('./newController/handleNewUser')

router.post('/', newController.handleNewUser)

module.exports=router















