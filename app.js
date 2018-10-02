const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
/* const ejs = require('ejs');*/
const routes = require('./routes/index');

const errorHandlers = require('./handlers/errorHandlers');

const app = express();


mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
    console.error(`Error: ${err.message}`);
});
mongoose.connect('mongodb://localhost:27017/fsExercise', { useNewUrlParser: true });

/* app.engine('html', ejs.renderFile);
app.set('view engine', 'html'); */
app.use(express.static(path.join(__dirname, '../public')));

/* app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '../public/index.html'));
}); */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/v1', routes);

app.use(errorHandlers.notFound);

if (app.get('env') === 'development') {
    app.use(errorHandlers.developmentErrors);
}

app.use(errorHandlers.productionErrors);


const server = app.listen(3000, () => {
    console.log('Listening on port: ' + 3000);
});
