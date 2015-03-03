Lesson 1 – Pull your First Real-Time Report
====

Objectives
----
*    Learn how to see the Real-Time report in Analytics
*    Learn how to format a Real-Time Report request
*    Learn how to discover the Real-Time Reporting Configuration
*    Learn how to save a Real-Time configuration

Viewing the Data in Adobe Analytics
-----
1.    Open your web browser and go to https://my.omniture.com/login/
2.    Login with the following credentials
    *    Company: Real Time Dashboard Lab 2015
    *    User: [see lab presentation]
    *    Password: [see lab presentation]
3.    Click on Site Metrics > Real-Time

NOTE: Temporary login information can be found at: https://marketing.adobe.com/developer/summit2014

Take a look around. Everything you see, and a little more, can be pulled via an API.

Pulling a Real-Time Report with the API
-----

We are going to use the API explorer to pull a Real-Time report with the API. This will let us see how the API works so we can build a dashboard around it.

1.    In your browser go to https://marketing.adobe.com/developer/en_US/get-started/api-explorer
2.    Enter the following credentials
    *    API Username:  ```labuser:Real Time Dashboard Lab 2015```
    *    Secret: ```7c8d18dd8fb271a9b5dd91c55204305c```
3.    Select the following options
    *    Version: 1.4
    *   API: Report
    *    Method: Run
4.    Enter the following JSON in the request box

    ```javascript
    {
        "reportDescription":{
            "source": "realtime",
            "reportSuiteID":"omniture.devportal",
            "metrics":[
                {"id":"instances"}
            ]
        }
    }
    ```

5.    Hit get response.

    If all went well, you should get a JSON structure back that has a value for each minute for the past five minutes. In this example, instances represent page views for the site over the last five minutes.

Pulling a More Interesting Report
-----

There are a lot of options that we can pull with the real-time report. You can find the full documentation here: https://marketing.adobe.com/developer/en_US/documentation/sitecatalyst-reporting/c-real-time. Let’s add a few more options to our request above.  Try out the requests below and take a look at that JSON you get back.

* Top pages
```javascript
{
    "reportDescription":{
        "source": "realtime",
        "reportSuiteID":"omniture.devportal",
        "metrics":[
            {"id":"instances"}
        ],
        "elements":[
            {"id":"page"}
        ]
    }
}
```

* Top Pages Sorted by Gainers (Those that are failing in the ranking the fastest)
```javascript
{
    "reportDescription":{
        "source": "realtime",
        "reportSuiteID":"omniture.devportal",
        "metrics":[
            {"id":"instances"}
        ],
        "elements":[
            {"id":"page"}
        ],
        "algorithm":"gainers"
    }
}
```

* Top Pages Sorted by Losers (Those that are failing in the ranking the fastest)
```javascript
{
    "reportDescription":{
        "source": "realtime",
        "reportSuiteID":"omniture.devportal",
        "metrics":[
            {"id":"instances"}
        ],
        "elements":[
            {"id":"page"}
        ],
        "algorithm":"losers"
    }
}
```

* Pull the last hour of data for the top pages
```javascript
{
    "reportDescription":{
        "source": "realtime",
        "reportSuiteID":"omniture.devportal",
        "metrics":[
            {"id":"instances"}
        ],
        "elements":[
            {"id":"page"}
        ],
        "periodCount":"60"
    }
}
```

There are a few more options that can be found in the documentation. However, this should be what we need for the lab.

Getting the current real-time configuration
-----

In addition to being able to pull the reports with the API you can also pull the current Real-Time configuration with that API. Additionally you can set the configuration as well. The Docs for that can be found here. https://marketing.adobe.com/developer/en_US/documentation/omniture-administration/r-getrealtimeconfiguration

In the following steps we will pull the Real-Time configuration:

1.    In the API explorer select the following
    *    Version: 1.4
    *    API: ReportSuite
    *    Method: GetRealTimeSettings
2.    Enter the ReportSuite ID in the rsid_list
    *    RSID: ```omniture.devportal```
    *    Hit Get Response

Take a look at the configuration for our sample report suite. Each Real-Time metric is organized as a correlation. A correlation is a metric with up to two metrics that you can "break-down" the metric by.
Configuring your own Real-Time Data
You can use the method ReportSuite.SaveRealTimeSettings to save the same data structure to enable the real-time metrics. The documentation can be found here: https://marketing.adobe.com/developer/en_US/documentation/analytics-administration-1-4/r-saverealtimesettings

WARNING: You can overwrite the settings that are configured in the Real-Time UI via the API. So please check the current settings by calling ReportSutie.GetRealTimeSettings before overwriting your settings.
