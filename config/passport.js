const JwtStrategy = require("passport-jwt").Strategy;
ExtractJwt = require("passport-jwt").ExtractJwt;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "secret";

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      Agency.findById(jwt_payload.id)
        .then((agency) => {
          if (agency) {
            return done(null, agency);
          }
          return done(null, false);
        })
        .catch((err) => console.log(err));
    })
  );
};
