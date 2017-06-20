var processArgs = process.argv.slice(2, process.argc);
if(processArgs.indexOf('postgres') != -1) {
	const pool = require('./lib/postgres');
} else {
	var Albums = require('../models/album');
	var Images = require('../models/image');
}

var multer = require('multer');
var mkdirp = require('mkdirp');
var fs = require('fs-extra');
var ExifImage = require('exif').ExifImage;
var sizeOf = require('image-size');

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
    	var dest = './public/images/' + req.query.destination + '/';
        mkdirp.sync(dest);
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        var timestamp = Date.now();
        var filename = file.originalname.substring(0, file.originalname.lastIndexOf('.'))
        //cb(null, file.originalname);
        cb(null, filename + '-' + timestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});

var upload = multer({
    storage: storage
}).single('file');

var getExifData = function(filename, callback) {
	try {
	    new ExifImage({ image : filename}, function (error, exifData) {
	        if (error) {
	            console.log('Error: '+error.message);
	            callback(error);
	        } else {
	            console.log(exifData);
	            callback(null, exifData);
	        }
	    });
	} catch (error) {
	    console.log('Error: ' + error.message);
	    callback(error);
	}
}

module.exports = function(app) {
	app.post('/image/delete', function(req, res) {
		Images.remove({
			_id: req.body.id,
		}, function(err){
			if(err) {
				console.log(err);
				return res.json({status: 0, msg: "Error while Removing Image from db"});
			}

			Albums.update({
				name: req.body.albumName,
			}, {
				$pull: {
					images: req.body.id,
				}
			}, function(err, result){
				if(err) {
					console.log(err);
					return res.json({status: 0, msg: "Error while Removing Image from db"});
				}
				fs.removeSync('./public/images/'+ req.body.albumName + "/" + req.body.nameT);

				return res.json({status: 1, msg: "Succefully deleted"});
			})
		})
	});

	app.post('/album/delete', function(req, res) {

		Albums.findOne({
			_id: req.body.id,
		}, {
			images: 1
		}, function(err, album) {
			if(err) {
				console.log(err);
				return res.json({status: 0});
			}

			Images.remove({
				_id: {$in: album.images},
			}, function(err) {
				if(err) {
					console.log(err);
					return res.json({status: 0, msg: "Error while Removing Images from db"});
				}

				Albums.remove({
					_id: req.body.id,
				}, function(err){
					if(err) {
						console.log(err);
						return res.json({status: 0, msg: "Error while Removing Album from db"});
					}
					fs.removeSync('./public/images/'+ req.body.name + "/");
					return res.json({status: 1, msg: "Succefully deleted"});
				});
			});
		})
	});

	app.post('/image/upload', upload, function(req, res) {
		var dimension = sizeOf(req.file.destination + req.file.filename);
		var imgMetadata = {
			dimension: dimension,
			mimetype: req.file.mimetype,
			encoding: req.file.encoding,
			size: req.file.size, // In Bytes
		}
		getExifData(req.file.destination + req.file.filename, function(err, exifData) {
			if(!err) {
				imgMetadata.exifData = exifData;
			}

			var image = new Images({
				namewithTimeStamp: req.file.filename,
				name: req.file.originalname,
				path: req.protocol + "://" + req.get('host') + req.file.destination.slice(8) + req.file.filename,
				albumName: req.file.destination.split('/')[3],
				metadata: imgMetadata,
			});

			image.save(function(err, img) {
				if(err) {
					console.log(err);
					return res.json({status: 0});
				}
				Albums.update({
					name: req.file.destination.split('/')[3]
				}, {
					$push: {
						images: img._id,
					}
				}, function(err2, result) {
					if(err2) {
						console.log(err2);
					}
				})
				return res.json({status: 1, image: img});
			})
		})
    });

	app.get("/", function(req, res){
		return res.render("albums");
	});

	app.get('/albums/get', function(req, res){
		Albums.find({	
		}).populate('images', 'path').exec(function(err, albums) {
			if(err) {
				console.log(err);
				return res.json([]);
			} 
			console.log(albums);
			return res.json(albums);
		})
	});

	app.post('/albums/save', function(req, res){

		var album = new Albums({
			name: req.body.name,
			createdAt: Date.now(),
			images: [],
		})
		album.save(function(err, album){
			if(err || !album) {
				console.log(err);
				return res.json({status: 0, err: err.message});
			} else {
				return res.json({status: 1, album: album});
			}
		})
	})

	app.get('/:albumName/images', function(req, res) {
		Albums.findOne({
			name: req.params.albumName.toUpperCase(),
		}, function(err, album) {
			if(err || !album) {
				console.log(err);
				return res.send("There is no album named" + req.params.albumName + " exists!");
			}
			return res.render("image_viewer", {
				albumName: req.params.albumName.toUpperCase(),
			});
		})
	});

	app.get('/images/get', function(req, res){
		var albumName = req.query.album;
		Images.find({
			albumName: albumName
		}, function(err, images){
			if(err) {
				console.log(err);
				return res.json([]);
			}
			return res.json(images);
		})
	})

}