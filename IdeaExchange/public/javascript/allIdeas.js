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
				{ data: 'name', width:'10%' },
				{ data: 'description', width: '10%' },
				{ data: 'creator', width: '40%' },
			],
			language: {
				emptyTable: function () {
					return '<p class="text-center">There are no ideas to date.</p>';
				}
			},
			drawCallback: function (settings) {
				var pgr = $(settings.nTableWrapper).find('.dataTables_paginate')
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
