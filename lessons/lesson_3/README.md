Lesson 3 – Using Real-time Report Data to Create a Dashboard
=====

Objectives
-----
*   Populating a simple table with Real-time report data
*   Adding additional tables with sorted data
*   Calculating and displaying totals from the report data
*	Displaying a line graph using the trended report data

Put the data in a table
-----

Recall from lesson #2 that we simply displayed the raw report response on the page. This is very hard to read. We want to parse through the data and stick it in an HTML table.

1. Remove the `BASIC REPORT.RUN REQUEST` call that we uncommented the last lesson and uncomment the next section called `MOST POPULAR REPORT`:

    ```javascript
    ///////////////////////////
    // MOST POPULAR REPORT
    ///////////////////////////
    var report = new RealTimeReport({
        dataElement: "#data-table",
        dataElementType: "BasicTable",
        totalElement: null,
        animateTotal: false,
        refreshInterval: null
    });
    report.run({
        "reportDescription": {
            "source": "realtime",
            "reportSuiteID": "rtd-example",
            "algorithm": "most popular",
            "metrics": [
                { "id": "instances" }
            ], "elements": [
                { "id": "page" }
            ],
            "dateGranularity": "minute:60",
            "dateFrom": "-20 hours",
            "sortMethod": "mostpopular"
        }
    });
    ```

2. Click *File* > *Live Preview*. You should see the data in a tabular format on the page. The `report.run` function executes the report the same way we did before and then formats the data and places it in the `#data-table` page element.

    ![Alt text](/../../blob/master/images/lesson_3_1_1.png "Lesson 3 - 1")

Adding a line graph
-----

This report looks at the last 15 minutes of data so let's use it to power a line graph. 

1. Simply uncomment the `TREND GRAPH REPORT` report request:

    ```javascript
    ///////////////////////////
    // TREND GRAPH REPORT
    ///////////////////////////
    report = new RealTimeReport({
        dataElement: "#trendGraph",
        dataElementType: "BasicTable",
        totalElement: null,
        animateTotal: false,
        refreshInterval: null
    });
    report.run({
        "reportDescription": {
            "source": "realtime",
            "reportSuiteID": "rtd-example",
            "algorithm": "most popular",
            "metrics": [
                { "id": "instances" }
            ], "elements": [
                { "id": "page" }
            ],
            "dateGranularity": "minute:1",
            "dateFrom": "-15 minutes",
            "sortMethod": "mostpopular"
        }
    });
    ```

    > NOTE: Leave the existing `MOST POPULAR REPORT` alone for now

2. Modify the `dataElementType` parameter of the `TREND GRAPH REPORT` to:

    ```javascript
    dataElementType: "AnimatedTrendGraph",
    ```

3. Click *File* > *Live Preview*.  The data is now formatted as displayed as a trended line graph.

    ![Alt text](/../../blob/master/images/lesson_3_2_3.png "Lesson 3 - 2")

Change the report to update periodically
-----

Right now, the report only runs once when the page is loaded. Let's change it to refresh automatically every 10 seconds.

1. Modify the `refreshInterval` parameter of each report.run request to:

    ```javascript
    refreshInterval: 10
    ```

2. Click *File* > *Live Preview*.  If you wait 10 seconds you should see the data update itself.

Showing an animated total value
-----

The report data contains a total. Let's display it in a large animated format.

1. Modify the `animateTotal` parameter of the `TREND GRAPH REPORT` to:

    ```javascript
    totalElement: "#total",
    animateTotal: true,
    ```

2. Click *File* > *Live Preview*.  The `report.run` function grabs to total from the data, places it in the `#total` page element, and animates it using a JQuery plugin.


Add a table showing *gainers*
-----

1. Copy the entire `report.run` request from the `MOST POPULAR REPORT` we've already placed and paste it below the `TREND GRAPH REPORT`. You can label this report request as `GAINERS REPORT`

2. In the `report.run` block you just pasted, modify the `algorithm`, `sortMethod`, and `dateFrom` properties of the `reportDescription` object to:

    ```javascript
    "algorithm": "gainers",
    "dateGranularity": "minute:1",
    "dateFrom": "-60 minutes",
    "sortMethod": "gainers"
    ```

3. In the `GAINERS REPORT` request, change the `dataElement` parameter to:

    ```javascript
    dataElement: "#gainers-table"
    ```

4. Let's increase the refresh interval for this report. Change the `refreshInterval` parameter to:

    ```javascript
    refreshInterval: 30
    ```

5. Click *File* > *Live Preview*.  You you will now see a table of data sorted by gainers in addition to the line graph.

**For an example of what the JavaScript Code should now look like, see the [Finished HTML](../../finished/index.html#L25) »**

Add a table showing *losers*
-----

1. Copy the block for the `GAINERS REPORT` and paste it below this request. Label the new block `LOSERS REPORT`

2. In the `report.run` block for the new `LOSERS REPORT`, modify the `algorithm`, `sortMethod`, and `dateFrom` properties to:

    ```javascript
    "algorithm": "losers",
    "dateGranularity": "minute:1",
    "dateFrom": "-60 minutes",
    "sortMethod": "losers"
    ```

3. In the same block, change the `dataElement` parameter to:

    ```javascript
    dataElement: "#losers-table"
    ```

4. Click *File* > *Live Preview*.  You you will now see a table of data sorted by losers in addition to the line graph and losers table.

    ![Alt text](/../../blob/master/images/lesson_3_finished.png "Lesson 3 - Finished")

**Continue to Extra Credit [Exercise 1](../extra-credit/exercise_1#extra-credit---exercise-1--enabling-real-time-reports-on-your-report-suite) » (Advanced)**
