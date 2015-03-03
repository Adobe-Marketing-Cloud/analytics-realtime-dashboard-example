Lesson 3 – Display Real-Time Data
=====

Objectives
-----
*	Define and request a real-time report
*	Extract a total from the response
*	Animate a changing number

Recall from lesson #1 the format of real-time report request. This lesson first requires defining this report request within our JavaScript code.  Please begin by opening the lesson3 index.html in your code editor.

1.	First off, we need to make a Real-Time API request to get a total value. Redefine the params variable declaration in the ```$( document ).ready(function()``` callback function to include the correct request parameters (near line 29):

    ```javascript
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
    ```

2.	In order to make the proper request to the API, we need to change the API method being called. Change ```var method = "Company.GetReportSuites"``` to ```var method = "Report.GetRealTimeReport"```
 
3.	Now that we are using the correct method and request parameters, we need to reference the data being returned.  We want to locate the totals value in the response data object. Please add the following to the ```MarketingCloud.makeRequest``` callback function:

    ```javascript
    MarketingCloud.makeRequest(config.username, config.secret, method, params, config.endpoint, function(response) {
		console.log(response.responseJSON.report.totals[0]);
	});
    ```

4.	With the browser’s debug console open refresh the page to see the report total being logged.

Extract a total from the response
-----
This lesson will demonstrate how to publish Real-Time API data to an HTML page.

1.	First, we need to add an HTML element to contain the Real-Time report sum value. Somewhere below the ```<body>``` tag, insert the following heading:  ```<h1 id="total">0</h1>```
2.	Now that we have a place to publish the result we need to use jQuery to publish the results to the heading tag.  Alter the MarketingCloud.makeRequest  callback function to the following:

    ```javascript
    MarketingCloud.makeRequest(config.username, config.secret, method, params, config.endpoint, function(response) {
        var total = response.responseJSON.report.totals[0];
        $("#total").html(total);
    });
    ```

3.	Open the page in the browser to see the value dynamically change to the report total.

Animate a changing number
-----

To make the data change events more noticeable we need to animate the value when it changes. This lesson will demonstrate how to animate the report data being returned.

1.	There exists a jQuery plugin to animate value changes. Include this plugin by adding this script tag to a new line somewhere inside the <head> tag near the other script references:

    ```javascript
    <script src="js/jquery-animateNumber/jquery.animateNumber.min.js" type="text/javascript"></script>
    ```

2.	Use the animate plugin in the MarketingCloud.makeRequest  callback function.

    ```javascript
    MarketingCloud.makeRequest(config.username, config.secret, method, params, config.endpoint, function(response) {
        var total = response.responseJSON.report.totals[0];
        var numStep = $.animateNumber.numberStepFactories.separator(",");
        $("#total").animateNumber({
            number:total,
            numberStep: numStep
        }, 500);
    });
    ```

3.  Reload the page in the browser to see the animation.

    You can find documentation on the plugin for the Animate Number JQuery Plugin. http://aishek.github.io/jquery-animateNumber/
