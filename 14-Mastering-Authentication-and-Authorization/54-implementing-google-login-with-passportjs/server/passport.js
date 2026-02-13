import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";

passport.use(
  new GoogleStrategy(
    {
      clientID: "<client_id>",
      clientSecret: "<client_secret>",
      callbackURL: "http://localhost:8080/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    },
  ),
);
