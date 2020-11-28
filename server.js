const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
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
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "example.com"],
      objectSrc: ["'none'"],
      scriptSrcElem: ["'self'", "https://kit.fontawesome.com/"],
      styleSrcElem: ["'self'", "'https://fonts.googleapis.com/"],
      upgradeInsecureRequests: [],
    },
  })
);




// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       connectSrc: ["'self'", 'https://ka-f.fontawesome.com'],
//       frameSrc: ["'self'"],
//       childSrc: ["'self'"],
//       scriptSrc: ["'self'", "'unsafe-eval'", 'https://kit.fontawesome.com'],
//       styleSrc: [
//         "'self'",
//         "https://fonts.googleapis.com",
//         "https://kit.fontawesome.com"
//       ],
//       fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://ka-f.fontawesome.com'],
//       imgSrc: ["'self'"],
//       baseUri: ["'self'"],
//     },
//   })
// )
// app.use((req, res, next) => {
//   console.log('CSP', res.get('Content-Security-Policy'));
//   next();
// });

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
app.listen(PORT, () => console.log(`Server started on ${PORT}`));

//module.exports = 
