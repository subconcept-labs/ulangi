(function($){ "use strict";
             
  function getUrlParam(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results[1] || 0;
  }
/*=========================================================================
	RESET PASSWORD FORM
=========================================================================*/ 
  var isResetingPassword = false;
  $("#reset_password_form").submit(function(event){
    event.preventDefault();
    if (isResetingPassword === false){
      isResetingPassword = true;

      var resetPasswordToken = getUrlParam("resetPasswordToken");
      var newPassword = $("#new_password_input").val();
      $(".message").text("Submitting. Please wait...");
      $("#reset_password_form .submit_btn").html('Submitting...');

      $.post(pageData.resetPasswordApiUrl, { newPassword, resetPasswordToken })
        .done(function(response) {
          if ("success" in response){
            $(".message").text("Changed password successfully.");
          }
          else {
            $(".message").text("An error has occurred. Please try again.");
          }
        })
        .fail(function(error) {
          $(".message").text("An error has occurred. Please try again.");
        })
        .always(function() {
          $("#reset_password_form .submit_btn").html('Submit');
          isResetingPassword = false;
        });
    }
  });
})(jQuery);
