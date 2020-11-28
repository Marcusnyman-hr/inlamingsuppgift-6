const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const directives = require('./cspdir.js')
const path = require('path');
//import routes
const authRoute = require('./routes/auth');
const moneyRoute = require('./routes/money')
//env
dotenv.config();

const PORT = process.env.PORT || 5000

//Import routes and connect to database:
mongoose.connect(process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log('Connected to the database')
  });

//middlewares
app.use(express.json())
app.use(cors());
app.use(
  helmet.contentSecurityPolicy({ directives: directives })
);

//Serve static assets if in prod
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, './client/build')));
}


//routemiddlewares
app.use('/api/user', authRoute);
app.use('/api/money', moneyRoute);

app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

//start the server
module.exports = app.listen(PORT, () => console.log(`Server started on ${PORT}`));


