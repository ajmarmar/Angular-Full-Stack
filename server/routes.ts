import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import config from './config/config';
import CatCtrl from './controllers/cat';
import UserCtrl from './controllers/user';
import Cat from './models/cat';
import User from './models/user';

export default function setRoutes(app) {
  const routeNoSecure = express.Router();
  const routeSecure = express.Router();

  const catCtrl = new CatCtrl();
  const userCtrl = new UserCtrl();

  // Cats
  routeSecure.use(validateJWT);
  routeSecure.route('/cats').get(catCtrl.getAll);
  routeSecure.route('/cats/:page/:limit/:sort').get(catCtrl.list);
  routeSecure.route('/cats/count').get(catCtrl.count);
  routeSecure.route('/cat').post(catCtrl.insert);
  routeSecure.route('/cat/:id').get(catCtrl.get);
  routeSecure.route('/cat/:id').put(catCtrl.update);
  routeSecure.route('/cat/:id').delete(catCtrl.delete);



  // Users
  routeNoSecure.route('/login').post(userCtrl.login);
  routeNoSecure.route('/user/register').post(userCtrl.insert);
  
  routeSecure.route('/logout').post(userCtrl.logout);
  routeSecure.route('/users').get(userCtrl.getAll);
  routeSecure.route('/users/:page/:limit/:sort').get(userCtrl.list);
  routeSecure.route('/users/count').get(userCtrl.count);
  routeSecure.route('/user').post(userCtrl.insert);
  routeSecure.route('/user/:id').get(userCtrl.get);
  routeSecure.route('/user/:id').put(userCtrl.update);
  routeSecure.route('/user/:id').delete(userCtrl.delete);

  // Apply the routes to our application with the prefix /api
  app.use('/api', routeNoSecure);
  app.use('/api', routeSecure);
}

function validateJWT (req,res,next){
  //var token = req.body.token || req.headers.authorization;
  var bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== 'undefined') {
      var token = bearerHeader.split(" ")[1];
      if (token){
        jwt.verify(token, config.jwtSecret, function(err, decode){
          if (err){
            res.status(403).json({code: 403, message: 'Invalid Token'});
          }else{
            req.decode=decode;
            next();
          }
        });
      } else {
        res.status(403).json({code: 403, message: 'Invalid Token'});
      }
    } else {
      res.status(403).json({code: 403, message: 'Invalid Token'});
    }
}
