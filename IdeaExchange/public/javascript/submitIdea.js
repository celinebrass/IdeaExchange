$(document).ready(function() {
	$("#submitIdeaButton").click(function(event) {

		/* stop form from submitting normally */
		console.log("WOOOOOOOOOOT");
		event.preventDefault();

		/* get the action attribute from the <form action=""> element */
		var $form = $( this ),
				url = $form.attr( 'action' );

		/* Send the data using post with element id name and name2*/
		var posting = $.post( '/newIdea/submit', {
			name: $('#inputName').val(),
			email: getCookie("email"),
			tagline: $('#tagLine').val(),
			description: $('#textArea').val(),
			tags: $('#Tags').val(),

		});


		/* Alerts the results */
		posting.done(function( data ) {
			alert('success');
		});


	});

});

function getCookie(c_name)
{
    var i,x,y,ARRcookies=document.cookie.split(";");

    for (i=0;i<ARRcookies.length;i++)
    {
        x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
        y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
        x=x.replace(/^\s+|\s+$/g,"");
        if (x==c_name)
        {
            return unescape(y);
        }
     }
}
