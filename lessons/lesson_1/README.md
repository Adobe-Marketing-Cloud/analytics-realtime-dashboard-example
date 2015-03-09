Lesson 1 – Pull your First Real-Time Report
====

Objectives
----
*    Access the Real-Time report in Analytics
*    Create a Real-Time Report request
*    Discover the Real-Time Reporting Configuration
*    Save a Real-Time configuration

Viewing the Data in Adobe Analytics
-----
1.    Open your web browser and go to <a href="https://my.omniture.com/login/" target="_blank">`my.omniture.com`</a>
2.    Login with the following credentials
    *    *Company*: Real Time Dashboard Lab
    *    *User*: [see lab guide]
    *    *Password*: [see lab guide]
3.    Click on *View All Reports* > *Metrics* > *Real-Time*

> NOTE: Temporary login information can be found at: <a href="http://adobe.ly/1ERG5ID" target="_blank">`http://adobe.ly/1ERG5ID`</a>

Take a look around. Everything you see, and a little more, can be pulled via an API.

Pulling a Real-Time Report with the API
-----

We are going to use the API explorer to pull a Real-Time report with the API. This will let us see how the API works so we can build a dashboard around it.

1.    In your browser go to <a href="https://marketing.adobe.com/developer/api-explorer" target="_blank">`https://marketing.adobe.com/developer/api-explorer`</a>

2.    Enter the following credentials

    *    *API Username*:  `labuser:Real Time Dashboard Lab`
    *    *Secret*: `75d03af19787f81a6f5016c885bc3541`

3.    Select the following options
    *    *API*: `Report`
    *    *Method*: `Run`

    > NOTE: You should also verify `REST` and `1.4` are selected under the *Request* tab

4.    Enter the following JSON in the request box

    ```javascript
    {
        "reportDescription":{
            "source": "realtime",
            "reportSuiteID":"rtd-example",
            "metrics":[
                {"id":"pageviews"}
            ]
        }
    }
    ```

5.    click "Get Response".

    If all went well, you should get a JSON structure back that has a value every 5-minutes for the past hour. In this example, "pageviews" represent traffic for the site over each time period.

Pulling a More Interesting Report
-----

There are a lot of options that we can pull with the real-time report. You can find the full documentation [here](https://marketing.adobe.com/developer/documentation/analytics-reporting-1-4/real-time). Let’s add a few more options to our request above.  Try out the requests below and take a look at that JSON you get back.

* Top pages
```javascript
{
    "reportDescription":{
        "source": "realtime",
        "reportSuiteID":"rtd-example",
        "metrics":[
            {"id":"pageviews"}
        ],
        "elements":[
            {"id":"page"}
        ]
    }
}
```

* Top Pages Sorted by Gainers (Those that are rising in the ranking the fastest)
```javascript
{
    "reportDescription":{
        "source": "realtime",
        "reportSuiteID":"rtd-example",
        "metrics":[
            {"id":"pageviews"}
        ],
        "elements":[
            {"id":"page"}
        ],
        "sortMethod":"gainers"
    }
}
```

* Top Pages Sorted by Losers (Those that are failing in the ranking the fastest)
```javascript
{
    "reportDescription":{
        "source": "realtime",
        "reportSuiteID":"rtd-example",
        "metrics":[
            {"id":"pageviews"}
        ],
        "elements":[
            {"id":"page"}
        ],
        "sortMethod":"losers"
    }
}
```

> There are a few more [sort options](https://marketing.adobe.com/developer/documentation/analytics-reporting-1-4/r-reportdescription-1#section_C4F49ABA1A664EDB8BC48DF8D8F026B0) that can be found in the documentation.

* Pull the last hour of data for the top pages
```javascript
{
    "reportDescription":{
        "source": "realtime",
        "reportSuiteID":"rtd-example",
        "metrics":[
            {"id":"pageviews"}
        ],
        "elements":[
            {"id":"page"}
        ],
        "dateFrom":"-2 hour"
    }
}
```

* Pull the last 12 hours of data for each hour
```javascript
{
    "reportDescription":{
        "source": "realtime",
        "reportSuiteID":"rtd-example",
        "metrics":[
            {"id":"pageviews"}
        ],
        "elements":[
            {"id":"page"}
        ],
        "dateFrom":"-12 hours",
        "dateGranularity":"minute:60"
    }
}
```

> You can read more about [dateGranularity](https://marketing.adobe.com/developer/documentation/analytics-reporting-1-4/real-time#section_751CF36659DD4BFDA85554EC4368C464) and other options in the documentation.

Getting the current real-time configuration
-----

In addition to being able to pull the reports with the API you can also pull the current Real-Time configuration with that API. Additionally you can set the configuration as well. The Docs for that can be found [here](https://marketing.adobe.com/developer/documentation/analytics-administration-1-4/r-getrealtimesettings)

In the following steps we will pull the Real-Time configuration:

1.    In the API explorer select the following
    *    *API*: `ReportSuite`
    *    *Method*: `GetRealTimeSettings`
2.    Add our report suite ID (`rtd-example`) to `rsid_list`:
```javascript
{
    "rsid_list": [
        "rtd-example"
    ]
}
```

Take a look at the configuration for our sample report suite. Each Real-Time metric is organized as a correlation. A correlation is a metric with up to two metrics that you can "break-down" the metric by.
Configuring your own Real-Time Data
You can use the method `ReportSuite.SaveRealTimeSettings` to save the same data structure to enable the real-time metrics. The documentation can be found [here](https://marketing.adobe.com/developer/documentation/analytics-administration-1-4/r-saverealtimesettings).

> WARNING: You can overwrite the settings that are configured in the Real-Time UI via the API. So please check the current settings by calling `ReportSutie.GetRealTimeSettings` before overwriting your settings.

**Continue to [Lesson 2](../lesson_2#lesson-2--make-an-api-request-from-an-html-page) »**
