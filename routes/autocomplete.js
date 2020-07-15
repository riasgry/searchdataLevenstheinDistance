require('dotenv').config()
const now = require("performance-now");
const express = require('express');
const request = require('request');
const levenshtein = require('js-levenshtein');
const distance = require('jaro-winkler')
var bodyParser = require('body-parser');

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({
    extended: true
}));

router.get('/', (req, res)=>{

    res.render('test')
})

router.post('/autocomplete/getInput', (req, res,next)=>{
    function CreateKeywordLibrary(){   
           
        request(process.env.API_URL_AUTOKEY, function(error, response, body){
            var kamus_data = JSON.parse(body);
            testAlgorthm(kamus_data);
        })
    }
    CreateKeywordLibrary()
    
	var reqData = JSON.stringify(req.body);
    var parsedata = JSON.parse(reqData)
    inputkeywords = parsedata.input
    inputkeyword = parsedata.inputs
    function testAlgorthm(val){
        
        var distance = val;
        var distance_words=[];
        var correct_word='';
        var correct_words=[];
        let matches = distance[0].filter(distance=>{
            const regex = new RegExp(`^${inputkeyword}`)
            return distance.match(regex)
        })
        if(matches.length>0){
            res.send(matches.slice(0,5))
        }
        else{
            for(let i=0;i<inputkeywords.length;i++){
                for(let a = 0;a<distance[0].length;a++){
                    //loop levenshtein	
                    
                    var distances = ((distance[0][a].length+inputkeywords[i].length)-levenshtein(distance[0][a],inputkeywords[i]))/(distance[0][a].length+inputkeywords[i].length)
                    distance_words[distance[0][a]] = distances;
                    
                }
                const maxMinVal = (distance_words) => {
                    let sortedEntriesByVal = Object.entries(distance_words).sort(([, v1], [, v2]) => v2 - v1);
                       return {
                           min: sortedEntriesByVal[0],
                        };
                };
                correct_word+=maxMinVal(distance_words).min[0]+" ";
                correct_words.push(correct_word.slice(0,-1))
    
            }
            res.send(correct_words)
        }

    }

})

module.exports = router;