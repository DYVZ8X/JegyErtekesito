import { PassportStatic } from 'passport';
import { Strategy } from 'passport-local';
import { User } from '../model/User';

export const configurePassport = (passport: PassportStatic): PassportStatic => {

passport.serializeUser((user: any, done) => {
  done(null, user._id); // Csak az ID-t tároljuk
});

passport.deserializeUser((id: string, done) => {
  User.findById(id).then(user => {
    done(null, user); // A teljes user objektum lesz elérhető
  }).catch(err => {
    done(err, null);
  });
});

    passport.use('local', new Strategy((username, password, done) => {
        const query = User.findOne({ email: username });
        query.then(user => {
            if (user) {
                user.comparePassword(password, (error, _) => {
                    if (error) {
                        done('Incorrect username or password.');
                    } else {
                        done(null, user._id);
                    }
                });
            } else {
                done(null, undefined);
            }
        }).catch(error => {
            done(error);
        })
    }));

    return passport;
}