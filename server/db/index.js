const mysql = require('mysql');

const pool = mysql.createConnection({
	connectionLimit: 5,
	password:'wCIRAKLjNLFXPxSI7cD5',
	user:'ufc9u5cijesxyuab',
	database:'b5pihhq4sfjuzo7i3o1r',
	host:'b5pihhq4sfjuzo7i3o1r-mysql.services.clever-cloud.com',
	port:'3306',
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

//SELECT * FROM tabel_ikm WHERE MATCH(nama_perusahaan) AGAINST('bengkel rokhim makaroni' IN NATURAL LANGUAGE MODE)