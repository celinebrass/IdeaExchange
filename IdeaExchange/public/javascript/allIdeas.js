var recentActivityTable = null;
var ideaTable = {};

$(document).ready(function() {
  console.log("Ready");
	populateTableAllIdeas();
});

function populateTableAllIdeas() {

  console.log("Looking for Ideas");
	$.getJSON('/ideas', function(data) {
		JSON.stringify(data);
		allIdeas = $('#allIdeas').DataTable({
			destroy: true,
			data: data,
			"order": [ 0, 'desc' ],
			"pageLength" : 25,
			columns: [
        { data: "name",
          render :
          function(data, type, row){
            console.log(data);
            return "<h2 id=tableName>" +  data + "</h2>";
          }
        },

        {
          data: {
            tagline : "tagline",
            description: "description",
            creator: "creator"
          },
          render :
          function(data, type, row){
            console.log(data);
            return "<p id=tagline>" +  data.tagline + "</p> <p id=description>" + data.description + "</p> <p id=author>" + data.creator + "</p>";
          }

        },
        {
          data: {
            likes : "likers.length",
            //comments: "comments.length"
          },
          render :
          function(data, type, row){
            return "<img src=/images/likeImage.png width=20px height=20px id=facebookLike> <p id=likeCount>" + likes + "</p><p id=commentCount> comments </p>";
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


		var $rows = $('#allIdeas tr');
			$rows.each(function(i, item) {
	    	$this = $(item);
	    	$this.addClass('allIdeas');
	    });

		//make the table layout fixed
		var table = document.getElementById('allIdeas');
		table.style.tableLayout="fixed";
		table.style.whiteSpace = "normal";
		table.style.wordBreak="normal";

	});
}
