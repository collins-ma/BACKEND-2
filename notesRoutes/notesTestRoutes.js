const express=require('express')
const router=express.Router()
const notesControllers=require('../noteApi/notesControllers')

router.route('/')
.post(notesControllers.createNote)
.get(notesControllers.getNotes)
.patch(notesControllers.updateNote)
.delete(notesControllers.deleteNote)

router.get('/:id',notesControllers.getNote )
module.exports=router
