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
          const pathFile = path.join(__dirname, '../../../'+ config.uploadDirectory) + catDeleted.image;
          fs.stat(pathFile, function (err, stats) {
             console.log(stats);//here we got all information of file in stats variable

             if (err) {
                 return console.error(err);
             }

             fs.unlink(pathFile,function(err){
                  if(err) return console.log(err);
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
