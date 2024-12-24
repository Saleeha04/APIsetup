const express = require('express');
const User = require('./model');
const UserAuth = require('./user');
const router = express.Router();
const bcrypt = require('bcrypt');

router.use((req, res, next) => {
    if (!req.session.viewCount) {
        req.session.viewCount = 0;
    }
    req.session.viewCount++;
    console.log(`View count: ${req.session.viewCount}`);
    next();
});

router.use(express.urlencoded({
    extended: true
}))

router.get('/secret', (req, res) => {
    if (!req.session.user_id) {
        res.redirect('/login');
    }
    else {
        res.render('secret');
    }
});

router.get('/', (req, res) => {
    res.send('This is the home page');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { username , password } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = new UserAuth({
        username, password: hash
    });
    await user.save();
    req.session.user_id = user._id;
    res.redirect('/');
});

router.get('/login', (req , res) => {
    res.render('login');
})

router.post('/login',async (req , res) => {
    const {username, password } = req.body;
    const user = await UserAuth.findOne({username});
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
        req.session.user_id = user._id;
        res.redirect('/secret');
    }
    else {
        res.redirect('/login');
    }
});

router.post('/logout', (req, res) => {
    req.session.user_id = null;
    res.redirect('/');
})

router.post('/users', async (req, res) => {
    try {
        const { name, address, number } = req.body;
        if (!name || !address || isNaN(number)) {
            return res.status(400).send('Invalid Input');
        }
        const user = new User({ name, address, number });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(400).send('User not Found');
        }
        res.json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.put('/users/:id', async (req, res) => {
    try {
        const { name, address, number } = req.body;
        if (!name || !address || isNaN(number)) {
            return res.status(400).send('Invalid input');
        }
        const user = await User.findByIdAndUpdate(req.params.id, { name, address, number }, { new: true });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send(`User with ID ${req.params.id} deleted.`);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Route to display session view count
router.get('/view-count', (req, res) => {
    res.send(`You have viewed the routes ${req.session.viewCount} times.`);
});

module.exports = router;
