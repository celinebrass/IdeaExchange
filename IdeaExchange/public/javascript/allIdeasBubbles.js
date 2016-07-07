

$(document).ready(function() {
	populateBubbleAllIdeas();
});

function handleChange(event) {
	d3.json("/ideas", function(data) {

		var tag = document.getElementById("myTag").value;
		var color = d3.scale.category10()
				.domain(d3.range(data.length));

		if (tag == "") {
			for (var i = 0; i < data.length; i++) {
				document.getElementById(i).style.opacity = '0.75';
				document.getElementById("t"+i).style.opacity = '1';
			}
		}
		else {
			for (var i = 0; i < data.length; i++) {
				if (!data[i].tags.includes(tag) && !data[i].name.toLowerCase().includes(tag) && !data[i].tagline.toLowerCase().includes(tag) && !data[i].description.toLowerCase().includes(tag)) {
					document.getElementById(i).style.opacity = '0.2';
					document.getElementById("t"+i).style.opacity = '0';
				}
				else {
					document.getElementById(i).style.opacity = '1';
					document.getElementById("t"+i).style.opacity = '1';
				};
			}
		}
	});
	return false;
}

function populateBubbleAllIdeas() {
	d3.json("/ideas", function(data) {

    var width = screen.width,
      height = 1500,
      padding = 1.5, // separation between same-color circles
      clusterPadding = 6, // separation between different-color circles
      maxRadius = 12;

    var n = data.length, // total number of circles
        m = 1; // number of distinct clusters

		document.getElementById("numIdeas").innerHTML = n;

    var color = d3.scale.category20()
        .domain(d3.range(n));

    // The largest node for each cluster.
    var clusters = new Array(m);
    var count = 0;
    // The current tag that we will be grouping on
    var currentClusterTag = [data[0].tags[0]];

    var nodes = d3.range(n).map(function() {
      var i = 0;
      for (var j = 0; j < currentClusterTag.length; j++) {
        if (data[count].tags.includes(currentClusterTag[j])) {
          i = j;
          break;
        } else if (j == currentClusterTag.length-1) {
          i = currentClusterTag.length;
          currentClusterTag.push(data[count].tags[0]);
        }
      }
      var r = (data[count].likers.length)/data.length*10 + 10,
          label = data[count].name,
          o = r,
          d = {cluster: i, originalR: o, radius: r, label: label, id: count};
      if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
      count++;
      return d;
    });

    var force = d3.layout.force()
        .nodes(nodes)
        .size([width, height])
        .gravity(.02)
        .charge(0)
        .on("tick", tick)
        .start();

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    var circle = svg.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", function(d) { return d.radius; })
        .attr("o", function(d) { return d.originalR; })
				.attr("id", function(d) { return d.id; })
				.attr("cluster", function(d) { return d.cluster; })
				.attr("label", function(d) { return d.label; })
        .style("fill", function(d) { return color(d.cluster); })
				.style("opacity", 0.75)
        .call(force.drag)
        .on("mouseover", onMouseover)
				.on("mouseleave", onMouseleave)
        .on("click", onClick);

		var text = svg.selectAll("text")
	      .data(nodes)
	      .enter()
	      .append("text")
				.attr("x", function(d) {return d.x - d.radius})
        .attr("y", function(d) {return d.y})
				.attr("font-size", function(d) {return d.radius/3})
				.attr("id", function(d) {return "t"+d.id})
				.text(function(d) {return d.label})
				.call(force.drag);

    function tick(e) {
      circle
          .each(cluster(10 * e.alpha * e.alpha))
          .each(collide(0.5))
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
			text
					.each(cluster(10 * e.alpha * e.alpha))
					.each(collide(0.5))
					.attr("x", function(d) { return d.x - d.radius; })
					.attr("y", function(d) { return d.y; });
    }

    function onMouseover() {
      var circle = d3.select(this);
			document.getElementById('curIdea').innerHTML = this.attributes.label.value;
			document.getElementById('curTags').innerHTML = data[this.id].tags.join(" ");
			document.getElementById('curLikes').innerHTML = data[this.id].likers.length;
			this.parentElement.appendChild(this);
			console.log(data[this.id].likers.length);
			text[0][this.id].parentElement.appendChild(text[0][this.id]);
      circle.transition().duration(400)
        .attr("r", circle.attr("o") * 1.5 )
				.style("opacity",1);
    }

    function onClick() {
      var circle = d3.select(this);
			var newtext = text[0][this.id];
      this.parentElement.appendChild(this);
      circle.transition().duration(500)
        .attr("r", 400);
		  var tagString = "";
	    for(var i = 0; i < data[this.id].tags.length; i++){
	      tagString += data[this.id].tags[i];
	      tagString += " ";
	    }
		 	document.getElementById("modalTitle").innerHTML = data[this.id].name;
	    document.getElementById("tagParagraph").innerHTML = data[this.id].tagline;
	    document.getElementById("descriptionParagraph").innerHTML = data[this.id].description + "\n";
	    document.getElementById("tagList").innerHTML = "\n\n"+ tagString;
			populateCommentTable(this.id);
			$("#ideaModal").modal('show');

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
    }

    function onMouseleave() {
      var circle = d3.select(this);
			var newtext = text[0][this.id];
      circle.transition().duration(400)
        .attr("r", circle.attr("o"))
				.style("opacity", 0.75);
			var firstChild = this.parentNode.firstChild;
			if (firstChild) {
					this.parentNode.insertBefore(this, firstChild);
			}
			document.getElementById('curIdea').innerHTML = "";
			document.getElementById('curTags').innerHTML = "";
			document.getElementById('curLikes').innerHTML = "";
			document.getElementById("t"+this.id).innerHTML = data[this.id].name;
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
    // Move d to be adjacent to the cluster node.
    function cluster(alpha) {
      return function(d) {
        var cluster = clusters[d.cluster];
        if (cluster === d) return;
        var x = d.x - cluster.x,
            y = d.y - cluster.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + cluster.radius;
        if (l != r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          cluster.x += x;
          cluster.y += y;
        }
      };
    }

    // Resolves collisions between d and all other circles.
    function collide(alpha) {
      var quadtree = d3.geom.quadtree(nodes);
      return function(d) {
        var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;
        quadtree.visit(function(quad, x1, y1, x2, y2) {
          if (quad.point && (quad.point !== d)) {
            var x = d.x - quad.point.x,
                y = d.y - quad.point.y,
                l = Math.sqrt(x * x + y * y),
                r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
            if (l < r) {
              l = (l - r) / l * alpha;
              d.x -= x *= l;
              d.y -= y *= l;
              quad.point.x += x;
              quad.point.y += y;
            }
          }
          return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
      };
    }
  })
}

function populateCommentTable(i) {
	console.log("populating comments table");
	d3.json("/ideas",function(dat) {
		var comments = dat[i].comments;
		console.log(comments);
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
				}
		});
	});
}
