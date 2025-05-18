import { PassportStatic } from 'passport';
import { Strategy } from 'passport-local';
import { User } from '../model/User';

export const configurePassport = (passport: PassportStatic): PassportStatic => {

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser((id: string, done) => {
  User.findById(id).then(user => {
    done(null, user); 
  }).catch(err => {
    done(err, null);
  });
});

passport.use('local', new Strategy({ usernameField: 'username' }, (username, password, done) => {
    User.findOne({ email: username }).then(user => {
        if (!user) {
            return done(null, false, { message: 'Nincs ilyen felhasználó' });
        }

        user.comparePassword(password, (error, isMatch) => {
            if (error) return done(error);
            if (!isMatch) return done(null, false, { message: 'Hibás jelszó' });

            return done(null, user);
        });
    }).catch(error => done(error));
}));


    return passport;
}