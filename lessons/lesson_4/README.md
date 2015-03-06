Lesson 4 – Populate a Table
=====

Objectives
-----
*	Trigger an event
*	Generate HTML for the table
* 	Automatically update the page

Trigger an event
-----

Before we can begin to populate multiple items on the page, we need to make it easier to populate multiple items on the page with one call. It can be more effective to broadcast a data event when the report response is received.  This event allows multiple processes to bind to the event and update their specific content separately.  Begin this lesson by opening lesson #4 index.html in the code editor.

1.	We need to first broadcast a real-time data event when the data is received.  jQuery provides a built-in event interface for doing exactly what we need. As in previous examples, we need to make these changes are made to the `MarketingCloud.makeRequest` callback function:

    ```javascript
    // make the API call
    MarketingCloud.makeRequest(config.username, config.secret, method, params, config.endpoint, function(response) {
        var event = jQuery.Event("realtime-data-received");
        $( document ).trigger(event, response.responseJSON.report);
    });
    ```

2.	Next, define an event listener to handle this data when the event is broadcast. Our script will later use a separate event listener for each data update task. Initially, we will re-link the total heading to use an event.  Inside the `<script>`, just above the `$( document ).ready()` function, declare the following JavaScript:

    ```javascript
    $( document ).on("realtime-data-received", function(event, report) {
        var total = report.totals[0];
        var numStep = $.animateNumber.numberStepFactories.separator(",");
        $("#total").animateNumber({
            number:total,
            numberStep: numStep
        }, 500);
    });
    ```

3.	Reload the page in the browser to make sure the heading total animation still functions.

Generate HTML for the table
-----

We need to populate a table for displaying ranked items in the report response data. This table will be generated from a defined stub duplicated for each report item.

1.	Begin by including two javascript files. The first includes custom prototype functions which will help format the report data. The second includes javascript that will make it easy to create our table. Add them just below our previously added javascript includes (`wsse,js` and `marketing_cloud.js`).

    ```javascript
    <script src="js/custom.js" type="text/javascript"></script>
    <script src="js/jquery.basic_table.js" type="text/javascript"></script>
    ```

2.  Next, add the following html inside the `<div id="ranked" ...>` tag in the body of your page:

    ```html
    <div id="data-table">&nbsp;</div>
    ```

    > This identifies where on the page our data table will be created.

3.	Finally, define an additional event listener to handle populating the table. Place this new listener definition above the definition we added in the previous exercise. The order of the listeners does not matter.

    ```javascript
    $( document ).on("realtime-data-received", function(event, report) {
        // format the data
        totals =[];
        $(report.data).each(function(i, minute) {
            $(minute.breakdown).each(function (j, page) {
                total = parseInt(page.counts[0]) + (totals[j] ? totals[j][1] : 0);
                totals[j] = [page.name, total];
            });
        });

        var basicTable = new BasicTable("#data-table", { columns: ["Page", "Page Views"] });
        basicTable.update(totals);
    });
    ```

    > The first block of code in the listener formats the report data so that we have the totals of each page over the entire duration of our report (15 minutes). Because our report does not have this data, we must iterate over the response and aggregate it ourselves.

    > The second block of code instantiates our table object and builds the HTML for our dashboard.

4.	Reload the page in the browser to see the table populate.

Automatically update the page
-----

Reloading the browser window each time data needs to be updated isn’t very convenient. This exercise will specify a time interval for which the page should update automatically.
You can automatically update the page by using a function called `setInterval()` . It runs a function at a specified time interval and will continue to do so until the interval is cleared with `clearInterval()`.

1.	Before we can use `setInterval()`, we need to declare a function to make a real-time API request with a simple call to that function using `makeRealTimeRequest()`. This should be added just below the `$( document ).ready(...)` function.

    ```javascript
    var makeRealTimeRequest = function() {
        MarketingCloud.makeRequest(config.username, config.secret, method, params, config.endpoint, function(response){
            var event = jQuery.Event("realtime-data-received");
            $( document ).trigger(event, response.responseJSON.report);
        });
    };
    ```
 
2.	Now that `makeRealTimeRequest()` is defined, we can pass that into the `setInterval()` call. Replace your existing code inside `$( document ).ready(...)` with the following function:

    ```javascript
    $( document ).ready(function() {
        var interval = 5000; // milliseconds (5 seconds)
        setInterval(makeRealTimeRequest, interval);
    });
    ```

3.	Refresh the page in the browser to see that the page is updated every 5 seconds.

4.	One thing to keep in mind with `setInterval()` is that the function is called after the specified time interval has elapsed.  Therefore, if we want the data to display as soon as possible after a page load, we should call the function prior to using `setInterval()`.

    ```javascript
    $( document ).ready(function() {
        // set the dashboard to make a report request every 5 seconds
        var time = 5000; // milliseconds
        var interval = setInterval(makeRealTimeRequest, time);
        // request the initial report
        makeRealTimeRequest();
    });
    ```

5.	Refresh the page in the browser to see that the data is loaded immediately instead of after 5 seconds.

**Continue to [Lesson 5](../lesson_5) »**
