Lesson 6 – Add a Doughnut Chart
=====

Objectives
-----
  * Create the Doughnut Chart object
  * Use the “realtime-data-received” event into the event to

Create the Doughnut Chart Object
-----

Our Doughnut Chart JavaScript class uses the same library (d3) as our trend line class. Lucky us!  This means we only need to include one JavaScript file to get this up and running.

1. Include the file d3.doughnut.js in your project below the other JavaScript includes:
```html
    <head>
        ...
    	<!-- Using D3 for Charting -->
        <script src="js/d3.v2.js" type="text/javascript" ></script>
        <script src="js/d3.animated_trend.js" type="text/javascript" ></script>
        <script src="js/d3.doughnut.js" type="text/javascript" ></script>
        ...
    </head>
```
Now we just need to create a new graph object, just like before.

2. First, instantiate a new graph object.  This can be done beneath your existing JavaScript for instantiating the `params` variable.
```html
    <script>
        ...
    	var trendGraph = new AnimatedTrendGraph("#trendGraph", { width: 660, height: 200, delay: 60000});
    	var doughnutChart = new DoughnutChart("#doughnutChart", { width: 300, height: 450});
    </script>
```

3. The ID `#doughnutChart` that we’ve specified for our Doughnut Chart doesn’t actually exist yet, so go ahead and add this to your HTML.  The HTML for this chart looks like this:
```html
    <div id="1half" class="widget half">
        <div id="doughnutChart">
            <div id="explanation" style="visibility: hidden;">
                <span id="percentage"></span><br/>
                  of visitors for
            </div>
            <div id="pagelabel">&nbsp;</div>
        </div>
        <div id="legend">&nbsp;</div>
    </div>
```

Add this just beneath the markup for the `#trend` chart.  We’ve dropped the code for this widget in a column format so that it appears next to our table.  In order for this to appear nicely, we need to wrap our existing table code in another div so that it floats to the right:

```html
<div id="2half" class="widget half">
    <div id="ranked" class="widget">
        <!-- data table -->
        <table id="data-table" class="data-table">
            <!-- YOUR TABLE CODE HERE -->
        </table>
    </div>
</div>
```

Now we just need to hook into our event, send the data in as the Doughnut Graph wants to see it, and our dashboard will be complete.
 
Use the "realtime-data-received" event to update the graph
-----

We want to hook into our custom event listener.

1.	Add this line below the listener we added in the previous chapter for the trend line graph.
```js
    $( document ).on("realtime-data-received", function(event, report) {
        // nothing here yet…
    };
```
Let’s redraw our doughnut chart when we have new data.  We can use the `doughnutChart` class we created earlier.

2.	Add the call to your doughnutChart object to update with the new data:
```js
    $( document ).on("realtime-data-received", function(event, report) {

        // ...some sort of data transform will go here

        doughnutChart.redrawGraph(data);
    });
```
Once again, we need to get our data in the proper format. The Doughnut Chart data is more or less the inverse of the previous data set.  Rather than displaying the totals for each minute, and ignoring the individual pages, we want to display the totals for the pages regardless of the minute. This should be in the following format:
```js
    [
        ["Homepage", 11235],
        ["Contact Us", 3123],
        ["Page Name #3", 123],
        ["Page Name #4", 107],
        ...
    ]
```
Unlike our last data set, this data does not have to be in any particular order.

1.	The Real-Time data is formatted so that each element is a time period with all the elements recording for that period. So we can loop through the first minute and return the total, along with the name property, to create the array above.
```js
    data = report.data[0].breakdown.map(function(page) {
        return [page.name, page.counts[0]];
    });
```

2.	Surround this call in a conditional so it only refreshes once a minute, as five seconds is too often:
```js
    count = typeof count == 'undefined' ? 0 : (count + 1) % 12;
    if (count == 0) {
        //...refresh the data
    }
```

3.	You should have something that looks like the following code:
```js
    // doughnut chart
    $( document ).on("realtime-data-received", function(event, report) {
        // we only update this chart once a minute
        count = typeof count == 'undefined' ? 0 : (count + 1) % 12;
        if (count == 0) {
            // return the total count for each page
            // formatted data is [["PageName", 123], ["PageName 2", 456]] for each page shown in the doughnut
            data = report.data[0].breakdown.map(function(page) {
                return [page.name, page.counts[0]];
            });

            donutChart.redrawChart(data);
        }
    });
```

Refresh your page, and you should see a very nice looking doughnut graph.
