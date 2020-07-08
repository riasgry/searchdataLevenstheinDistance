// const request = require('request');
// const inputkeywords = require('../routes/content.js')
// //membuat kamus data text pre-processing
// module.exports={
//     foo:function (){
//         request("http://localhost:3000/api/data_ikm", function(error, response, body){
//           const json = JSON.parse(body);
//             var text_processing=[];
//             var kamus_data=[];
//             json.forEach(data => {
//              let lowerCase = data.nama_perusahaan.toLowerCase();
//              let str = lowerCase.replace(/[^\w\s]/gi, '')
//              var splitter = str.split(/[\s,!]+/);
//              text_processing.push(splitter)  
//          });
//          function UnionSet(arr1,arr2){
//              return new Set([...arr1,...arr2])
//          }
//         let set = text_processing.reduce(UnionSet);
//         let AllKey = [...set];
//         kamus_data.push(AllKey);
        	

//     var distance = kamus_data;
//     var distance_words=[];
//     var number_distance=[];
//     var correct_word="";
//     for(let i=0;i<inputkeywords.length;i++){
//         for(let a = 0;a<distance[0].length;a++){
//             //loop levenshtein	
            
//             var distances = levenshtein(distance[0][a],inputkeywords[i])
//             distance_words[distance[0][a]] = distances;
            
//         }
//         const maxMinVal = (distance_words) => {
//             let sortedEntriesByVal = Object.entries(distance_words).sort(([, v1], [, v2]) => v1 - v2);
//                return {
//                    min: sortedEntriesByVal[0],
//                 };
//         };

//         number_distance.push(maxMinVal(distance_words).min[1]);
//         correct_word+=maxMinVal(distance_words).min[0]+" ";

//     }
//     correction=correct_word;
//     distance_result =number_distance;
        
//     })
// }


// const express = require('express');
// const request = require('request');
// const levenshtein = require('js-levenshtein');
// const app = express();
// const router = express.Router();

// router.get('/', (req, res)=>{
// 	searchOption ={}
// 	var inputkeywords;
// 	var correction;
// 	var distance_result;
// 	if(req.query.search){
// 		searchOption.search = req.query.search
// 		//pengolahan text pre-processing input user
// 		function InputProses(){ 
// 			let lowerCase = searchOption.search.toLowerCase();
// 			let str = lowerCase.replace(/[^\w\s]/gi, '')
// 			let splitter = str.split(/[\s,!]+/);
// 			inputkeywords=splitter;
// 		}
// 		InputProses();
// 		//membuat kamus data text pre-processing
// 		function CreateKeywordLibrary(){
// 			request("http://localhost:3000/api/data_ikm", function(error, response, body){
// 				const json = JSON.parse(body);
// 				var text_processing=[];
// 				var kamus_data=[];
// 				json.forEach(data => {
// 					let lowerCase = data.nama_perusahaan.toLowerCase();
// 					let str = lowerCase.replace(/[^\w\s]/gi, '')
// 					var splitter = str.split(/[\s,!]+/);
// 					text_processing.push(splitter)  
// 				});
// 				function UnionSet(arr1,arr2){
// 					return new Set([...arr1,...arr2])
// 				}
// 				let set = text_processing.reduce(UnionSet);
// 				let AllKey = [...set];
// 				kamus_data.push(AllKey);
// 				testAlgorthm(kamus_data);	
				
// 			})
// 		}
// 		CreateKeywordLibrary()

// 		function testAlgorthm(val){
// 			var distance = val;
// 			var distance_words=[];
// 			var number_distance=[];
// 			var correct_word="";
// 			for(let i=0;i<inputkeywords.length;i++){
// 				for(let a = 0;a<distance[0].length;a++){
// 					//loop levenshtein	
					
// 					var distances = levenshtein(distance[0][a],inputkeywords[i])
// 		        	distance_words[distance[0][a]] = distances;
					
// 				}
// 				const maxMinVal = (distance_words) => {
// 					let sortedEntriesByVal = Object.entries(distance_words).sort(([, v1], [, v2]) => v1 - v2);
// 					   return {
// 						   min: sortedEntriesByVal[0],
// 						};
// 				};
	
// 				number_distance.push(maxMinVal(distance_words).min[1]);
// 				correct_word+=maxMinVal(distance_words).min[0]+" ";
	
// 			}
// 			correction=correct_word;
// 			distance_result =number_distance;
// 		}
// 	}
// 	else{
// 		res.redirect('/')
// 	}
// 	try{
// 		request("http://localhost:3000/api/data_ikm/search/query="+searchOption.search, function(error, response, body){
// 			const json = JSON.parse(body);

// 			res.render('content',{
// 				title: 'pencarian',
// 				data_ikm: json,
// 				text_input:searchOption.search,
// 				hasil: correction,
// 				jarak: distance_result,
// 				url: "http://localhost:3000/pencarian?search="
				
// 			});
// 		});
// 	}catch{
// 		res.redirect('/')
// 	}
	
// });

// module.exports=router;

// }