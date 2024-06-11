const User=require('../model/User')
const Note=require('../model/Note')
const asyncHandler=require('express-async-handler')

const bcrypt=require('bcrypt')

const getAllUsers = asyncHandler(async (req, res) => {
   
    // Get all users from MongoDB
  
    const users = await User.find().select('-password').sort({ createdAt: -1 }).lean()

    // If no users 
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }

    res.json(users)
}

)

const createNewUser=asyncHandler(async(req, res)=>{
    console.log("Request body:", req.body);
    const {username, password, roles }=req.body
    if(!username||!password) return res.status(400).json({message:'All fields are required'})

       

            const duplicate=await User.findOne({username})
            if(duplicate) return res.status(409).json({message:'Duplicate Username'})

            const hashedPwd=await bcrypt.hash(password, 10)
            console.log(`hashedpassword:${hashedPwd}`)

            const userObject = (!Array.isArray(roles) || !roles.length)
            ? { username, "password": hashedPwd }
            : { username, "password": hashedPwd, roles }
    
       
            const user = await User.create(userObject)

            if (user) { //created 
                res.status(201).json({ message: `New user ${username} created` })
            } else {
                res.status(400).json({ message: 'Invalid user data received' })
            }
           


            

        })
      

        
        const updateUser = asyncHandler(async (req, res) => {
            console.log("Request body:", req.body);
        
            const { username, id, password, roles, active } = req.body;
        
            // Confirm data
            if (!username || !id || !Array.isArray(roles) || !roles.length) {
                return res.status(400).json({ message: 'All fields except password and active status are required' });
            }
        
            // Check if active is provided and is a boolean
            if (active !== undefined && typeof active !== 'boolean') {
                return res.status(400).json({ message: 'Active status must be a boolean' });
            }
        
            // Does the user exist to update?
            const user = await User.findById(id).exec();
            console.log(user);
        
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }
        
            // Check for duplicate (if applicable)
            // This part is commented out in your original code. Uncomment and implement if needed.
            // const duplicateUser = await User.findOne({ username });
            // if (duplicateUser && duplicateUser._id.toString() !== id) {
            //     return res.status(400).json({ message: 'Duplicate username' });
            // }
        
            user.username = username;
            user.roles = roles;
        
            if (password) {
                // Hash password
                user.password = await bcrypt.hash(password, 10); // salt rounds
            }
        
            if (active !== undefined) {
                user.active = active;
            }
        
            const updatedUser = await user.save();
        
            res.json({ message: `${updatedUser.username} updated` });
        });
      
        
      


        





const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body;

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' });
    }

    // Does the user still have assigned notes?
    const note = await Note.findOne({ user: id }).lean().exec();
    if (note) {
        return res.status(400).json({ message: 'User has assigned notes' });
    }

    // Does the user exist to delete?
    const user = await User.findById(id).exec();
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    const username = user.username; // Access the username before deleting the user

     await user.deleteOne();

    const reply = `Username ${username} with ID ${id} deleted`;

    res.json(reply);
})

const getUser = async (req, res) => {
    // Check if the note ID is provided in the request parameters
    if (!req?.params?.id) {
        return res.status(400).json({ message: 'Note ID required.' });
    }

    try {
        // Find the note by its ID in the database
        const note = await User.findById(req.params.id).exec();
        
        // If no note is found, return a 204 status with a message
        if (!note) {
            return res.status(204).json({ message: `No note matches ID ${req.params.id}.` });
        }

        // If the note is found, return it in the response
        res.json(note);
    } catch (error) {
        // Handle any errors that occur during the database query
        console.error('Error fetching note:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};




module.exports={
    createNewUser,
    updateUser,
    getAllUsers,
    deleteUser,
    getUser
}







