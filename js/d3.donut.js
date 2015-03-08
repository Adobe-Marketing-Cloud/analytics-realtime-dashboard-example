/*
 Adobe Real-Time Dashboard Example (2014-03-27)

 Javascript class to create a donut chart

 License: Apache License (See Project License)

 Author: Brent Shaffer
*/
function DonutChart(id, config) {
  // for event handlers
  var donutchart = this;

  // Dimensions of the chart.
  config = config ? config : {};
  this.width = config.width || 300;
  this.height = config.height || 300;
  this.separator = config.separator || null;
  this.legend = [];

  this.radius = Math.min(this.width, this.height) / 2;
  this.chartdata = null;

  // Breadcrumb dimensions: width, height, spacing, width of tip/tail.
  this.b = { w: 75, h: 30, s: 3, t: 10 };

  // label dimensions
  this.l = { w: this.width*(3/5), h: 30, s: 3, t: 10 };

  // Mapping of step names to colors.
  this.colors = [
    "#5687d1",
    "#7b615c",
    "#de783b",
    "#6ab975",
    "#a173d1",
    "#bbbbbb",
    "#ffaa00",
    "#d1d173",
    "#b96a7e"
  ];

  // Total size of all segments; we set this later, after loading the data.
  this.totalSize = 0;

  this.redrawChart = function(data) {
    d3.select(id).selectAll('svg').remove();

    data.splice(this.colors.length);
    json = this.buildHierarchy(data);
    this.createVisualization(json);
  };

  // Main function to draw and set up the visualization, once we have the data.
  this.createVisualization = function(json) {
    var self = this;
    self.legend = [];

    this.vis = d3.select(id).append("svg:svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("svg:g")
      .attr("id", "container")
      .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");

    this.partition = d3.layout.partition()
      .size([2 * Math.PI, this.radius * this.radius])
      .value(function(d) { return d.size; });

    this.arc = d3.svg.arc()
      .startAngle(function(d) { return d.x; })
      .endAngle(function(d) { return d.x + d.dx; })
      .innerRadius(function(d) { return Math.sqrt(d.y); })
      .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

    this.chartdata = json.children;

    d3.select("#togglelegend")
      .on("click", this.toggleLegend);

    // Bounding circle underneath the sunburst, to make it easier to detect
    // when the mouse leaves the parent g.
    this.vis.append("svg:circle")
      .attr("r", this.radius)
      .style("opacity", 0);

    // For efficiency, filter nodes to keep only those large enough to see.
    var nodes = this.partition.nodes(json)
      .filter(function(d) {
        return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
    });

    var path = this.vis.data([json]).selectAll("path")
      .data(nodes)
      .enter().append("svg:path")
      .attr("display", function(d) { return d.depth ? null : "none"; })
      .attr("d", this.arc)
      .attr("fill-rule", "evenodd")
      .style("fill", function(d, i) {
          if (self.colors.length <= i-1) {
              self.colors.push(self.generateColor());
          }
          d.color = self.colors[i - 1];
          if (!d.children) {
              self.legend.push(d);
          }
          return d.color;
      })
      .style("opacity", 1)
      .on("mouseover", this.mouseover);

    // Basic setup of page elements.
    this.initializeLabels();
    this.drawLegend();

    // Add the mouseleave handler to the bounding circle.
    d3.select("#container").on("mouseleave", this.mouseleave);

    // Get total size of the tree = value of root node from partition.
    this.totalSize = path.node().__data__.value;
  };

  // Fade all but the current sequence, and show it in the breadcrumb trail.
  this.mouseover = function(d) {
    var percentage = (100 * d.value / donutchart.totalSize).toPrecision(3);
    var percentageString = percentage + "%";
    if (percentage < 0.1) {
      percentageString = "< 0.1%";
    }

    d3.select("#percentage")
      .text(percentageString);

    d3.select("#explanation")
      .style("visibility", "");

    d3.select("#pagelabel")
      .style("visibility", "");

    var sequenceArray = donutchart.getAncestors(d);
    donutchart.updateLabels(sequenceArray, percentageString);

    // Fade all the segments.
    d3.select(id).selectAll("path")
        .style("opacity", 0.3);

    // Then highlight only those that are an ancestor of the current segment.
    donutchart.vis.selectAll("path")
      .filter(function(node) {
        return (sequenceArray.indexOf(node) >= 0);
      })
      .style("opacity", 1);
  };

  // Restore everything to full opacity when moving off the visualization.
  this.mouseleave = function(d) {

    // Hide the breadcrumb trail
    d3.select("#trail")
      .style("visibility", "hidden");

    d3.select("#pagelabel")
      .style("visibility", "hidden");

    // Deactivate all segments during transition.
    d3.select(id).selectAll("path").on("mouseover", null);

    // Transition each segment to full opacity and then reactivate it.
    d3.select(id).selectAll("path")
      .transition()
      .duration(500)
      .style("opacity", 1)
      .each("end", function() {
        d3.select(this).on("mouseover", donutchart.mouseover);
      });

    d3.select("#explanation")
      .transition()
      .duration(500)
      .style("visibility", "hidden");
  };

  // Given a node in a partition layout, return an array of all of its ancestor
  // nodes, highest first, but excluding the root.
  this.getAncestors = function(node) {
    var path = [];
    var current = node;
    while (current.parent) {
      path.unshift(current);
      current = current.parent;
    }

    return path;
  };

  this.initializeBreadcrumbTrail = function() {
    // Add the svg area.
    var trail = d3.select("#sequence").append("svg:svg")
      .attr("width", this.width)
      .attr("height", 50)
      .attr("id", "trail");

    // Add the label at the end, for the percentage.
    trail.append("svg:text")
      .attr("id", "endlabel")
      .style("fill", "#000");
  };

  this.initializeLabels = function() {
    // Add the svg area.
    var trail = d3.select("#pagelabel").append("svg:svg")
      .attr("width", this.width*0.67)
      .attr("height", 50)
      .attr("id", "trail");
  };

  // Generate a string that describes the points of a breadcrumb polygon.
  this.breadcrumbPoints = function(d, i) {
    var points = [];
    points.push("0,0");
    points.push(this.b.w + ",0");
    points.push(this.b.w + this.b.t + "," + (this.b.h / 2));
    points.push(this.b.w + "," + this.b.h);
    points.push("0," + this.b.h);
    if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
      points.push(this.b.t + "," + (this.b.h / 2));
    }
    return points.join(" ");
  };

  this.labelPoints = function(d, i) {
    l = donutchart.l;
    var points = [];
    points.push(l.t + ",0");
    points.push(l.w + l.t + ",0");
    points.push(l.w + l.t + l.t + "," + (l.h / 2));
    points.push(l.w + l.t + "," + l.h);
    points.push(l.t + "," + l.h);
    points.push("0," + (l.h / 2));
    return points.join(" ");
  };

  // Update the breadcrumb trail to show the current sequence and percentage.
  this.updateLabels = function(nodeArray, percentageString) {
    var self = this;

    var selectedNode = nodeArray[nodeArray.length-1];

    // Data join; key function combines name and depth (= position in sequence).
    var g = d3.select("#trail")
        .selectAll("g")
        .data([selectedNode], function(d) { return d.name; });

    // Add breadcrumb and label for entering nodes.
    var entering = g.enter().append("svg:g");

    entering.append("svg:polygon")
      .attr("points", this.labelPoints)
      .style("fill", function(d, i) {
        return d.color;
      });

    var charcount = (this.l.w)/8;
    entering.append("svg:text")
      .attr("x", (this.l.w + this.b.t) / 2)
      .attr("y", this.l.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.name.length > charcount ? d.name.substr(0, charcount).trim() + '...' : d.name; });

    // Set position for entering and updating nodes.
    g.attr("transform", function(d, i) {
      return "translate(" + i * (self.l.w + self.l.s) + ", 0)";
    });

    // Remove exiting nodes.
    g.exit().remove();

    // Make the breadcrumb trail visible, if it's hidden.
    d3.select("#trail")
      .style("visibility", "");
  };

  // Update the breadcrumb trail to show the current sequence and percentage.
  this.updateBreadcrumbs = function(nodeArray, percentageString) {
    var self = this;

    // Data join; key function combines name and depth (= position in sequence).
    var g = d3.select("#trail")
      .selectAll("g")
      .data(nodeArray, function(d) { return d.name + d.depth; });

    // Add breadcrumb and label for entering nodes.
    var entering = g.enter().append("svg:g");

    entering.append("svg:polygon")
        .attr("points", this.breadcrumbPoints)
        .style("fill", function(d, i) { return colors[i]; });

    entering.append("svg:text")
        .attr("x", (this.b.w + this.b.t) / 2)
        .attr("y", this.b.h / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.name; });

    // Set position for entering and updating nodes.
    g.attr("transform", function(d, i) {
      return "translate(" + i * (self.b.w + self.b.s) + ", 0)";
    });

    // Remove exiting nodes.
    g.exit().remove();

    // Now move and update the percentage at the end.
    d3.select("#trail").select("#endlabel")
        .attr("x", (nodeArray.length + 0.5) * (this.b.w + this.b.s))
        .attr("y", this.b.h / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text(percentageString);

    // Make the breadcrumb trail visible, if it's hidden.
    d3.select("#trail")
        .style("visibility", "");

  };

  this.drawLegend = function() {
    var self = this;

    // Dimensions of legend item: width, height, spacing, radius of rounded rect.
    var li = {
      w: 140, h: 30, s: 3, r: 3
    };

    // remove legend in case it exists
    d3.select("#legend").select("svg").remove();

    var legend = d3.select("#legend").append("svg:svg")
        .attr("width", li.w)
        .attr("height", this.legend.length * (li.h + li.s));

    var g = legend.selectAll("g")
        .data(this.legend)
        .enter().append("svg:g")
        .attr("transform", function(d, i) {
            return "translate(0," + i * (li.h + li.s) + ")";
        });

    g.append("svg:rect")
        .attr("rx", li.r)
        .attr("ry", li.r)
        .attr("width", li.w)
        .attr("height", li.h)
        .style("fill", function(d) { return d.color; });

    g.append("svg:text")
        .attr("x", 10)
        .attr("y", li.h / 2)
        .attr("width", li.w)
        .attr("dy", "0.35em")
        .attr("text-anchor", "start")
        .text(function(d, i) {
            return d.name;
        });
  };

  this.toggleLegend = function() {
    var legend = d3.select("#legend");
    if (legend.style("visibility") == "hidden") {
      legend.style("visibility", "");
    } else {
      legend.style("visibility", "hidden");
    }
  };

  // Take a 2-column CSV and transform it into a hierarchical structure suitable
  // for a partition layout. The first column is a sequence of step names, from
  // root to leaf, separated by hyphens. The second column is a count of how
  // often that sequence occurred.
  this.buildHierarchy = function(csv) {
    var root = {"name": "root", "children": []};
    for (var i = 0; i < csv.length; i++) {
      var sequence = csv[i][0];
      var size = +csv[i][1];
      if (isNaN(size)) { // e.g. if this is a header row
        continue;
      }
      var parts = this.separator ? sequence.split(this.separator) : [sequence];
      var currentNode = root;
      for (var j = 0; j < parts.length; j++) {
        var children = currentNode["children"];
        var nodeName = parts[j];
        var childNode;
        if (j + 1 < parts.length) {
          // Not yet at the end of the sequence; move down the tree.
          var foundChild = false;
          for (var k = 0; k < children.length; k++) {
            if (children[k]["name"] == nodeName) {
              childNode = children[k];
              foundChild = true;
              break;
            }
          }
          // If we don't already have a child node for this branch, create it.
          if (!foundChild) {
            childNode = {"name": nodeName, "children": []};
            children.push(childNode);
          }
          currentNode = childNode;
        } else {
          // Reached the end of the sequence; create a leaf node.
          childNode = {"name": nodeName, "size": size};
          children.push(childNode);
        }
      }
    }
    return root;
  };

  this.generateColor = function() {
      hex = Math.floor(Math.random()*16777215).toString(16);

      return '#' + "000000".substring(0, 6-hex.length) + hex;
  };
}
