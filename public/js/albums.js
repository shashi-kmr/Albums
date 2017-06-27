var albumApp = angular.module('albumApp', ['ngSanitize']).controller('albumAppCtl', function($scope, $http, $timeout) {
	$scope.albums = [];

	$scope.album = {};

	$http({
		method: "GET",
		url: "/albums/get",
	}).then(function(res){
		if(res && res.data) {
			$scope.albums = res.data;
		}
	}, function(err){
		console.log(err);
	});

	$scope.showAlbumModal = function() {
		$scope.album = {
			name: "",
		}
		jQuery('#album-disc').modal("show");
	}

	$scope.hoverOnAlbum = function(e) {
		$scope.del = false;
		jQuery(e.target).children(".album-info-box").addClass("hovered");
	}

	$scope.redirectToAlbumImage = function(a) {
		if($scope.del) {
			return;
		}
		window.location.href = "/" + a.name + "/images";
	}

	$scope.onAlbumLeave = function(e) {
		jQuery(".hovered").removeClass("hovered");
	}

	$scope.getImgBoxStyle = function(a) {
		if(a.images.length == 0) {
			return {"background-image": 'url("/images/album-default.png")'};
		} else {
			var bgUrls = "";
			for(var i = 0; i < a.images.length && i < 3; i++) {
				bgUrls += 'url('+a.images[i].path+')';
				if(i < 2 && i < a.images.length - 1)
					bgUrls += ", "
			}
			if(a.images.length > 1) {
				var bgSizes, bgPositions;
				if(a.images.length == 2) {
					bgSizes = "75% 75%, 75% 75%";
					bgPositions = "75% 75%, 15% 15%";
				} else {
					bgSizes = "60% 60%, 60% 60%, 60% 60%";
					bgPositions = "80% 80%, 40% 40%, 2% 4%";
				}
				return {"background-image": bgUrls, "background-size": bgSizes, "background-position": bgPositions}
			}
			return {"background-image": bgUrls};
		}
	}

	$scope.createAlbum = function() {
		if(!$scope.album.name) {
			jQuery('#album-name').focus();
			jQuery('#album-name').siblings('p').html("Enter Album Name");
			jQuery('#album-name').siblings('p').fadeIn();
			$timeout(function(){
				jQuery('#album-name').siblings('p').fadeOut();
			}, 1800);
			return;
		}

		$scope.album.name = $scope.album.name.toUpperCase();

		$http({
			method: "POST",
			url: "/albums/save",
			data: $scope.album,
		}).then(function(res) {
			if(res && res.data) {
				if(res.data.status == 1) {
					$scope.albums.push(res.data.album);
					jQuery('.modal').modal("hide");
				} else {
					if(res.data.err.indexOf('duplicate key error collection') != -1) {
						jQuery('#album-name').siblings('p').html("Duplicate Album Name");
						jQuery('#album-name').siblings('p').fadeIn();
						$timeout(function(){
							jQuery('#album-name').siblings('p').fadeOut();
						}, 1800);
					}
				}
			}
		}, function(err){
			console.log(err);
		});
	}

	$scope.albumdel = {};
	$scope.del = false;
    $scope.showAlbumDeleteModal = function(id, name) {
    	$scope.del = true;
    	$scope.albumdel = {
    		id: id,
    		name: name,
    	}
    	jQuery('#alert-disc').modal("show");
    }

    $scope.deleteAlbum = function() {
    	$http({
    		method: "POST",
    		url: "/album/delete",
    		data: $scope.albumdel,
    	}).then(function(res) {
    		if(res.data) {
    			if(res.data.status == 1) {
    				$scope.albums = $scope.albums.filter(function(i){return i.name != $scope.albumdel.name});
    			}
    			jQuery('.modal').modal("hide");
    		}
    	}, function(err){
    		console.log(err);
    	});
    }
});