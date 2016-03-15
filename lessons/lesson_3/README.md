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

1. Remove the call to `Report.Run` that we uncommented the last lesson and uncomment the next section:

    ```javascript
    runRealTimeReport(
        {
            "reportDescription": {
                "source": "realtime",
                "reportSuiteID": "rtd-example",
                "metrics": [
                    { "id": "pageviews" }
                ], "elements": [
                    { "id": "page" }
                ],
                "dateGranularity": "minute:1",
                "dateFrom": "-15 minutes"
            },
            {
                dataElement: "#data-table",
                dataElementType: "BasicTable",
                totalElement: null,
                animateTotal: false,
                refreshInterval: null
            }            
        }
    );
    ```

2. Click *File* > *Live Preview*. You should see the data in a tabluar format on the page. The `runRealTimeReport` function executes the report the same way we did before and then formats the data and places it in the `#data-table` page element.

Change the report to update periodically
-----

Right now, the report only runs once when the page is loaded. Let's change it to refresh automatically every 10 seconds.

1. Modify the `refreshInterval` parameter to:

    ```javascript
    refreshInterval: 10
    ```

2. Click *File* > *Live Preview*.  If you wait 10 seconds you should see the data update itself.

Showing an animated total value
-----

The report data contains a total. Let's display it in a large animated format.

1. Modify the `totalElement` and `animateTotal` parameters to:

    ```javascript
    totalElement: "#total",
    animateTotla: true,
    ```

2. Click *File* > *Live Preview*.  The `runRealTimeReport` function grabs to total from the data, places it in the `#total` page element, and animates it using a JQuery plugin.

Changing the table to a line graph
-----

This report looks at the last 15 minutes of data so let's use it to power a line graph. 

1. Before we modify this report, let's make a copy of it. Copy the `runRealTimeReport` function call and 
   paste it directly below itself. We will use it in the next steps.

2. Modify the `dataElement` and `dataElementType` parameters of the block you just copied to:

    ```javascript
    dataElement: "#trendGraph",
    dataElementType" "AnimatedTrendGraph",
    ```

2. Click *File* > *Live Preview*.  The data is now formatted as displayed as a trended line graph.


Add a table showing *gainers*
-----

1. In the `runRealTimeReport` block you just pasted, modify the `algorithm`, `sortMethod`, and `dateFrom` to:

    ```javascript
    "algorithm": "gainers",
    "dateGranularity": "minute:1",
    "dateFrom": "-60 minutes",
    "sortMethod": "gainers"
    ```

2. In the same block, change the `dataElement` parameter to:

    ```javascript
    "dataElement": "#gainers-table"
    ```

3. Let's increase the refresh interval for this report. Change the `refreshInterval` parameter to:

    ```javascript
    refreshInterval: 30
    ```

4. Click *File* > *Live Preview*.  You you will now see a table of data sorted by gainers in addition to the line graph.


Add a table showing *losers*
-----

1. Copy the block for the gainers report and paste it below itself.

2. In the `runRealTimeReport` block you just pasted, modify the `algorithm`, `sortMethod`, and `dateFrom` to:

    ```javascript
    "algorithm": "losers",
    "dateGranularity": "minute:1",
    "dateFrom": "-60 minutes",
    "sortMethod": "losers"
    ```

3. In the same block, change the `dataElement` parameter to:

    ```javascript
    "dataElement": "#losers-table"
    ```

4. Click *File* > *Live Preview*.  You you will now see a table of data sorted by losers in addition to the line graph and losers table.


Add a table showing *most popular* pages
-----

1. Copy the block for the losers report and paste it below itself.

2. In the `runRealTimeReport` block you just pasted, modify the `algorithm`, `dateGranlularity`, `dateFrom`,  and `sortMethod` parameters. Notice the lack of a space when setting `sortMethod` to `mostpopular`. It is also the default value and could be removed as well.

    ```javascript
    "algorithm": "most popular",
    "dateGranularity": "minute:1",
    "dateFrom": "-60 minutes",
    "sortMethod": "mostpopular"
    ```

3. In the same block, change the `dataElement` parameter to:

    ```javascript
    "dataElement": "#data-table"
    ```

4. Click *File* > *Live Preview*.
