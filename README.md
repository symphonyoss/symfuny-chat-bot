# Symfuny Chat Bot

## Getting Started

There are three requirements to use instal the Symfuny Chat Bot, 
you must have node.js, mongo and redis installed. To run this bot locally,
you can install these with default options.

There are two node.js processes that need to be run. The first is the bot itself, 
the second is the configuration application that runs as a Symphony Extension app.

To run these, first clone this repository. At a shell prompt switch to the 
`applications` directory. Enter these commands:

```shell
npm install
node server
```

This will setup and run the application. You only need to do the first command once.

At another shell prompt switch to the `bot` directory, and enter these commands:

```shell
npm install
node bot
```

This will run the bot.

For the last step, run the Symphony Extention app in developer mode using the
provided Bundle file. For example,

```
https://podname.symphony.com/?bundle=https://localhost:8080/bot/assets/json/bundle.json
```

# About
This application was written using the [Sapphire](https://github.com/Ondoher/sapphire) framework.
This framework was specifically designed for writing single page applications, with a minimum of fuss.
See the documentation for more information.

# Sapphire TL;DR

The full documentation of the Sapphire framework is linked to above. Here are a few
key concepts to understand the code.

## Server Side and Client Side

A Sapphire application exists on both the server side as well as the client side.
The server side builds the application that will be sent to the user's browser.
This is done by specifying all the different parts of an application, for
example the HTML, JavaScript and CSS files.

The Sapphire framework takes this description of your application and generates the
HTML that is sent to your browser.

Also done on the server:

* "features" are encapsulated descriptions of parts of an application. For example, the
header of an application could be implemented as a feature. In a feature, all the
markup, javascript, css and other pieces of an application are all located
within the feature subdirectory. Features have the advantage of being reusable.
* minification of css and html based on configuration or a query string parameter.
Using a query string to turn minification on and off makes it easier to diagnose
problems in a production environment.
* gzipping of server responses
* built in CSRF protection.

---

The client side of an application is all the code that runs in the browser. The
Sapphire framework has a number of features for building browser based applications.

For example:

* Pages are pieces of user interface that can be swapped out for different
application states. For instance, in an application with tabs, each tab would be
implemented in a different page.

* Dialogs are pieces of user interface that present a modal state that must be
completed before the application can continue.

* Models are classes that communicate with the server using an AJAX interface.

* Hot loading of pages and dialogs

* Templates are reusable HTML elements that are managed by the framework. For example,
in a list of news items, a single item would be represented as a template that would
be cloned and added to the DOM for each unique news article.

## Directory Structure

At the top level of a Sapphire installation is a directory named `apps`. All
applications served by Sapphire will be here, with one directory per application.
The name of the directory will be the url to reach it. For example, if running
the server on localhost:8080, to access the application under `apps/ticker` use
the url `http://localhost:8080/ticker`.

Inside each application directory is a js file with the same name. So for the ticker
app there would be a file named `apps/ticker/ticker.js`. This file exports a single
function named `getApplication`. This function takes http request and response
parameters and returns a Q promise will be resolved with an Application object.
See the [Sapphire](https://github.com/Ondoher/sapphire) documentation for more details.

In Sapphire all the files that can be downloaded to a browser are in a directory
named `/assets`. This directory is usually further broken down into asset types,
for example, `css`, `js` and `images`.

However, the top level `assets` directory is not the only place where
application assets might be. Features, pages and dialogs exist in their own
subdirectories of the application and have their own `assets` folders.

All features are in a directory named `features`, each subdirectory of this is a
single feature. Similarly pages are in `pages` and dialogs are in `dialogs`.
