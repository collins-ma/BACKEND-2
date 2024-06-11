const User=require('../model/User')
const bcrypt=require('bcrypt')

const handleNewUser=async(req, res)=>{
    const {username, password }=req.body
    if(!username||!password) return res.status(400).json({message:'All fields are required'})

        try{

            const duplicate=await User.findOne({username})
            if(duplicate) return res.status(409).json({message:'Duplicate Username'})

            const hashedPwd=await bcrypt.hash(password, 10)
            console.log(`hashedpassword:${hashedPwd}`)

            const userObject = { username, "password": hashedPwd }

    // Create and store new user 
            const user = await User.create(userObject)

            if (user) { //created 
                res.status(201).json({ message: `New user ${username} created` })
            } else {
                res.status(400).json({ message: 'Invalid user data received' })
            }
           


            

        }
        catch(error){
            console.log({'Error':error.message})
            console.log(error.stack)


        }



}

module.exports={handleNewUser}

