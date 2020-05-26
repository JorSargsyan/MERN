const express = require("express")
const connectDb = require("./config/db")
const bodyParser= require('body-parser')
const path = require('path');

const app = express();

connectDb();

//Init Middleware 
app.use(express.json({extended:false}));
app.use(bodyParser.urlencoded({extended: true}))
// app.get("/",(req,res)=>{
//     res.send("API running");
// })


app.use("/api/users",require("./routes/api/users"));
app.use("/api/posts",require("./routes/api/posts"));
app.use("/api/auth",require("./routes/api/auth"));
app.use("/api/profile",require("./routes/api/profile"));

//serve static assets in production

if (process.env.NODE_ENV == 'production') {
    //set static folder
    app.use(express.static('client/build'));

    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server Started on port ${PORT}`);
});