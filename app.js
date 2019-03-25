const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const path = require('path');
const morgan = require('morgan');
app.use(morgan('combined'))

//On requiert le module dans db.js
const db = require('./db');
const collection = "todo";

//nos routes
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,'index.html'));
})

app.get('/getTodos', (req,res) =>{
    db.getDB().collection(collection).find({}).toArray((err,documents)=>{
        if(err){
            console.log(err);
        } else {
            console.log(documents);
            res.json(documents);
        }
    });
})

app.put('/:id', (req,res)=>{
    const todoID = req.params.id;
    const userInput = req.body;
    db.getDB().collection(collection).findOneAndUpdate({_id : db.getPrimaryKey(todoID)}, {$set : {todo : userInput.todo}},{returnOriginal : false},(err,result) => {
        if(err) {
            console.log(err);
        }
        else {
            res.json(result);
        }
    });
})

app.post('/', (req,res)=>{
    const inputUser = req.body;
    db.getDB().collection(collection).insertOne(inputUser,(err,result)=>{
        if(err)
            console.log(err);
        else 
            res.json({result: result,document : result.ops[0]});
    });
});

app.delete('/:id', (req,res)=>{
    const todoID = req.params.id;
    db.getDB().collection(collection).findOneAndDelete({_id : db.getPrimaryKey(todoID)},(err,result) => {
        if(err) {
            console.log(err);
        }
        else {
            res.json(result);
        }
    });
})

//On initialise la connection à notre base de donnée
db.connect((err)=>{
    if(err){
        console.log('Connexion à la base impossible');
        process.exit(1);
    } else {
        app.listen(3000,()=>{
            console.log('Vous etes bien connecter à la base de donnée sur le port 3000');
        });
    }
})