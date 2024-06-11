const express=require("express")
const router=express.Router()
const apiControllers=require('../api/apiControllers')
const verifyJWT=require('../middleware/verifyJWT')


router.route('/')
.post(apiControllers.createNewUser)
.get(verifyJWT,apiControllers.getAllUsers)
.patch(apiControllers.updateUser)
.delete(apiControllers.deleteUser)

router.get('/:id', apiControllers.getUser)


module.exports=router




