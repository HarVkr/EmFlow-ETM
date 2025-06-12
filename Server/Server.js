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

const allowedOrigins = [
    'https://emp-flow-etm.vercel.app',      // Your frontend domain
    'https://emp-flow-etm-u6a2.vercel.app', // Your backend domain (if needed)
    'http://localhost:5173',                 // Local development
    'http://localhost:3000',                 // Alternative local port
    'http://localhost:5000'                  // Backend local port
];

// app.use(cors({
//     origin: 'https://emp-flow-etm.vercel.app', // Allow requests from this origin
//     credentials: true // Allow cookies to be sent
// }));
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
}));
// Add preflight handling for all routes
app.options('*', cors());

connectDB();


app.get('/', (req, res) => {
    res.json('This is an Example API');
})

// Add this after your existing CORS configuration
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'https://emp-flow-etm.vercel.app');
//     res.header('Access-Control-Allow-Credentials', 'true');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
//     if (req.method === 'OPTIONS') {
//         res.sendStatus(200);
//     } else {
//         next();
//     }
// });

// Routes
app.use('/employee', require('./routes/userRoutes'));
app.use('/tasks', require('./routes/taskRoutes'));
app.use('/events', require('./routes/eventRoutes'));
app.use('/team', require('./routes/teamRoutes'));
app.use('/tickets', require('./routes/ticketRoutes'));

// O-Auth Integration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === 'production' ? '/employee/auth/google/callback' : '/employee/auth/google/callback'
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

