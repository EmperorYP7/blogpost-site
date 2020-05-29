const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Post = require('./models/posts');
const methodOverride = require('method-override');
const postRouter = require('./routes/post');
app.set('view engine', 'ejs');

//MONGODB
mongoose.connect('mongodb://localhost/blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

//ROUTES
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
    const posts = await Post.find().sort({ createdAt: 'desc' });
    res.render('posts/home.ejs', { posts: posts });
});

app.use('/posts', postRouter);

app.listen(3000);