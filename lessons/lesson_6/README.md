Lesson 6 – Add a Donut Chart
=====

Objectives
-----
  * Create the Donut Chart object
  * Use the “realtime-data-received” event into the event to

Create the Donut Chart Object
-----

Our Donut Chart JavaScript class uses the same library (d3) as our trend line class. Lucky us!  This means we only need to include one JavaScript file to get this up and running.

1. Include the file `js/d3.donut.js` in your project below our previous `<script src="js/d3.animated_trend.js ...>` include:

    ```html
    <script src="js/d3.donut.js" type="text/javascript" ></script>
    ```

2. Next, we need create a new graph object. This can be done beneath our existing code for setting the `var trendGraph` variable:

    ```html
    var donutChart = new DonutChart("#donutChart", { width: 300, height: 450});
    ```

3. The ID `#donutChart` that we’ve specified for our Donut Chart doesn’t actually exist yet, so go ahead and add this immediately beneath the markup for the `#trend` chart:

    ```html
    <div id="1half" class="widget half">
        <div id="donutChart">
            <div id="explanation" style="visibility: hidden;">
                <span id="percentage"></span><br/>
                  of visitors
            </div>
            <div id="pagelabel">&nbsp;</div>
        </div>
        <div id="legend">&nbsp;</div>
    </div>
    ```

4. We must divide the lower half of our dashboard into two columns, so our Donut Chart will display next to our data table. Replace your existing code for the `data-table` with the following HTML:

    ```html
    <div id="2half" class="widget half">
        <div id="ranked" class="widget">
            <!-- data table -->
            <div id="data-table">&nbsp;</div>
        </div>
    </div>
    ```

    > All we did was wrap our existing `data-table` HTML with the container "2half", which contains the styles we need to separate it into its own column.

5. Refresh your page, and you should see your data table on the right side of the dashboard. That is the only change you will see at this time.

Use the "realtime-data-received" event to update the graph
-----

We want to hook into our custom event listener. Let’s redraw our donut chart when we have new data.

1.	Add the following block of code to draw the donut chart every time we get new data:

    ```javascript
    // donut chart
    $( document ).on("realtime-data-received", function(event, report) {
        // format the data
        var totals = [];
        $(report.data).each(function(i, minute) {
            $(minute.breakdown).each(function (j, page) {
                total = parseInt(page.counts[0]) + (totals[j] ? totals[j][1] : 0);
                totals[j] = [page.name, total];
            });
        });

        // we only update this chart once a minute
        var count = (count + 1) % 12 | 0;
        if (count == 0) {
            donutChart.redrawChart(totals);
        }
    });
    ```

    > You may notice the first section in the code block above is identical to the code we used in [Lesson 4](../lesson_4#generate-html-for-the-table). Extra credit if you can move this code to a single location (see [index.html](../../index.html) in the project root for help)

    > the conditional statement surrounding our call to `donutChart.redrawChart` is to ensure the chart is only updated once every minute.

2. Refresh your page, and you should see a very nice looking donut graph.
