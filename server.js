const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
const contentRouter = require('./routes/content.js')
const indexRouter = require('./routes/index.js')
const autocompleteRouter = require('./routes/autocomplete.js')
const testRouter=require('./routes/testing.js')
const apiRoutes = require('./server/routes');
const expressLayouts =require('express-ejs-layouts');

const app = express();
app.use(express.static(path.join(__dirname,'public')));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.set('view engine', 'ejs')
app.set('views',__dirname + '/views')
app.set('layout','layouts/layout')

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(expressLayouts)
app.use(express.static('public'))

app.use(express.json());
app.use('/api/data_ikm',apiRoutes);
app.use('/api/data_ikm/allkeys',apiRoutes);
app.use('/api/data_ikm/autocomplete',apiRoutes);
app.use('/api/data_ikm/search',apiRoutes);

app.use('/', indexRouter);

app.use('/pencarian', contentRouter);
app.use('/testing', testRouter);
app.post('/testing/getInput',testRouter);

app.use('/autocomplete', autocompleteRouter);
app.post('/autocomplete/getInput',autocompleteRouter);


app.listen(process.env.PORT || '3000',()=>{
	console.log(`Server is runng on port: ${process.env.PORT || '3000'}`);
});
