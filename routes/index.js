require('dotenv').config()
const express = require('express');
const request = require('request');
const app = express();
const router = express.Router();

router.get('/', (req, res,)=>{
	request(process.env.API_URL, function(error, response, body){
		const json = JSON.parse(body);
		let page = req.query.page
		let limit = req.query.limit
		if(page==null&&limit==null){
			page = 1
			limit = 16
		}
		const startIndex= (page -1)* limit
		const endIndex = page * limit
		const lastPage = Math.ceil(json.length/limit)
		if(page>lastPage){
			res.redirect(process.env.BASE_URL+"/?page="+(lastPage)+"&limit="+limit)
		}
		else{
			const result=json.slice(startIndex, endIndex)
			res.render('index',{
				title:'main',
				data_ikm: result,
				end:json.length,
				pages: parseInt(page),
				limits: parseInt(limit),
				lastPages:parseInt(lastPage),
				url: process.env.BASE_URL
			});
		}
	});
})


module.exports=router;
