const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const routes = require('./routes');

const app = express();
const PORT = 3000;
const mongoURI = 'mongodb://localhost:27017/users';

app.set('view engine', 'ejs');
app.set('views' , 'views');

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Configure session
app.use(session({
    secret: 'sp23-bse-146', // Replace with a secure string
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: true,
        secure: false,
    },
}));

app.get('/set-session-cookie', (req, res) => {
    req.session.user = { name: 'John Doe', role: 'Student' };
    res.cookie('testCookie', 'cookieValue', { maxAge: 1000 * 60 * 60, httpOnly: true });
    res.send('Session and cookie set.');
});

app.get('/get-session-cookie', (req, res) => {
    const sessionUser = req.session.user || 'No session data';
    const testCookie = req.cookies.testCookie || 'No cookie';
    res.json({ session: sessionUser, cookie: testCookie });
});

app.get('/destroy-session-cookie', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send('Error destroying session');
        res.clearCookie('testCookie');
        res.send('Session and cookie destroyed.');
    });
});

// app.use((req, res, next) => {
//     if (req.query.isAdmin) {
//         next();
//     } else {
//         res.status(403).send("Access denied: User is not an Admin.");
//     }
// });

// Routes
app.use('/', routes);

// MongoDB connection
mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
