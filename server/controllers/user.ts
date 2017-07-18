import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

import User from '../models/user';
import BaseCtrl from './base';

export default class UserCtrl extends BaseCtrl {
  model = User;

  login = (req, res) => {
    this.model.findOne({ email: req.body.email }, (err, user) => {
      if (!user) { return res.status(403).json({code:403, message:'User or password is incorrect'}); }
      user.comparePassword(req.body.password, (error, isMatch) => {
        if (!isMatch) { return res.status(403).json({code:403, message:'User or password is incorrect'}); }
        const token = jwt.sign({ user: user }, process.env.SECRET_TOKEN, {
          expiresIn: process.env.JWT_TOKEN_EXPIRATION_TIME || '30m'
        });
        res.status(200).json({ token: token, user: user });
      });
    });
  };

  logout =(req, res) => {
    //TODO invalidate jwt token and redirect to '/'
  };

}
