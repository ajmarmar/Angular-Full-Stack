import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as path from 'path';
import * as compress from 'compression';
import * as cors from 'cors'
import * as helmet from 'helmet';
import * as serveStatic from 'serve-static';
import * as util from 'util';
import * as Promise from 'bluebird';
import setSocket from './socket';
import setRoutes from './routes';
import config from './config/config';

const app = express();
app.set('port', config.port);

// http://expressjs.com/es/guide/migrating-4.html
// app.use('/', express.static(path.join(__dirname, '../public')));
app.use(serveStatic(path.join(__dirname, '../public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(compress());
app.use(helmet());
app.use(cors());

if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('short'));
}

mongoose.connect(config.mongo.connection, {useMongoClient: true});
const db = mongoose.connection;
// (<any>mongoose).Promise = global.Promise;
(<any>mongoose).Promise = Promise;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');

  setRoutes(app);

  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  const server = app.listen(app.get('port'), () => {
    console.log('Angular Full Stack listening on port ' + app.get('port'));
  });

  setSocket(server);

});

if (config.mongooseDebug) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    console.log(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

export { app };
