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
           
        request(process.env.API_URL_KEY, function(error, response, body){
            var kamus_data = JSON.parse(body);
            testAlgorthm(kamus_data);
        })
    }
    CreateKeywordLibrary()
    
	var reqData = JSON.stringify(req.body);
    var parsedata = JSON.parse(reqData)
    inputkeywords = parsedata.input

    

    function testAlgorthm(val){
        var distance = val;
        var distance_words=[];
        var number_distance=[];
        var correct_word="";

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

            number_distance.push(maxMinVal(distance_words).min[1]);
            correct_word+=maxMinVal(distance_words).min[0]+" ";

        }
        res.locals.hasilJarak=number_distance
		res.locals.koreksiKata=correct_word
        next();

    }

},function(req,res,next){
    const number_distance=res.locals.hasilJarak
    const correct_word=res.locals.koreksiKata
    request(process.env.BASE_URL+"/api/data_ikm/search/query="+correct_word, function(error, response, body){
        const json = JSON.parse(body);
        res.send(json.slice(0,5))
	})
}
)

module.exports = router;