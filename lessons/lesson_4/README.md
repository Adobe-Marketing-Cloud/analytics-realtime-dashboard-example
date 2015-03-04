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

1.	We need to first broadcast a real-time data event when the data is received.  jQuery provides a built-in event interface for doing exactly what we need. As in previous examples, we need to make these changes are made to the MarketingCloud.makeRequest  callback function

    ```javascript
    MarketingCloud.makeRequest(username, secret, method, params, endpoint, function(response) {
        var event = jQuery.Event("realtime-data-received");
        $( document ).trigger(event, response.responseJSON.report);
    });
    ```

2.	Next, define an event listener to handle this data when the event is broadcast. Our script will later use a separate event listener for each data update task. Initially, we will re-link the total heading to use an event.  Somewhere in the ```<script>``` tag near the ```$( document ).ready()``` function, declare the following JavaScript:

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

1.	Begin by defining two tables: a table to receive the data and a hidden table to contain the row structure.

    ```
    <table id="data-table" class="data-table">
        <tbody>
            <tr>
                <th class="page-head">Page</th>
                <th class="view-head">Page Views</th>
            </tr>
        </tbody>
    </table>
    <table id="clone-table" style="display: none;">
        <tbody>
            <tr>
                <td class="page-data">&nbsp;</td>
                <td class="page-view-data">&nbsp;</td>
            </tr>
        </tbody>
    </table>
    ```

    Note that we have defined the second table to be hidden from the browser’s display as its only purpose is to facilitate markup cloning using jQuery.

2.	We need to include some custom prototype functions which will help format the report data.

    ```javascript
    <script src="js/custom.js" type="text/javascript"></script>
    ```

3.	Define an additional event listener to handle populating the table. Place this new listener definition near the previous definition added in the previous exercise. The order of the listeners does not matter.

    ```javascript
    $( document ).on("realtime-data-received", function(event, report) {
        var row;
        var counts = "0";
        var tbody = $("#data-table").find("tbody");
        $("#data-table").find("tr:gt(0)").remove();
        for (var i in report.data[0].breakdown) {
            counts = report.data[0].breakdown[i].counts[0].toString().commaSeparate();
            row = $("#clone-table").find("tr:nth-child(1)").clone();
            row.find("td:nth-child(1)").html(report.data[0].breakdown[i].name);
            row.find("td:nth-child(2)").html(counts);
            row.appendTo(tbody);
        }
    });
    ```

4.	Reload the page in the browser to see the table populate.

Automatically update the page
-----

Reloading the browser window each time data needs to be updated isn’t very convenient. This exercise will specify a time interval for which the page should update automatically.
You can automatically update the page by using a function called setInterval() . It runs a function at a specified time interval and will continue to do so until the interval is cleared with clearInterval().

1.	Before we can use setInterval(), we need to declare a function to make a real-time API request with a simple call to that function using makeRealTimeRequest()

    ```javascript
    var makeRealTimeRequest = function() {
        MarketingCloud.makeRequest(config.username, config.secret, method, params, config.endpoint, function(response){
            var event = jQuery.Event("realtime-data-received");
            $( document ).trigger(event, response.responseJSON.report);
        });
    };
    ```
 
2.	Now that makeRealTimeRequest() is defined, we can pass that into the setInterval() call.

    ```javascript
    $( document ).ready(function() {
        params = {
            "reportDescription":{
                "reportSuiteID": config.reportSuite,
                "metrics": [
                    {  "id": "instances" }
                ], "elements": [
                    { "id": "page" }
                ],
                "source": "realtime",
            }
        };
        var interval = 5000; // milliseconds (5 seconds)
        setInterval(makeRealTimeRequest, interval);
    );
    ```

3.	Refresh the page in the browser to see that the page is updated every 5 seconds.

4.	One thing to keep in mind with setInterval() is that the function is called after the specified time interval has elapsed.  Therefore, if we want the data to display as soon as possible after a page load, we should call the function prior to using setInterval().

    ```javascript
    $( document ).ready(function() {
        params = {
            "reportDescription":{
                "reportSuiteID": config.reportSuite,
                "metrics": [
                    {  "id": "instances" }
                ], "elements": [
                    { "id": "page" }
                ],
                "source": "realtime",
            }
        };
        // set the dashboard to make a report request every 5 seconds
        var time = 5000; // milliseconds
        var interval = setInterval(makeRealTimeRequest, time);
        // request the initial report
        makeRealTimeRequest();
    );
    ```

5.	Refresh the page in the browser to see that the data is loaded immediately instead of after 5 seconds.
