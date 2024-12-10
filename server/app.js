require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var indexRouter = require('./routes/index');
var graphQLRouter = require('./routes/graphql')
var app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.all('/api',graphQLRouter);

if(process.env.NODE_ENV?.toLowerCase() === "dev"){
    var { ruruHTML } = require("ruru/server")
    app.get("/graphql", (_req, res) => {
        res.type("html")
        res.end(ruruHTML({ endpoint: "/api"}))
    })
}

module.exports = app;
