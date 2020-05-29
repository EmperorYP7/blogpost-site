const express = require('express');
const router = express.Router();
const Post = require('../models/posts');

router.get('/new', (req, res) => {
    res.render('posts/new', { post: new Post() });
});

router.get('/:slug', async (req, res) => {
    const post = await Post.findOne({ slug: req.params.slug });
    if (post == null) res.redirect('/');
    res.render('posts/show', { post: post });
});

router.delete('/:id', async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

router.get('/edit/:slug', async (req, res) => {
    const post = await Post.findOne({ slug: req.params.slug });
    res.render('posts/edit', { post: post });
});

router.put('/:slug', async (req, res, next) => {
    req.post = await Post.findOne({ slug: req.params.slug });
    next();
}, postCreateAndRedirect('edit'));

router.post('/', async (req, res, next) => {
    req.post = new Post();
    next();
}, postCreateAndRedirect('new'));

function postCreateAndRedirect(path) {
    return async (req, res) => {
        let post = req.post;
        post.title = req.body.title;
        post.description = req.body.description;
        post.markdown = req.body.markdown;
        try {
            post = await post.save();
            res.redirect(`/posts/${post.slug}`);
        } catch(err) {
            console.log(err);
            res.render(`posts/${path}`, { post: post });
        }
    };
};

module.exports = router;