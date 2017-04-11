Lesson 2 – Getting Real-time Reports via a Web Page Using JavaScript
=====

Objectives
-----
*	Download the tech lab
*	Introduce the basic HTML structure of our page
*	Make a basic request from the page
*	Do something with the response that we get

Getting the Lab Files
-----

We will use GitHub to distribute this material to the lab workstations.

1.	Open Google Chrome and browse to <a href="http://git.io/realtimelab" target="_blank">`http://git.io/realtimelab`</a>
2.	Click the button labeled "Clone or Download", then "Download ZIP" to download the zip package
3.  Locate the zip file and expand the package
4.  Open the application "Brackets" from the application menu. We'll use this application to work from
5.	Click *File* > *Open Folder*
6.	Find the folder which you expanded in the previous steps. It should be in your downloads folder.
7.  Open up the `index.html` in that folder (`index.html`). This is what we will be using to create our dashboard page.

Understanding the JavaScript libraries used in this example
-----

Before we starting editing the file, we want to take a quick look at the JavaScript libraries used to help create this example.

1. `js/jquery-2.2.3.min.js` is a common JavaScript library used by the other libraries. We are also using the `js/jquery-animateNumber/jquery.animateNumber.min.js` and `js/jquery.basic_table.js` JQuery plugins for data display.

	```html
    <script src="js/jquery-2.2.3.min.js" type="text/javascript"></script>
    <script src="js/jquery-animateNumber/jquery.animateNumber.min.js" type="text/javascript"></script>
    <script src="js/jquery.basic_table.js" type="text/javascript"></script>    
    ```

2.	`js/d3.v2.js` is a charting library we will use to make graphs.

	```html
    <script src="js/d3.v2.js" type="text/javascript" ></script>
    <script src="js/d3.animated_trend.js" type="text/javascript"></script>
    ```

3.	`js/marketing-cloud-javascript-sdk/marketing_cloud.js` is another Adobe library that simplifies interaction with the Analytics API. `js/wsse.js` is also an Adobe library that handles the auththenication with the Analytics API. The source for these libraries can be found [here](https://github.com/Adobe-Marketing-Cloud/marketing-cloud-javascript-sdk). The credentials used in this example are stored in the `config.js` file and are the same we used during lesson 1 with the API explorer.

	```html
    <script src="js/marketing-cloud-javascript-sdk/marketing_cloud.js" type="text/javascript"></script>
    <script src="js/marketing-cloud-javascript-sdk/wsse.js" type="text/javascript"></script>
    <script src="js/config.js" type="text/javascript"></script>    
    ```

4.	`js/custom.js` is a library we created for this example that has some convenience methods for working with strings and arrays.

	```html
	<script src="js/custom.js" type="text/javascript"></script>
	```

5.	`js/real_time_report.js` is another library written for this example that encapsulates formatting and display logic for the Real-time report response data.
    
	```html    
    <script src="js/real_time_report.js" type="text/javascript"></script>
    ```

Making a basic request to the APIs from JavaScript
-----

We will use JavaScript on the page to request a Real-time report and display the raw result.

1.	Click *File* > *Live Preview*. This will execute the page as it currently stands. You will see a list of report suites. These are retrieved from the Analytics API using the Company.GetReportSuites API call. We want to remove this API call and replace it with a call to get a Real-time report.

![Alt text](/../../blob/master/images/lesson_2_2_1.png "Lesson 2.2.1 Finished")

2.	Remove the `MarketingCloud.makeRequest` code block which calls `Company.GetReportSuites` (near line 25):

	```javascript
    //////////////////////////////////
    // COMPANY.GETREPORTSUITES EXAMPLE
    //////////////////////////////////
    MarketingCloud.makeRequest(config.username, config.secret, 'Company.GetReportSuites', {}, config.endpoint, function(response) {
        $('#dashboard').html(JSON.stringify(response.responseJSON));
    });
	```

3.	Enable the `BASIC REPORT.RUN REQUEST` call by removing the block comments (e.g. `/*` and `*/`) surrounding it:

	```javascript
    ///////////////////////////
    // BASIC REPORT.RUN REQUEST
    ///////////////////////////
    MarketingCloud.makeRequest(config.username, config.secret, 'Report.Run', {
        "reportDescription": {
            "source": "realtime",
            "reportSuiteID": "rtd-example",
            "metrics": [
                { "id": "instances" }
            ], "elements": [
                { "id": "page" }
            ],
            "dateGranularity": "minute:1",
            "dateFrom": "-15 minutes"
        }
    }, config.endpoint, function(response) {
        $('#dashboard').html(JSON.stringify(response.responseJSON));
    });
	```

4.  Click *File* > *Live Preview* and you should see the raw result of the Real-time report in much the same format as we saw when using the API explorer.

![Alt text](/../../blob/master/images/lesson_2_finish.png "Lesson 2 Finished")

**Continue to [Lesson 3](../lesson_3#using-real-time-report-data-to-create-a-dashboard) »**
