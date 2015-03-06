Lesson 5 – Add a Trend Line
=====

Objectives
-----
 * Add the javascript dependencies
 * Create the Trend Line graph object
 * Use the “realtime-data-received” event to update the graph

Add the JavaScript Dependencies
-----

First, we will want to instantiate our graph object.  This object is included in a JavaScript file located in your code directory. The JavaScript classes for graphing Real-Time data included in this example were built by the Adobe Web Services team.  This code is free to use, but is for example purposes only.

  1. First, we want to include additional javascript libraries in our project in order to display our graph. Add these lines directly beneath the jQuery include we’ve already put in the head section of our HTML:

  ```html
  <!-- Using D3 for Charting -->
  <script src="js/d3.v2.js" type="text/javascript" ></script>
  <script src="js/d3.animated_trend.js" type="text/javascript"></script>
  ```

  > Our graph uses a popular graphics library called [d3](http://d3js.org/). The first file includes this library in our project.

  > The second file is a custom library built just for this example that will do most of the work to display our graph.

Create the Trend Line Graph Object
-----

Now that we have included all of the JavaScript dependencies, let’s create our graph.

  1. First, instantiate a new graph object. Add the following code just below the ending `};` of our `var params` array:

  ```javascript
  var trendGraph = new AnimatedTrendGraph("#trendGraph", { width: 660, height: 200, delay: 60000});
  ```

We’ve set the width and height to fit our dashboard.  The delay parameter is set to one minute (or 60,000 ms) because this is how long it takes before we receive a new data point.  Don’t worry, we are still updating the current minute every 5 seconds, so the graph will show that point moving as it collects data.  The delay parameter is only necessary because it tells the graph how quickly to animate.

The file we included declares the `AnimatedTrendGraph` class.  This class takes a selector and some configuration options.  Notice that we have not passed any data to it yet, so if you refresh the page at this point, nothing will be shown.  Also notice we’ve told the graph to display at an element having `id="trendGraph"`.  It’s located right next to our updating number:

```html
<div id="numberWidget" class="widget third">
</div>
<div id="trendGraph" class="widget twothirds">
</div>
```

Use the "realtime-data-received" Event to Update the Graph
-----

Now that we have done all the work to fire an event, we can easily update other parts of the page each time new Real-Time data is received by our dashboard.   This is the perfect place for us to set our data for our trend line.

  1. Add this line below the listener for the number counter so your trendGraph object updates with the new data:

  ```javascript
  $( document ).on("realtime-data-received", function(event, report) {
      trendGraph.redrawGraph(data);
  };
  ```

But we still need the data from report to be in the proper format.  For this, we will use a data transform so that the data looks like the array `[4, 2, 7]`. This will display a graph displaying the values 4, 2, and 7 in that order from left to right.

  3. We want the total number of pageviews for each five-minute period of our report. To do this, we apply a simple array function to pull the `breakdownTotal` (i.e. the total number of instances in that minute for each broken down element).

  ```javascript
  // pull the minute totals for each minute
  data = report.data.map(function(minute) {
      return parseInt(minute.breakdownTotal[0]);
  });
  ```

  4. So, putting it all together, you should have something that looks like the following code:

  ```javascript
  // trends graph
  $( document ).on("realtime-data-received", function(event, report) {
      // pull the minute totals for each minute
      // formatted data is [100, 200, 300, ...] (newest data last)
      data = report.data.map(function(minute) {
          return parseInt(minute.breakdownTotal[0]);
      });

      trendGraph.redrawGraph(data);
  });
  ```

Refresh your page and you should see a continuously-updating trended graph.

You'll notice that there are only 5 points being displayed on the graph. This is not as useful as we might want. Let's update the call to ask for 17 data points.  This will give us one to display off the edge on either side, to give us a full graph.

```javascript
var params = {
    "reportDescription":{
        "reportSuiteID": config.reportSuite,
        "metrics": [
            { "id": "pageviews" }
        ], "elements": [
            { "id": "page" }
        ],
        "dateFrom": "-17 minutes",
        "dateGranularity": "minute:1",
        "source": "realtime"
    }
};
```

Now, when you refresh your page, you should see a graph with 15 points that updates continuously. Nice work!

**Continue to [Lesson 6](../lesson_6) »**
