const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// I ran into errors with the newer version of handlebars and had to make the below change.
const { engine } = require('express-handlebars');

const helmet = require('helmet');
const session = require('express-session');
const router = require('./router.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;
const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/DomoMaker';

// Changed line to due deprecation of method and removed console statements
mongoose.connect(dbURI)
  .then()
  .catch();

const app = express();
app.use(helmet());
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  key: 'sessionid',
  secret: 'Domo_Arigato',
  resave: false,
  saveUninitialized: false,
}));
app.engine('handlebars', engine({ defaultLayout: '' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);

router(app);

app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  // console.log(`Listening on port ${port}`);
});
