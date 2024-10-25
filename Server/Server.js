const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const employees = require('./models/User');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
}
const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}
require('dotenv').config();
// app.use(express.static(path.join(__dirname, 'client/build')));
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
//   });

app.use(cookieParser());

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    credentials: true // Allow cookies to be sent
}));
connectDB();


app.get('/', (req, res) => {
    res.json('This is an Example API');
})

// Routes
app.use('/employee', require('./routes/userRoutes'));
app.use('/tasks', require('./routes/taskRoutes'));
app.use('/events', require('./routes/eventRoutes'));
app.use('/team', require('./routes/teamRoutes'));

// O-Auth Integration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === 'production' ? 'https://emp-flow-etm-u6a2.vercel.app/employee/auth/google/callback' : '/employee/auth/google/callback'
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await employees.findOne({ userID: profile.displayName }); // Use name or profile.emails[0].value

            if (!user) {
                // If user does not exist, create a new one with no password (since it's OAuth)
                user = new employees({
                    userID: profile.displayName, // Use profile.displayName or profile.emails[0].value if emails are used
                    password: null,              // No password since it's OAuth
                    role: 'Team Member'                 // Default role, or customize based on your needs
                });
                await user.save();
            }
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    }
));
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await employees.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
//app.use(passport.session());

app.use(passport.initialize());
app.get('/employee/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

app.get('/employee/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: process.env.NODE_ENV === 'production'
            ? 'https://emp-flow-etm.vercel.app/login'
            : 'http://localhost:5173/login',
        session: false
    }),
    (req, res) => {
        // Successful authentication, redirect to home or generate token
        const accessToken = createAccessToken({ id: req.user._id, role: req.user.role });
        const refreshToken = createRefreshToken({ id: req.user._id, role: req.user.role });
        // res.cookie('accessToken', accessToken, {
        //   httpOnly: true,
        //   sameSite: 'None',
        //   secure: true
        // });
        res.cookie('refreshtoken', refreshToken, {
            httpOnly: true,
            sameSite: 'Strict',
            path: '/employee/refresh_token',
            secure: process.env.NODE_ENV === 'production'
        });

        // Send access token to the client
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true
        });
        //   res.json({
        //     accessToken,
        //     message: 'Authentication successful'
        //   });
        res.redirect(process.env.NODE_ENV === 'production'
            ? 'https://emp-flow-etm.vercel.app/dashboard'
            : 'http://localhost:5173/dashboard');
    }
);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

