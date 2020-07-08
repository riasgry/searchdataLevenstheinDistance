require('dotenv').config()
const express = require('express');
const now = require('performance-now');
const request = require('request');
const levenshtein = require('js-levenshtein');
var distance = require('jaro-winkler');
const { render } = require('ejs');
const app = express();
const router = express.Router();

const cekQuery = (req,res,next)=>{
	if(req.query.search){
		next();
	}
	else{
		res.redirect('/');
	}

}

router.get('/',cekQuery, (req, res,next)=>{
	searchOption ={}
	var inputkeywords;

		searchOption.search = req.query.search
		let lowerCase = searchOption.search.toLowerCase();
		let str = lowerCase.replace(/[^\w\s]/gi, '')
		inputkeywords = str.split(/[\s,!]+/);
		res.locals.key=inputkeywords
		res.locals.search=searchOption.search

	next();
},
	function(req,res,next){
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
		res.locals.allkeywords=kamus_data
		next();
		})
	},function(req,res,next){
		var start_performance = now()
		const kata_input = res.locals.key;
		const semua_kata = res.locals.allkeywords;
		var distance_words=[];
		var number_distance=[];
		var five_result=[];
		var correct_word="";
		for(let i=0;i<kata_input.length;i++){
			var start_performance = now()
			for(let a = 0;a<semua_kata[0].length;a++){
				//loop levenshtein	
				//var distances = distance(semua_kata[0][a],kata_input[i])
				var distances = ((semua_kata[0][a].length+kata_input[i].length)-(levenshtein(semua_kata[0][a],kata_input[i])))/(semua_kata[0][a].length+kata_input[i].length)
				   distance_words[semua_kata[0][a]] = distances;
				
			}
			const maxMinVal = (distance_words) => {
				let sortedEntriesByVal = Object.entries(distance_words).sort(([, v1], [, v2]) => v2 - v1);
				let five_result=[];
    			for(let a=0;a<5;a++){
    				five_result.push(sortedEntriesByVal[a]);
    			}
				   return {
					   top5: five_result,
					   min: sortedEntriesByVal[0],
					};
			};
			number_distance.push(maxMinVal(distance_words).min[1]);
			correct_word+=maxMinVal(distance_words).min[0]+" ";
			five_result.push(maxMinVal(distance_words).top5);
			console.log(maxMinVal(distance_words).top5);
	
		}
		res.locals.hasilJarak=number_distance
		res.locals.koreksiKata=correct_word
		res.locals.fiveresult=five_result

		var end_performance = now()

		//console.log(`${req.query.search},${correct_word},${number_distance},${end_performance-start_performance}`)
		next();
		
	},function(req,res,next){
		const input = res.locals.search;
		request(process.env.BASE_URL+"/api/data_ikm/search/query="+input, function(error, response, body){
		const json = JSON.parse(body);
		res.locals.hasilCari=json;
		next();
		})
	},function(req,res){
		const number_distance=res.locals.hasilJarak
		const input = res.locals.search;
		const correct_word=res.locals.koreksiKata
		const json=res.locals.hasilCari;
		let page = req.query.page
		let limit = req.query.limit
		if(page==null&&limit==null){
			page = 1
			limit = 16
		}
		const startIndex= (page -1)* limit
		const endIndex = page * limit
		const result=json.slice(startIndex, endIndex)
		res.render('content',{
			title: 'pencarian',
			data_ikm: result,
			text_input:input,
			hasil: correct_word,
			pages: parseInt(page),
			limits: parseInt(limit),
			jarak: number_distance,
			url: process.env.BASE_URL+"/pencarian?search="
		})
		
	});
	

module.exports=router;