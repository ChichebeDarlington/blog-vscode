const express = require("express");
const mongoose = require("mongoose")
const Blog = require("./models/blog.js")

require("dotenv").config()

const app = express();

// mongoose connection
const port = process.env.PORT || 5000
mongoose.connect(process.env.MONGO_URI)
    .then((result)=>app.listen(process.env.PORT, ()=>console.log(`DB CONNECT @ port ${port}`)))
    .catch((error)=>console.log(error))

// Register view engine
app.set("view engine", "ejs")

// middlewares
app.use(express.static("public"))
app.use(express.urlencoded({extended:true}))

// blog routes
// app.get("/add-blog", (req, res)=>{
//     const blog = new Blog({
//         title: "No longer at ease",
//         snippet: "About a nation called Nigeria",
//         body: "It is really no longer at ease"
//     })
//         blog.save().then(result => res.json(result)).catch(error => console.log(error))
// })
//
// app.get("/all-blogs", (req, res)=>{
//     Blog.find()
//         .then(result=> res.send(result))
//         .catch(error=>console.log(error))
// })
//
// app.get("/single-blog", (req, res)=>{
//     Blog.findById("64208395173b34441b7a1bf8")
//         .then(result=> res.send(result))
//         .catch(error=>console.log(error))
// })

// route
app.get('/', (req, res) => {
    // const blogs = [
    //     {title:"Mazi is a bad programmer", snippet:"It does't matter how long it takes, job is assured"},
    //     {title:"Okeke is a bad content creator", snippet:"I can create all kinds of content"},
    //     {title:"Okonwo is the actor of things fall apart", snippet:"Chinua Achebe is a prophet you can say that"},
    //     {title:"Chukwu is the creator of heaven and earth", snippet:"God is the greatest, no doubt"}
    // ]
    //
    // const noBlog = "Blog post is empty"
    //
    // res.render(`index`, {title:"Home page", blogs, noBlog});
    res.redirect("/blogs")
});

app.get('/about', (req, res) => {
    res.render(`about`, {title:"About page"});
});


// blog routes
app.get("/blogs", (req, res)=>{
   Blog.find()
       .sort({createdAt:-1})
       .then(result => {
           res.render("index", {title: "All blogs", blogs:result})
       })
       .catch(error => console.log(error))
})

app.post("/blogs", (req, res)=>{
    const blog = new Blog(req.body)
        blog.save()
            .then(result => res.redirect("/blogs"))
            .catch(error => console.log(error))
})

app.delete("/blogs/:_id", (req,res)=>{
    const _id = req.params._id;
    Blog.findByIdAndDelete(_id)
        .then(result =>{
            res.json( {redirect: "/blogs"})
        })
        .catch(error => console.log(error))
})

app.get('/blogs/create', (req, res) => {
    res.render(`createBlog`, {title:"Create blog"});
});

app.get("/blogs/:_id", (req,res)=>{
    const _id = req.params._id;
    Blog.findById(_id)
        .then(result =>{
            res.render("details", {blog: result, title: "Blog details"})
        })
        .catch(error => console.log(error.message))
})

app.get("/blogs/:_id", (req,res)=>{
    const _id = req.params._id;
    Blog.findByIdAndUpdate(_id, {new:true})
        .then(result =>{
            res.render("details", {blog: result, title: "Blog details"})
        })
        .catch(error => console.log(error.message))
})

// 404 routes
app.use( (req, res) => {
    res.status(404).render(`404`, {title: "Not found"});
});

module.exports = app