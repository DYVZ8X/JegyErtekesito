import { Router, Request, Response, NextFunction } from 'express';
import { MainClass } from '../main-class';
import { PassportStatic } from 'passport';
import { User } from '../model/User';


export const configureRoutes = (passport: PassportStatic, router: Router): Router => {

    router.get('/', (req: Request, res: Response) => {
        let myClass = new MainClass();
        res.status(200).send('Hello, World!');
    });

    router.get('/callback', (req: Request, res: Response) => {
        let myClass = new MainClass();
        myClass.monitoringCallback((error, result) => {
            if (error) {
                res.write(error);
                res.status(400).end();
            } else {
                res.write(result);
                res.status(200).end();
            }
        });
    });

    router.get('/promise', async (req: Request, res: Response) => {
        let myClass = new MainClass();
        // async-await
        try {
            const data = await myClass.monitoringPromise();
            res.write(data);
            res.status(200).end();
        } catch (error) {
            res.write(error);
            res.status(400).end();
        }
    });


    router.get('/observable', (req: Request, res: Response) => {
        let myClass = new MainClass();
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        res.setHeader('Transfer-Encoding', 'chunked');

        myClass.monitoringObservable().subscribe({
            next(data: string) {
                res.write(data);
            }, error(error: string) {
                res.status(400).end(error);
            }, complete() {
                res.status(200).end();
            }
        });
    });

    router.post('/login', (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (error:any, user:any, info:any) => {
        if (error) {
        return res.status(500).send(error);
        }
        if (!user) {
        return res.status(401).send(info?.message || 'Incorrect username or password');
        }

        req.login(user, (err) => {
        if (err) {
            return res.status(500).send('Internal server error');
        }
        return res.status(200).send(user);
        });
    })(req, res, next);
    });

    router.post('/register', (req: Request, res: Response) => {
        console.log('Received body:', req.body);
    
    const { email, password, name, address, nickname, permission } = req.body;

    const user = new User({ email, password, name, address, nickname, permission: permission || 'user' });

        user.save()
            .then(data => {
                console.log('User saved:', data);
                res.status(200).send(data);
            })
            .catch(error => {
                console.error('Error during save:', error);
                res.status(500).send(error);
            });
    });
    

    router.post('/logout', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            req.logout((error) => {
                if (error) {
                    console.log(error);
                    res.status(500).send('Internal server error.');
                }
                res.status(200).send('Successfully logged out.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    router.get('/getAllUsers', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const query = User.find();
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

router.get('/adminOnly', (req: Request, res: Response) => {
    if (req.isAuthenticated() && (req.user as any).permission === 'admin') {
        res.status(200).send('Approved access');
    } else {
        res.status(403).send('Forbidden: Admins only');
    }
});


router.get('/checkAuth', (req: Request, res: Response) => {
    res.status(200).json(req.isAuthenticated());
});

router.get('/checkPermission', (req: Request, res: Response) => {
    if (req.isAuthenticated() && req.user) {
        const userId = req.user;
        User.findById(userId).then(user => {
            if (!user) {
                return res.status(404).send('User not found.');
            }
            res.status(200).send({ permission: user.permission });
        }).catch(err => {
            res.status(500).send('Database error.');
        });
    } else {
        res.status(401).send('Not authenticated.');
    }
});

router.get('/profile', (req: Request, res: Response) => {
    if (req.isAuthenticated() && req.user) {
        const user = req.user as any;

        res.status(200).json({
            email: user.email,
            name: user.name,
            address: user.address,
            nickname: user.nickname,
            permission: user.permission
        });
    } else {
        res.status(401).send('Not authenticated');
    }
});


    return router;
}