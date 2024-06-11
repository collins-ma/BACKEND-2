const bcrypt=require('bcrypt');
const User=require('../model/User');
const asyncHandler=require('express-async-handler');
const jwt=require('jsonwebtoken');


const handleLogin = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundUser = await User.findOne({ username }).exec()

    if (!foundUser) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) return res.status(401).json({ message: 'Unauthorized' })
        const roles = foundUser.roles;
    console.log(roles)

    const accessToken = jwt.sign(
        { 
            username: foundUser.username,
            roles: roles  // Include roles in the token payload
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }

    )
    console.log(accessToken)

    const refreshToken = jwt.sign(
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
    )
    foundUser.refreshToken=refreshToken
    await foundUser.save()
    
   

    // Create secure cookie with refresh token 
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server 
        sameSite: 'None',
        secure:true,
        maxAge: 1 * 24 * 60 * 60 * 1000 //cross-site cookie 
      
    })

    // Send accessToken containing username and roles 
    res.json({ roles, accessToken })
})
module.exports={handleLogin}