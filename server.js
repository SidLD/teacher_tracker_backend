const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors')
require('dotenv').config();

//setup
const app = express();
const port = process.env.PORT;
const dbURI = process.env.ATLAS_URI;
const urlencodedParser = bodyParser.urlencoded({extended:false})
app.use(bodyParser.json(), urlencodedParser);
app.use(cors());
app.use(express.json());


//Api
const userAPI = require('./api/User');
app.use(userAPI)


app.get('*', async function(req, res){
  res.status(404).send({message:"URI does not exist"});
});
app.post('*', function(req, res){
    res.status(404).send({message:"URI does not exist"});
});
app.put('*', function(req, res){
    res.status(404).send({message:"URI does not exist"});
});
app.delete('*', function(req, res){
    res.status(404).send({message:"URI does not exist"});
});


//Database
mongoose.set("strictQuery", false);
mongoose.connect(dbURI)
    .then(() => {
        console.log("Connected to the Database")
    })
    .catch((err) => {
        console.log(err.message)
    })
app.listen(port, () => 
    console.log("🔥Server is running on http:localhost:"+port)
);
