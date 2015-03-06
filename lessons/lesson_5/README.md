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

  1. The classes used to graph the Real-Time data are built using a popular graphics library called d3.  If you’re interested, there is more information at http://d3js.org/.  All you really need to know is that we will be including this library in our project using the following JavaScript included directly beneath the JQuery include you’ve already put in the head section of your HTML:
```html
<head>
    ...
    <script src="js/jquery-2.1.0.min.js" type="text/javascript"></script>

    <!-- Using D3 for Charting -->
    <script src="js/d3.v2.js" type="text/javascript" ></script>
    ...
</head>
```

  2. In addition to d3, we will need to add a JavaScript class file for the graph object we are using to chart the Real-Time data.  The JavaScript file to include (d3.animated_trend.js) already exists in your code base.  Add it beneath the script tag for d3:
```html
<head>
    ...
    <script src="js/d3.v2.js" type="text/javascript" ></script>
    <script src="js/d3.animated_trend.js" type="text/javascript"></script>
    ...
</head>
```

Create the Trend Line Graph Object
-----

Now that we have included all of the JavaScript dependencies, let’s create our graph.

  1. First, instantiate a new graph object.  This can be done beneath your existing JavaScript for instantiating the `params` variable:
```html
<script>
    ...
    params = {
       "reportDescription" {
          ...
       }
    };

    ...
    var trendGraph = new AnimatedTrendGraph("#trendGraph", { width: 660, height: 200, delay: 60000});
</script>
```

We’ve set the width and height to fit our dashboard.  The delay parameter is set to one minute (or 60,000 ms) because this is how long it takes before we receive a new data point.  Don’t worry, we are still updating the current minute every 15 seconds, so the graph will show that point moving as it collects data.  The delay parameter is only necessary because it tells the graph how quickly to animate.

The file we included declares the AnimatedTrendGraph class.  This class takes a selector and some configuration options.  Notice that we have not passed any data to it yet, so if you refresh the page at this point, nothing will be shown.  Also notice we’ve told the graph to display at an element having id=”trendGraph”.  It’s located right next to our updating number:

```html
<div id="numberWidget" class="widget third">
</div>
<div id="trendGraph" class="widget twothirds">
</div>
```

Use the “realtime-data-received” Event to Update the Graph
-----

Now that we have done all the work to fire an event, we can easily update other parts of the page each time new Real-Time data is received by our dashboard.   This is the perfect place for us to set our data for our trend line.

  1. Add this line below the listener for the number counter:
```javascript
$( document ).on("realtime-data-received", function(event, report) {
    // nothing here yet…
};
```
This will be called every time there is new data for our dashboard to display.  To take advantage of this, we can use the trendGraph class we created earlier.

  2. Add the call below to your trendGraph object to update with the new data:
```javascript
$( document ).on("realtime-data-received", function(event, report) {

    // ...some sort of data transform will go here

    trendGraph.redrawGraph(data);
});
```
But we still need the data from report to be in the proper format.  For this, we will use a data transform.  It is important to note the data required for the redrawGraph function is an array of numbers for each point that is graphed from left to right.  For example, the array [4, 2,7] would display a graph displaying the values 4, 2, and 7 in that order from left to right.

  3. The Real-Time data is formatted so that each element represents a period of realtime data, with each of your broken down elements inside it. Rather than looping through the entire array and adding up all the results for each minute, we are just going to look at the most recent minute and display that data. To do this, we apply a simple array function to pull the breakdownTotal (i.e. the total number of instances in that minute for each broken down element).
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
