(function($){ "use strict";
             
/*=========================================================================
	CONTACT US FORM
=========================================================================*/ 
  var isSendingContactUs = false;
  $("#contact_us_form").submit(function(event){
    event.preventDefault();

    if (isSendingContactUs === false){
      isSendingContactUs = true;

      var replyToEmail = $("#email_input").val();
      var message = $("#message_input").val();
      var subject = `Support request from ${replyToEmail}`;
      $(".message").text("Sending. Please wait...");
      $("#contact_us_form .submit_btn").html('Sending...');

      $.post(pageData.contactAdminApiUrl, { adminEmail: pageData.adminEmail, replyToEmail, subject,message })
        .done(function(response){
          if ("success" in response){
            $(".message").text("Message has been sent successfully. Please wait for reply.")
          }
          else {
            $(".message").text("An error has occurred. Please try again.")
          }
        })
        .fail(function(error) {
          $(".message").text("An error has occurred. Please try again.")
        })
        .always(function(){
          $("#contact_us_form .submit_btn").html('Send');
          isSendingContactUs = false;
        })
      ;
    }
  });
})(jQuery);
