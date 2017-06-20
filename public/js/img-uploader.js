// Image Upload
var IMG_UPLOADER = IMG_UPLOADER || (function() {
    return {
        upload: function(e, destination, done) {
            var oFile = e.target.files[0];
            /*if(oFile.size/1024 > 1024) {
                $('#imageAlert').html("The Image size should be less than 300KB")
                $('#imageAlert').fadeIn();
                $timeout(function(){
                    $('#imageAlert').fadeOut(); 
                }, 1500);
                return;
            }*/
            var formData = new FormData();
            formData.append("file", oFile);
            jQuery.ajax({
                url: '/image/upload?destination='+destination+'&filename='+oFile.name,
                data: formData,
                type: 'POST',
                contentType: false,
                processData: false,
                success: function(response) {
                    if(response.status == 1) {
                        done(response.image);
                    }
                },
                error: function(errResponse) {
                    console.log(errResponse);
                }
            });
        },
    }
}());