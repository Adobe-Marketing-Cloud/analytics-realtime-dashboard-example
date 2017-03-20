Extra Credit - Exercise 1 – Enabling Real-time Reports on Your Report Suite
=====

Objectives
-----
*   Obtain your API credentials
*   Understand how real-time reports are configured
*   Understand realtime report limitations
*   Enabled desired real-time reports on a report suite

Obtain API Credentials
-----

We will be using API Explorer to configure real-time reports on your report suite. In order to do this you must obtain the appropriate API credentials for the report suite. You may not have the ability to perform these actions depending on the permissions your administrator has granted your user. If you find that is the case, talk with an Adobe Analytics administrator in your organization. They can help you obtain API credentials.

1. Login to the Adobe Analytics User Interface at `my.omniture.com`.

2. In the header, select the *Admin* menu then *User Management*.

3. Select the *Users* tab. Find your user and select *Edit*.

4. If your user has API credentials they will be listed in the box titled *Web Service Credentials*.  Take note of these as they will be required in later steps.

    ![Alt text](/../../blob/master/images/extra_credit_1_1_4.png "Lesson 4 - 1")

Real-time Report Configuration
-----

Before you can execute real-time reports, they must be specifically enabled on a report suite basis. This can be done through the Adobe Analytics Admin API. `ReportSuite.GetRealTimeSettings` allows you to see the current configuration and `ReportSuite.SaveRealtimeSettings` allows you to change it.

1. In your browser go to <a href=" in " target="_blank">`https://marketing.adobe.com/developer/api-explorer`</a>

2. Enter the credentials you obtained previously into the API explorer:

    *    *Username*: `myusername`
    *    *Secret*: `somelongsecret`

    > NOTE: these credentials are different from the credentials used to login to Adobe Analytics

3. Select the following options
    *    *API*: `ReportSuite`
    *    *Method*: `GetRealTimeSettings`

    > NOTE: You should also verify `REST` and `1.4` are selected under the *Request* tab

4. Enter the following JSON in the request box:

    ```javascript
    {
        "rsid_list":["myreportsuite"]
    }
    ```

    replacing `myreportsuite` with the ID of the report suite you want to configure.

4. Click *Get Response*.

    You should now see the current configuration for the report suite in the *Response* section. This will be explained next.

    ![Alt text](/../../blob/master/images/extra_credit_1_2_4.png "Lesson 4 - 2")

Real-time Report Limitations
-----

See this example configuration

```javascript
    [
        {
            "rsid":"myreportsuite",
            "site_title":"myreportsuite",
            "real_time_settings":[
                {
                    "name":"Content Real Time Report 00",
                    "min_granularity":1,
                    "ui_report":true,
                    "metric":"instances",
                    "elements":[
                        "page",
                        "sitesection",
                        "referringdomain"
                    ]
                },
                {
                    "name":"myReportCard",
                    "min_granularity":1,
                    "ui_report":false,
                    "metric":"revenue",
                    "elements":[
                        "page",
                        "searchenginekeyword",
                        "referringdomain"
                    ]
                }
            ]
        }
    ]
```

Each item under `real_time_settings` is a configured report. Each has a descriptive name and some settings.

`min_granularity`: This determines the minimum granularity allowed for the report in minutes. The minimum value is `1`.

`ui_report`: This determines if the report shows in the Analytics UI. `true` means the report will show in the UI, `false` means it is an API-only report.

`metric`: This is the specific metric enabled for the report. Each real-time report is limited to a single metric.

`elements`: These are the dimensions configured for the report. If more than one element is provided, it enables the first element to be broken down by one of the subsequent elements. In other words, the `MyReportCard`report above can be executed using `page` alone, using `page` broken down by `searchenginekeyword`, or using `page` broken down by `referringdomain`.

> Currently, each report suite is limited to 9 UI-enabled dimensions and 9 API-enabled dimensions in real-time reports.  In the example above, both the UI and API are using 3 of the 9 allowed dimensions.

Enabling Real-time Reports
-----

:warning: :warning: **Caution: You must include ALL reports you want enabled from `ReportSuite.GetRealTimeSettings` for EACH CALL to `ReportSuite.SaveRealTimeSettings`. If you omit reports they will be wiped out.** :warning: :warning:

1. In API explorer, select the following options
    *    *API*: `ReportSuite`
    *    *Method*: `SaveRealTimeSettings`

    > NOTE: You should also verify `REST` and `1.4` are selected under the *Request* tab

2. If I wanted to add a new realtime report I would add the report and the configuration JSON in the request box: 

 :red_circle: **EXAMPLE ONLY - DO NOT USE THESE VALUES** :red_circle:

The values below would add a new API-only real-time report using the metric `orders` and the `category` dimension broken down by the `product` dimension.

```javascript
    {
        "rsid_list":["myreportsuite"],
        "real_time_settings":[
            {
                "name":"Content Real Time Report 00",
                "min_granularity":1,
                "ui_report":true,
                "metric":"instances",
                "elements":[
                    "page",
                    "sitesection",
                    "referringdomain"
                ]
            },
            {
                "name":"myReportCard",
                "min_granularity":1,
                "ui_report":false,
                "metric":"revenue",
                "elements":[
                    "page",
                    "searchenginekeyword",
                    "referringdomain"
                ]
            },
            {
                "name":"myNewAPIReport",
                "min_granularity":1,
                "ui_report":false,
                "metric":"orders",
                "elements":[
                    "category",
                    "product",
                ]
            },            
        ]
    }
```

3. Click *Get Response*.

    You should allow a few minutes for any new reports you've configured to start returning data.

