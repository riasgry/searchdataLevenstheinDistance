const mysql = require('mysql');
require('dotenv').config()
const pool = mysql.createConnection({
	connectionLimit: 5,
	host     : process.env.MYSQL_ADDON_HOST,
    	database : process.env.MYSQL_ADDON_DB,
    	user     : process.env.MYSQL_ADDON_USER,
    	password : process.env.MYSQL_ADDON_PASSWORD,
	port:'14051',
});

let ikmdb={};

ikmdb.all=()=>{
	return new Promise((resolve, reject)=>{
		pool.query(`select tabel_ikm.nama_perusahaan,tabel_desa.nama_desa,tabel_kecamatan.nama_kec from tabel_ikm
		join tabel_desa on tabel_ikm.desa = tabel_desa.key_desa
		join tabel_kecamatan on tabel_ikm.kecamatan = tabel_kecamatan.id_kec`,(err,results)=>{
			if(err){
				return reject(err);
			}
			return resolve(results);
		});
	});

};

ikmdb.allkeys=()=>{
	return new Promise((resolve, reject)=>{
		pool.query(`select nama_perusahaan from tabel_ikm`,(err,results)=>{
			if(err){
				return reject(err);
			}
			return resolve(results);
		});
	});

};

ikmdb.search=(keyword)=>{
	return new Promise((resolve, reject)=>{
		keywords=keyword.replace(/[^0-9a-zA-Z]+/g,' ',)
		pool.query(`select tabel_ikm.nama_perusahaan,tabel_desa.nama_desa,tabel_kecamatan.nama_kec from tabel_ikm
		join tabel_desa on tabel_ikm.desa = tabel_desa.key_desa
		join tabel_kecamatan on tabel_ikm.kecamatan = tabel_kecamatan.id_kec WHERE MATCH(nama_perusahaan) AGAINST(?)`,[keywords],(err,results)=>{
			if(err){
				return reject(err);
			}
			return resolve(results);
		});
	});

};

module.exports=ikmdb;


