const express = require('express');
const db = require('../db');
const nGram = require('n-gram')
const now = require("performance-now");
const { text } = require('body-parser');
const { bigram } = require('n-gram');
const router = express.Router();

router.get('/', async (req, res, next)=>{
	try{
		
		let results = await db.all();
		res.json(results);
		
	} catch(e){
		console.log(e);
		res.sendStatus(500);
	}
});

router.get('/allkeys', async (req, res, next)=>{
	try{
		var start_l;
		var end_l;
        start_l=now(); 
		let results = await db.allkeys();
		var text_processing=[];
		var kamus_data=[];
		var bigram = [];
		results.forEach(data => {
			let lowerCase = data.nama_perusahaan.toLowerCase();
			let str = lowerCase.replace(/[^\w\s]/gi, '')
			var splitter = str.split(/[\s,!]+/);
			// var ngram = nGram.bigram(splitter)
			// for(var i=0; i<ngram.length; i++) {
			// 	var word = ngram[i].join(' ');
			// 	ngramsplit=word.split(',');
			
			// }
			text_processing.push(splitter) 
		});
		function UnionSet(arr1,arr2){
			return new Set([...arr1,...arr2])
		}
		let set = text_processing.reduce(UnionSet);
		let AllKey = [...set];
		kamus_data.push(AllKey);
		res.json(kamus_data)
		end_l=now();
		console.log('pencarian '+(end_l-start_l))
	} catch(e){
		console.log(e);
		res.sendStatus(500);
	}
});
router.get('/autocomplete', async (req, res, next)=>{
	try{
		var start_l;
		var end_l;
        start_l=now(); 
		let results = await db.allkeys();
		var text_processing=[];
		var kamus_data=[];
		var bigram = [];
		results.forEach(data => {
			let lowerCase = data.nama_perusahaan.toLowerCase();
			let str = lowerCase.replace(/[^\w\s]/gi, '')
			var splitter = str.split(/[\s,!]+/);
			var ngram = nGram.bigram(splitter)
			for(var i=0; i<ngram.length; i++) {
				var word = ngram[i].join(' ');
				ngramsplit=word.split(',');
				text_processing.push(ngramsplit)
			
			}
			text_processing.push(splitter) 
		});
		function UnionSet(arr1,arr2){
			return new Set([...arr1,...arr2])
		}
		let set = text_processing.reduce(UnionSet);
		let AllKey = [...set];
		kamus_data.push(AllKey);
		res.json(kamus_data)
		end_l=now();
		// console.log('pencarian '+(end_l-start_l))
	} catch(e){
		console.log(e);
		res.sendStatus(500);
	}
});

router.get('/search/query=:keyword', async (req, res, next)=>{
	try{
		 
		let results = await db.search(req.params.keyword);
		res.json(results);
	} catch(e){
		console.log(e);
		res.sendStatus(500);
	}
});


module.exports=router;
