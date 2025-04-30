const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../../models/userModels/user.model'); 

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists
                const existingUser = await User.findOne({ email: profile.emails[0].value });

                if (existingUser) {
                    return done(null, existingUser);
                }

                // If not, create a new user
                const newUser = await User.create({
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    mobile: 1234567890, // You can ask mobile later from user
                    address: "Default Address", // Same, ask or update later
                    password: Math.random().toString(36).slice(-8), // Random dummy password (won't be used actually)
                });

                return done(null, newUser);
            } catch (error) {
                console.error("Error in Google Strategy:", error);
                return done(error, null);
            }
        }
    )
);

// Serialize user into session
passport.serializeUser((user, done) => {
    done(null, user.id); // save only user id in session
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
