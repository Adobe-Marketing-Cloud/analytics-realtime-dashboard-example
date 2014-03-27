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

1.	Open Google Chrome and browse to http://git.io/realtimelab 
2.	Click the button labeled "Download ZIP" to download the zip package
3.  Locate the zip file and expand the package
4.  Open the application "Brackets" from the start or application menu. We'll use this application to work from
5.	Hit File -> Open Folder

6.	Find the folder which you expanded in the previous steps. It should be in your downloads folder.
7.	Next, hit File-> Live Preview to get a preview of the project.

8.	This will pop open a browser and load up the index.html page. This is what we will be building.
9.	Now, open up the lesson 2 folder.
10.	If you look at the step on the page you should see a very basic HTML template. Below are a few features of the template:
    *	On line 8 is a CSS template that we have made to handle the responsive layout.
    *	On line 10 you will see that we have included the latest version of JQuery, a popular JavaScript framework.
    *	On line 22 there is an event handler for the DOM ready event (when the page is loaded.)
    *	Lines 32-36 are the header.
    *	Lines 37-45 are the body where the content will actually go.
11.	Take a minute and replace [INSERT-YOUR-NAME-HERE] with your name (extra points if you include a small logo.)

Making a basic request to the APIs from JavaScript
-----

Here we will use the Marketing Cloud JavaScript SDK to make a basic request to the APIs.

1.	Just after line 13 add the wsse.js and marketing_cloud.js to the html. You can find them in the js/marketing-cloud-javascript-sdk  folder. Make sure you include the wsse.js file first otherwise it will not work.

    ```javascript
    <script src="js/marketing-cloud-javascript-sdk/wsse.js" type="text/javascript"></script>
    <script src="js/marketing-cloud-javascript-sdk/marketing_cloud.js" type="text/javascript"></script>
    ```

2.	Now that we have the libraries included we need to make the configuration for the call. Rename the default configuration file in the js directory. Rename ```js/config.js.dist``` to ```js/config.js```. Then include the config file.

    ```javascript
    <script src="js/config.js" type="text/javascript"></script>
    ```

 This provides the configuration we will use to the make the calls just like we did in the API explorer.

3.	Finally, we will make the API call. To do this, add the following function inside the ready code block:

    ```javascript
    MarketingCloud.makeRequest(config.username, config.secret, method, params, endpoint, function(response) {
        console.log('API Response: ' + response.responseText);
    });
    ```

    Notice in the step above that the last parameter of makeRequest is a function. This is what you want the script to do after the request is made. In this case, we are going to log to the js console and print out the text of the  response.

4.	Open the Javascript console (Menu > Tools > JavaScript Console)
