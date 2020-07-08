require('dotenv').config()
const now = require("performance-now");
const express = require('express');
const request = require('request');
const fs = require('fs');
const leven = require('leven');
const jarodistance = require('jaro-winkler');
const dldist = require('weighted-damerau-levenshtein');
var bodyParser = require('body-parser');

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({
    extended: true
}));

router.get('/', (req, res)=>{

    res.render('test')
})

router.post('/testing/getInput', (req, res,next)=>{
    function CreateKeywordLibrary(){        
        request(process.env.API_URL, function(error, response, body){
            const json = JSON.parse(body);
            var text_processing=[];
            var kamus_data=[];
            json.forEach(data => {
                let lowerCase = data.nama_perusahaan.toLowerCase();
                let str = lowerCase.replace(/[^\w\s]/gi, '')
                var splitter = str.split(/[\s,!]+/);
                text_processing.push(splitter)  
            });
            function UnionSet(arr1,arr2){
                return new Set([...arr1,...arr2])
            }
            let set = text_processing.reduce(UnionSet);
            let AllKey = [...set];
            kamus_data.push(AllKey);
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

        var jarodistance_words=[];
        var jaronumber_distance=[];
        var jarocorrect_word="";

        var dldistance_words=[];
        var dlnumber_distance=[];
        var dlcorrect_word="";

        var start_l;
		var end_l;
		var hasil_l=[];

		var start_j;
		var end_j;
		var hasil_j=[];

        var start_dl;
		var end_dl;
		var hasil_dl=[];

        for(let i=0;i<inputkeywords.length;i++){
            start_l=now();
            for(let a = 0;a<distance[0].length;a++){
                //loop levenshtein	
                
                let distances = ((distance[0][a].length+inputkeywords[i].length)-leven(distance[0][a],inputkeywords[i]))/(distance[0][a].length+inputkeywords[i].length)
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
            end_l=now();
             //Jaro
            start_j=now();
            for(let a = 0;a<distance[0].length;a++){
                let distances = jarodistance(distance[0][a],inputkeywords[i])
                jarodistance_words[distance[0][a]] = distances;
                
            }
            const jaromaxMinVal = (jarodistance_words) => {
                let sortedEntriesByVal = Object.entries(jarodistance_words).sort(([, v1], [, v2]) => v2 - v1);
                   return {
                       min: sortedEntriesByVal[0],
                    };
            };

            jaronumber_distance.push(jaromaxMinVal(jarodistance_words).min[1]);
            jarocorrect_word+=jaromaxMinVal(jarodistance_words).min[0]+" ";
            end_j=now();
            //
            //dl distance
            start_dl=now();
            for(let a = 0;a<distance[0].length;a++){
                //loop levenshtein	
                
                let distances = ((distance[0][a].length+inputkeywords[i].length)-dldist(distance[0][a],inputkeywords[i]))/(distance[0][a].length+inputkeywords[i].length)
                dldistance_words[distance[0][a]] = distances;
                
            }
            const dlmaxMinVal = (dldistance_words) => {
                let sortedEntriesByVal = Object.entries(dldistance_words).sort(([, v1], [, v2]) => v2 - v1);
                   return {
                       min: sortedEntriesByVal[0],
                    };
            };

            dlnumber_distance.push(dlmaxMinVal(dldistance_words).min[1]);
            dlcorrect_word+=dlmaxMinVal(dldistance_words).min[0]+" ";
            end_dl=now();

        }
        res.locals.hasilJarak=number_distance
        res.locals.koreksiKata=correct_word
        res.locals.timeld=end_l-start_l
        
        res.locals.jarohasilJarak=jaronumber_distance
        res.locals.jarokoreksiKata=jarocorrect_word

        res.locals.timej=end_j-start_j
        res.locals.dlhasilJarak=dlnumber_distance
        res.locals.dlkoreksiKata=dlcorrect_word

        res.locals.timedld=end_dl-start_dl
        res.locals.inputk=inputkeywords
        next();

    }

},function(req,res,next){
    const inputk=res.locals.inputk
    const correct_word=res.locals.koreksiKata
    const jaronumber_distance=res.locals.jarohasilJarak
    const dlcorrect_word=res.locals.dlkoreksiKata
    const timel =res.locals.timeld
    const timej =res.locals.timej
    const timedl =res.locals.timedld
    
    const number_distance=res.locals.hasilJarak
    const jarocorrect_word=res.locals.jarokoreksiKata
    const dlnumber_distance=res.locals.dlhasilJarak
    fs.appendFile("./testing.csv",JSON.stringify({
        input:inputk, 
        cw: correct_word,
        jcw: jarocorrect_word,
        dlcw: dlcorrect_word,
        nd:number_distance,
        td:timel,
        jnd:jaronumber_distance,
        tj:timej,
        dlnd:dlnumber_distance,
        tdl:timedl
    })+",\r\n", function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
        res.send({
            input:inputk,
            cw: correct_word,
            jcw: jarocorrect_word,
            dlcw: dlcorrect_word,
            nd:number_distance,
            td:timel,
            jnd:jaronumber_distance,
            tj:timej,
            dlnd:dlnumber_distance,
            tdl:timedl
           
        })
	})

module.exports = router;