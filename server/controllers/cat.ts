import * as fs from 'fs';
import * as path from 'path';
import config from '../config/config';
import Cat from '../models/cat';
import BaseCtrl from './base';

export default class CatCtrl extends BaseCtrl {
  model = Cat;

  delete = (req, res) => {
    this.model.findOneAndRemove({ _id: req.params.id }, (err, catDeleted) => {
      if (err) {
        console.error(err);
        res.status(500).json({code: 500, message: 'Error to delete model ' + this.model.modelName});
      } else {
        if (catDeleted.image) {
          const pathFile = path.join(__dirname, '../../../' + config.uploadDirectory) + catDeleted.image;
          fs.stat(pathFile, function (errStat, stats) {
             if (errStat) {
                 return console.error(errStat);
             }

             fs.unlink(pathFile, function(errUnLink) {
                  if (errUnLink) {return console.log(errUnLink)};
                  console.log('file deleted successfully');
             });
          });
        } else {
          console.log('No exist image from cat');
        }
        res.json({code: 200, message: 'Delete success'});
      }
    });
  };

}
