

$(document).ready(function() {
	populateBubbleAllIdeas();
});

function populateBubbleAllIdeas() {
   d3.json("/ideas", function(data) {
    console.log(d3);
    var width = window.innerWidth,
      height = window.innerHeight,
      padding = 1.5, // separation between same-color circles
      clusterPadding = 6, // separation between different-color circles
      maxRadius = 12;
      minRadiusSq = 10;

    var n = data.length, // total number of circles
        m = 1; // number of distinct clusters


    var color = d3.scale.category10()
        .domain(d3.range(n));

    console.log(color);
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
      var r = Math.sqrt(data[count].likers.length) + minRadiusSq,
          label = data[count].name,
          o = r,
          d = {cluster: i, originalR: o, radius: r, label: label};
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
        .text(function(d) { return d.label; })
        .style("fill", function(d) { return color(d.cluster); })
        .call(force.drag)
        .on("mouseover", onMouseover)
        .on("mouseleave", onMouseleave);

    function tick(e) {
      circle
          .each(cluster(10 * e.alpha * e.alpha))
          .each(collide(0.5))
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    }

    function onMouseover() {
      var circle = d3.select(this);
      circle.transition().duration(300)
        .attr("r", circle.attr("o") * 1 + 10 );
    }

    function onMouseleave() {
      var circle = d3.select(this);
      circle.transition().duration(200)
        .attr("r", circle.attr("o"));
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
