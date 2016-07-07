/*jshint multistr: true */

var allIdeas = null;
var ideaTable = {};
var currentRow;

$(document).ready(function() {
	populateTableAllIdeas();
  var rowData;
  // upon clicking each row in the recent activity table
	$('#allIdeas tbody').on('click', 'tr', function (e) {
    // Get the row where we clicked
    var row = $(this);
    rowData = allIdeas.row(row).data();
    var tagString = "";
    for(var i = 0; i < rowData.tags.length; i++){
      tagString += rowData.tags[i];
      tagString += " ";
    }
    document.getElementById("modalTitle").innerHTML = rowData.name;
    document.getElementById("tagParagraph").innerHTML = rowData.tagline;
    document.getElementById("descriptionParagraph").innerHTML = rowData.description + "\n";
    document.getElementById("tagList").innerHTML = "\n\n"+ tagString;
    document.getElementById("likesModal").innerHTML = rowData.likers.length + " likes";
		console.log(rowData.claim);
    document.getElementById("claimedParagraph").innerHTML = (rowData.claim ? "Claimed by " + rowData.claim : "Not claimed yet.");
    document.getElementById('modalDialog').style.Width = "200%";

    currentRow=rowData._id;
    populateCommentTable(rowData.comments);

	});

  /* attach a submit handler to the form */
    $("#modalComment").click(function(event) {

      /* stop form from submitting normally */
      event.preventDefault();
      /* get the action attribute from the <form action=""> element */
      var $form = $( this ),
          url = $form.attr( 'action' );

      /* Send the data using post with element id name and name2*/
      var posting = $.post( '/addComment', {
        comment: $('#commentText').val(),
        idea: currentRow,
        name: getCookie("email")
      });
      document.getElementById("commentText").value = "";


      /* Alerts the results */
      posting.done(function( data ) {
        alert('success');
      });


    });

    $("#modalLike").click(function(event) {

      /* stop form from submitting normally */
      event.preventDefault();
      /* get the action attribute from the <form action=""> element */
      var $form = $( this ),
          url = $form.attr( 'action' );
      console.log("LIKEING SHIT");

      /* Send the data using post with element id name and name2*/
      var posting = $.post( '/like', {
        idea: currentRow,
        name: getCookie("email")
      });
      document.getElementById("likesModal").innerHTML = (rowData.likers.length + 1) + " likes";

      /* Alerts the results */
      posting.done(function( data ) {
        alert('success');
      });


    });

    $("#modalClaim").click(function(event) {

      /* stop form from submitting normally */
      event.preventDefault();
      /* get the action attribute from the <form action=""> element */
      var $form = $( this ),
          url = $form.attr( 'action' );
      console.log("CLAIMING SHIT");

      /* Send the data using post with element id name and name2*/
      var posting = $.post( '/claim', {
        idea: currentRow,
        name: getCookie("email")
      });
      document.getElementById("claimedParagraph").innerHTML = "Claimed by you!";

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

function populateTableAllIdeas() {
	$.getJSON('/ideas', function(data) {
		JSON.stringify(data);
		allIdeas = $('#allIdeas').DataTable({
			destroy: true,
			data: data,
			"order": [ 0, 'desc' ],
      "pagingType": "simple",
			"pageLength" : 10,
			columns: [
        {
          data: {
            name: "name",
            tags: "tags"
          },
          width: "20%",
          render :
          function(data, type, row){
            return "<h2 id=tableName>" +  data.name + "</h2><p id=tagName>" + (data.tags[0] ? data.tags[0]: "") + (data.tags[1] ? ", " + data.tags[1]: "") + (data.tags[2] ? ", " + data.tags[2]: "") + "</p>";
          }
        },

        {
          width: "60%",
          data: {
            tagline : "tagline",
            description: "description",
            creator: "creator",
            likers: "likers",
            comments: "comments"
          },
          render :
          function(data, type, row){
            return "<div id=scrollingDiv> <p id=tagline>" +  data.tagline + "</p> <p id=description>" + data.description + "</p> <p id=author> Submitted by " + data.creator + "</p></div><div id=pictureDiv> <img src=/images/likeImage.png class=commImg id=facebookLike><p id=little> +"+ data.likers.length + "</p><img src=/images/comment.png class=commImg id=commentPic><p id=little> +"+ data.comments.length + "</p></div>";
          }
        }
			],
			language: {
				emptyTable: function () {
					return '<p class="text-center">There are no ideas to date.</p>';
				}
			},
			drawCallback: function (settings) {
				var pgr = $(settings.nTableWrapper).find('.dataTables_paginate');
				if (settings._iDisplayLength >= settings.fnRecordsDisplay()) {
					pgr.hide();
				}
				else {
					pgr.show();
				}
			}
		});
	});
  }

  function populateCommentTable(comments) {
    console.log("populating comments table");
  	$('#commentTable').DataTable({
        aaData: comments,
  			destroy: true,
        "order": [ 0, 'desc' ],
        "bPaginate": false,
        "bFilter": false,
        "bInfo": false,
        "filter": false,
        scrollY:        200,
        scrollCollapse: true,
        searching: false,
  			aoColumns: [
          {
            data: {
              commenter: "commenter",
              text: "text"
            },
            render :
            function(data, type, row){
              console.log("DATA YAYYYY");
              return "<p id=CommenterText>" + data.commenter + ": \n</p> <p id=commentText>" + data.text + "</p>";
            }
          }
  			],
  			language: {
  				emptyTable: function () {
  					return '<p class="text-center">There are no comments yet :( .</p>';
  				}
  			},
  			drawCallback: function (settings) {
  				var pgr = $(settings.nTableWrapper).find('.dataTables_paginate');
  				if (settings._iDisplayLength >= settings.fnRecordsDisplay()) {
  					pgr.hide();
  				}
  				else {
  					pgr.show();
  				}
          console.log("DONE DRAWING");
          $("#modalDialog").css({
            width: "80%",
            "max-height": "80%",
            overflow: "scroll"
          });
          $("#ideaModal").css({
            "max-height": "80%",
            overflow: "scroll"
          });
          $("#commentTable").css({
            height: "200px"
          });

          //make the table layout fixed
          var table = document.getElementById('commentTable');
          table.style.tableLayout="fixed";

          table.style.whiteSpace = "normal";
          table.style.wordBreak="normal";

          $("#ideaModal").modal('show');
  			}
  		});
}

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
