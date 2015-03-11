Lesson 2 – Make an API request from an HTML page
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

1.	Open Google Chrome and browse to <a href="http://git.io/realtimelab" target="_blank">`http://git.io/realtimelab1`</a>
2.	Click the button labeled "Download ZIP" to download the zip package
3.  Locate the zip file and expand the package
4.  Open the application "Brackets" from the start (WIN) or application (MAC) menu. We'll use this application to work from
5.	Click *File* > *Open Folder*
6.	Find the folder which you expanded in the previous steps. It should be in your downloads folder.
7.  Now, expand the `lessons/lesson_2` folder.
8. Open up the `lesson_2.html` in that folder (`lesson/lesson_2/lesson_2.html`)
9.	Next, click *File* > *Live Preview* to get a preview of the project.
10.	This will pop open a browser and load up the `lesson_2.html` page. This is what we will be building.

Making a basic request to the APIs from JavaScript
-----

Here we will use the Marketing Cloud JavaScript SDK to make a basic request to the APIs.

1.	Inside the `<head>` tag, below the jQuery script tag, add `wsse.js` and `marketing_cloud.js` to the html where indicated. Be sure to include the `wsse.js` file first otherwise it will not work.

    ```javascript
    <script src="js/marketing-cloud-javascript-sdk/wsse.js" type="text/javascript"></script>
    <script src="js/marketing-cloud-javascript-sdk/marketing_cloud.js" type="text/javascript"></script>
    ```

2.	Now, refresh the page and you will see the result of our API call.

    > Our Web Services API credentials are in the file `js/config.js`. You can change these credentials to match those for your own company if you'd like to display your company's data on the dashboard instead.

**Continue to [Lesson 3](../lesson_3#lesson-3--display-real-time-data) »**
