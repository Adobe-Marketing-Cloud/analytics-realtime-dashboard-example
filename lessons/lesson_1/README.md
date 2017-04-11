Lesson 1 – Getting Real-time Reports via the Analytics API
====

Objectives
----
*    Access the Real-time report in Analytics
*    Create a Real-time Report request

Viewing the Data in Adobe Analytics
-----
1.    Open your web browser and go to <a href="https://my.omniture.com/login/" target="_blank">`my.omniture.com`</a>
2.    Get username and password from <a href="https://marketing.adobe.com/developer/summitlab" target="_blank">`https://marketing.adobe.com/developer/summitlab`</a>
3.    Login with the following credentials
    *    *Company*: Real Time Dashboard Lab
    *    *User*: [use username from step 2]
    *    *Password*: [use password from step 2]
4.    Click on *View All Reports* > *Metrics* > *Real-time*

Take a look around. Everything you see, and a little more, can be pulled via an API.

Pulling a Real-time Report with the API
-----

We are going to use the API explorer to pull a Real-time report with the API. This will let us see how the API works so we can build a dashboard around it.

> NOTE: We've provided a set of test credentials for the purposes of this lab. To obtain credentials for your own account, follow the tutorial [here](https://marketing.adobe.com/developer/get-started/enterprise-api/c-get-web-service-access-to-the-enterprise-api).

1. In your browser go to <a href="https://marketing.adobe.com/developer/api-explorer" target="_blank">`https://marketing.adobe.com/developer/api-explorer`</a>

2. Switch to the tab that is showing the <a href="https://marketing.adobe.com/developer/summitlab" target="_blank">`https://marketing.adobe.com/developer/summitlab`</a> page.

3. Enter the following credentials into the API explorer:

    * *Username*:  [use API login username from step 2]
    * *Secret*: [use API login secret from step 2]

    > NOTE: these credentials are different from the credentials used to login to Adobe Analytics

4. Select the following options
     *    *API*: `Report`
     *    *Method*: `Run`

    > NOTE: You should also verify `REST` and `1.4` are selected under the *Request* tab

5. Enter the following JSON in the request box

    ```javascript
    {
        "reportDescription":{
            "source": "realtime",
            "reportSuiteID":"rtd-example",
            "metrics":[
                {"id":"instances"}
            ]
        }
    }
    ```

6. Click "Get Response"


If all went well, you should get a JSON structure back that has a value every 5-minutes for the past hour. In this example, "instances" represents traffic for the site over each time period.

![Alt text](/../../blob/master/images/lesson_1_finish.png "Lesson 1 Finished")

Further Reading (optional)
-----

* There are many options that can be customized in a Real-time report. The full documentation is available [here](https://marketing.adobe.com/developer/documentation/analytics-reporting-1-4/real-time).

* More [sort options](https://marketing.adobe.com/developer/documentation/analytics-reporting-1-4/r-reportdescription-1#section_C4F49ABA1A664EDB8BC48DF8D8F026B0) can be found in the documentation.

* Read more about [dateGranularity](https://marketing.adobe.com/developer/documentation/analytics-reporting-1-4/real-time#section_751CF36659DD4BFDA85554EC4368C464) and other options in the documentation.

**Continue to [Lesson 2](../lesson_2#lesson-2--make-an-api-request-from-an-html-page) »**
