/*jshint multistr: true */

var allIdeas = null;
var ideaTable = {};
var currentRow;

$(document).ready(function() {
	populateTableAllIdeas();

  // upon clicking each row in the recent activity table
	$('#allIdeas tbody').on('click', 'tr', function (e) {
    // Get the row where we clicked
    var row = $(this);
    var rowData = allIdeas.row(row).data();
    var tagString = "";
    for(var i = 0; i < rowData.tags.length; i++){
      tagString += rowData.tags[i];
      tagString += " ";
    }
    document.getElementById("modalTitle").innerHTML = rowData.name;
    document.getElementById("tagParagraph").innerHTML = rowData.tagline;
    document.getElementById("descriptionParagraph").innerHTML = rowData.description + "\n";
    document.getElementById("tagList").innerHTML = "\n\n"+ tagString;

    currentRow=rowData._id;
    populateCommentTable(rowData.comments);

    $("#ideaModal").modal('show');
	});

  /* attach a submit handler to the form */
    $("#commentForm").submit(function(event) {

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
            creator: "creator"
          },
          render :
          function(data, type, row){
            return "<p id=tagline>" +  data.tagline + "</p> <p id=description>" + data.description + "</p> <p id=author> Submitted by " + data.creator + "</p>";
          }

        },
        {
          width: "15%",
          data: {
            likers : "likers",
            //comments: "comments.length"
          },
          render :
          function(data, type, row){
            return "<img src=/images/likeImage.png id=facebookLike> <p id=likeCount> +" + data.likers.length + " on board!</p><p id=commentCount> + " + data.comments.length + " comments</p>";
          }
        },
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
        "pagingType": "simple",
        "pageLength" : 100,
        scrollY:        200,
        scrollCollapse: true,
        searchable: false,
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
