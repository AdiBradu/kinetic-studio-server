const express = require("express");
const dotenv = require("dotenv");
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session); 
const cors = require("cors");
const helmet = require("helmet");
const { graphqlHTTP } = require("express-graphql");
const schema = require('./schema');
const { orderDetailsDataLoader } = require('./dataLoaders/orderDetails');

const main = async () => {
  const app = express();  
  app.use(helmet({ contentSecurityPolicy: (process.env.NODE_ENV === 'PRODUCTION') ? undefined : false }));
  
  dotenv.config();

  app.use(express.json({limit: '50mb'}));
  app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

  var corsOptions = {
    origin: process.env.CLIENT_FOR_THE_API,
    optionsSuccessStatus: 200, 
    credentials: true
  }
  app.use(cors(corsOptions));

  app.set('etag', false);
  /* app.use(express.bodyParser({limit: '50mb'})); */
  //sessions
  const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    clearExpired: true,
    checkExpirationInterval: 900000,
    expiration: parseInt(process.env.SESS_MAX_AGE),
    createDatabaseTable: true,
    connectionLimit: 1,
    endConnectionOnClose: true,
    charset: 'utf8mb4_bin'});

  app.set('trust proxy', 1); 

  app.use(session({
    key: 'ks_s',
    secret: process.env.SESS_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    unset: 'destroy',
    proxy: process.env.NODE_ENV === 'PRODUCTION',
    cookie: { 
      domain: process.env.SESS_COOKIE_DOMAIN,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'PRODUCTION',
      maxAge: parseInt(process.env.SESS_MAX_AGE),

    }
  }));

  app.use(
    "/graphql",  
    graphqlHTTP((req, res, graphQLParams) => {
      return {
        schema: schema,
        graphiql: process.env.NODE_ENV !== 'PRODUCTION',
        context: {
          loaders: {
            orderDetailsLoader: orderDetailsDataLoader()
          },
          req
        }
      }
    })
  );
 
  const port = Number(process.env.PORT || 3311);
   
  //starting the server
  app.listen(port, () => 
  console.log(`Server running on port ${port}!`)
  );
}

main().catch((err) => {
  console.log(err);
});

