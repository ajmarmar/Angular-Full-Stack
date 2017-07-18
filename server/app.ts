import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as path from 'path';
import * as compress from 'compression';
import * as cors from 'cors'
import * as helmet from 'helmet';
import * as multer from 'multer';
import * as serveStatic from 'serve-static';
import setRoutes from './routes';

const app = express();

dotenv.load({ path: '.env' });

const upload = multer({ dest: process.env.UPLOAD_DIR || 'uploads/' })
app.set('port', (process.env.PORT || 3000));

//http://expressjs.com/es/guide/migrating-4.html
//app.use('/', express.static(path.join(__dirname, '../public')));
app.use(serveStatic(path.join(__dirname, '../public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(compress());
app.use(helmet());
app.use(cors());

app.use(morgan('dev'));

mongoose.connect(process.env.MONGODB_URI,{useMongoClient:true});
const db = mongoose.connection;
(<any>mongoose).Promise = global.Promise;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');

  setRoutes(app);

  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  app.listen(app.get('port'), () => {
    console.log('Angular Full Stack listening on port ' + app.get('port'));
  });

});

export { app };
