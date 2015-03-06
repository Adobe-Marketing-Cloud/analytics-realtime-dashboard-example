/*
 Adobe Real-Time Dashboard Example (2014-03-27)

 Javascript class to create an animated trend graph

 License: Apache License (See Project License)

 Author: Brent Shaffer
*/
function AnimatedTrendGraph(id, config) {
  this.increment = 0;

  // set the configuration
  config = config || {};
  this.height = config.height || 400;
  this.width  = config.width || 1000;
  this.delay  = config.delay || 500;
  this.numSubdivisions = config.subdivisions || 12;

  this.drawGraph = function(data) {
    var self = this;
    this.data = data;

    // create an SVG element inside the #graph div that fills 100% of the div
    this.graph = d3.select(id)
      .append("svg:svg")
      .attr("width", "100%")
      .attr("height", "100%");

    // create a line object that represents the SVN line we're creating
    this.line = d3.svg.line()
      // assign the X function to plot our line as we wish
      .x(function(d,i) {
          // return the X coordinate where we want to plot this datapoint
          return self.x(i) - (self.distanceToIncrement() * self.increment);
      })
      .y(function(d) {
          // return the Y coordinate where we want to plot this datapoint
          return self.y(d);
      })
      .interpolate("cardinal");

    // display a line graph by appending the line to the svg:path element
    this.graph
      .append("svg:path")
      .attr("d", this.line(data));

    // add the points on the graph
    this.points = this.graph.selectAll("path")
      .data(data)
      .enter()
      .append("svg:circle")
      .attr("r", function(d, i) {return 3;});

    // draw our graph axes
    this.drawAxes();
  };

  this.redrawGraph = function(data) {
    if (!this.line) {
      this.drawGraph(data);
    }

    var self = this;

    // calculate where to draw the new points
    this.increment = (this.increment + 1) % this.numSubdivisions;

    // if we have new data, update the graph with it
    // TODO: Animate a transition to the new points
    if (data[0] != this.data[0]) {
      this.increment = 0;
      this.data = data;
    }

    // calculate delay for the size of data
    var delay = this.delay * (17/data.length) + ((12 - this.numSubdivisions) * (this.delay * .025));

    // update/animate the line
    this.graph.selectAll("path")
      .data([data]) // set the new data
      .attr("transform", "translate(" + this.x(1) + ")") // set the transform to the right by x(1) pixels (6 for the scale we've set) to hide the new value
      .attr("d", this.line) // apply the new data values ... but the new value is hidden at this point off the right of the canvas
      .transition() // start a transition to bring the new value into view
      .ease("linear")
      .duration(delay) // set time for the slide to the next graph point
      .attr("transform", "translate(" + this.x(0) + ")"); // animate a slide to the left back to x(0) pixels to reveal the new value

    // update/animate the points
    this.points
      .data(data)
      .attr("cx", function(d, i) { return self.x(i) - (self.distanceToIncrement() * self.increment);})
      .attr("cy", function(d, i) { return self.y(d);})
      .attr("transform", "translate(" + this.x(1) + ")")
      .transition()
      .ease("linear")
      .duration(delay) // set time for the slide to the next graph point
      .attr("transform", "translate(" + this.x(0) + ")");
  };

  this.findBounds = function(data, bounds) {
    if (!bounds) {
      bounds = [data[0], data[0]];
    }

    for (var i=0;i<data.length-1;i++) {
      bounds[0] = data[i] < bounds[0] ? data[i] : bounds[0];
      bounds[1] = data[i] > bounds[1] ? data[i] : bounds[1];
    }

    var domain = bounds[1] - bounds[0];
    var graphbounds = [bounds[1]+(domain/12), bounds[0]-(domain/12)];

    this.bounds = bounds;

    return graphbounds;
  };

  this.drawAxes = function() {
    xAxis = d3.svg.axis().scale(this.x()).tickSize(-4).tickSubdivide(true);
    yAxis = d3.svg.axis().scale(this.y()).ticks(4).orient("right");

    this.graph.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")")
        .call(xAxis);

    this.graph.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + this.width + ",0)")
        .call(yAxis);
  };

  this.distanceToIncrement = function() {
    // every five seconds
    return (this.width / this.data.length) / this.numSubdivisions;
  };

  // X scale function
  this.x = function(i) {
    var self = this;

    func = d3.scale.linear()
      .domain([0, self.data.length-1])
      .range([-self.width/self.data.length, self.width]);

    // when called with no arguments, return the function object
    if (typeof i == "undefined")
      return func;

    return func(i);
  };

  // Y scale function
  this.y = function(i) {
    var self = this;

    // recalculate graph scale
    graphbounds = this.findBounds(this.data, this.bounds);

    func = d3.scale.linear()
      .domain(graphbounds)
      .range([0, self.height]);

    // when called with no arguments, return the function object
    if (typeof i == "undefined")
      return func;

    return func(i);
  };
}
