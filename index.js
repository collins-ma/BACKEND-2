const express=require("express")
const path=require('path')
const cors=require('cors')
const mongoose=require("mongoose")
const errorHandler=require('./middleware/errorHandler')
const app=express();
const cookieParser = require('cookie-parser')
const connectDB=require('./mongo/conn')
const corsOptions=require('./config/corsOptions');


app.use(express.json())



app.use(cookieParser()); 


const port=process.env.PORT||3500
app.use(cors(corsOptions))





app.use('/User', require('./routes/route'))
app.use('/register', require('./register'))
app.use('/auth',require('./auth'))
app.use('/logout', require('./logout'))
app.use('/refresh', require('./refresh'))

app.use('/Note', require('./notesRoutes/notesTestRoutes'))

  

connectDB()
app.use(errorHandler)


app.use('/', express.static(path.join(__dirname, '/public')))
app.use('/', require('./router/root'))
app.all('*', (req, res)=>{
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    }
    else if(req.accepts('json')){
        res.json({message:'404 Not Found'})
    }
    else{
        res.type('txt').send('404 Not Found')
    }


})

app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
mongoose.connection.once('open',()=>{
    console.log('Connected to MongoDb')
    app.listen(port, ()=>{

        console.log(`Server running on port ${port}`)
        
    })

})
mongoose.connection.on('error',error=>{
    console.log('Error in Connecting MongoDb', error)

} )



// mongoose.connection.once('open',()=>{
//     console.log('Connected to MongoDb')

// })









