import * as dotenv from 'dotenv';
import * as Joi from 'joi';

// require and configure dotenv, will load vars in .env in PROCESS.ENV
// require('dotenv').config();
dotenv.load({ path: '.env' });

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  PORT: Joi.number().default(3000),
  MONGOOSE_DEBUG: Joi.boolean()
    .when('NODE_ENV', {
      is: Joi.string().equal('development'),
      then: Joi.boolean().default(true),
      otherwise: Joi.boolean().default(false)
    }),
  SECRET_TOKEN: Joi.string().required()
    .description('JWT Secret required to sign'),
  JWT_TOKEN_EXPIRATION_TIME: Joi.string()
    .default('1h'),
  MONGODB_URI: Joi.string().required()
    .description('Mongo DB host url'),
  UPLOAD_DIR: Joi.string().default('uploads/'),
  MAX_FILE_SIZE: Joi.number().default(1048576)
}).unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  jwtSecret: envVars.SECRET_TOKEN,
  jwtTimeExpiration: envVars.JWT_TOKEN_EXPIRATION_TIME,
  mongo: {
    connection: envVars.MONGODB_URI,
  },
  uploadDirectory: envVars.UPLOAD_DIR,
  maxFileSize: envVars.MAX_FILE_SIZE
};
// console.log('ocnfig: '+config);

export default config;
