var imageApp = angular.module('imageApp', ['ngSanitize', 'me-lazyload']).controller('imageAppCtl', function($scope, $http, $timeout) {
	$scope.images = [];

	$scope.image = {};

	$http({
		method: "GET",
		url: "/images/get?album=" + albumName,
	}).then(function(res){
		if(res && res.data) {
			$scope.images = res.data;
		}
	}, function(err){
		console.log(err);
	});

	$scope.uploadImg = function() {
        jQuery('.upload-img-file').click();
    }

    $scope.ImgUpload = function(event) {
    	jQuery(".spinner, #ajax-popup-bg").show();
        IMG_UPLOADER.upload(event, albumName, function(image) {
        	$scope.images.push(image);
        	$scope.$apply();
        	jQuery(".spinner, #ajax-popup-bg").hide();
        });
    }

    $scope.showImageModal = function(i) {
    	$scope.image = i;
    	jQuery('#image-disc').modal("show");
    }

    $scope.imageHover = function(e) {
    	jQuery(e.target).siblings('.image-action-div').slideDown("fast");
    }

    $scope.imageMLeave = function(e) {
    	if(jQuery(e.target).siblings('.image-action-div').length) {
    		jQuery(e.target).siblings('.image-action-div').slideUp("fast");
    	} else {
    		jQuery(e.target).find('.image-action-div').slideUp("fast");
    	}
    }

    $scope.imagedel = {};
    $scope.showImageDeleteModal = function(id, nameT, name) {
    	$scope.imagedel = {
    		id: id,
    		nameT: nameT,
    		name: name,
    		albumName: albumName,
    	}

    	jQuery('#alert-disc').modal("show");
    }

    $scope.deleteImage = function() {
    	jQuery(".spinner, #ajax-popup-bg").show();
    	$http({
    		method: "POST",
    		url: "/image/delete",
    		data: $scope.imagedel,
    	}).then(function(res) {
    		console.log(res.data);
    		if(res.data) {
    			if(res.data.status == 1) {
    				$scope.images = $scope.images.filter(function(i){return i._id != $scope.imagedel.id});
    			}
    			jQuery(".spinner, #ajax-popup-bg").hide();
    			jQuery('.modal').modal("hide");
    		}
    	}, function(err){
    		console.log(err);
    	});
    }
});