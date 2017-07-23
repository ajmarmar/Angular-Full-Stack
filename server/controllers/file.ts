// getFile
import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import config from '../config/config';

export default class FileCtrl {

  private storage = multer.diskStorage({
      destination: function (req, file, cb) {
          cb(null, config.uploadDirectory);
      },
      filename: function (req, file, cb) {
          const datetimestamp = Date.now();
          cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
      }
  });

  private uploadMulter = multer({ storage: this.storage,
                          limits: { fileSize: config.maxFileSize }}).single('file');

  getFile = (req, res) => {
    // console.log(req.params.file);
    const pathFile = path.join(__dirname, '../../../' + config.uploadDirectory) + req.params.file;
    // console.log(pathFile);
    res.sendFile(pathFile);
  }

  upload = (req, res) => {
    this.uploadMulter(req, res, function(err){
        if (err) {
          res.status(400).json({code: 400, message: err});
        } else {
          res.json({fileName: req.file.filename});
        }
    });
  }
}
