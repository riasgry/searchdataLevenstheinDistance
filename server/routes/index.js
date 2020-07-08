const express = require('express');
const db = require('../db');
const now = require("performance-now");
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

router.get('/search/query=:keyword', async (req, res, next)=>{
	try{
		var start_l;
		var end_l;
        start_l=now();  
		let results = await db.search(req.params.keyword);
		res.json(results);
		end_l=now();
		console.log('pencarian '+(end_l-start_l))
	} catch(e){
		console.log(e);
		res.sendStatus(500);
	}
});


module.exports=router;