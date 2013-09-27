# BabyAnimals

BabyAnimals is a simple image service for your app. Upload, process, and fetch images easily using a RESTful API. 

BabyAnimals service can resize, blur, and filter images. The service is built over ImageMagick and express.js for image processing, and Amazon S3 as the image storage platform.

## Features:

* Image Upload
* Image Fetch
* Image Resize
* Image Transformation:
  * blur
  * bw
  * sepia
  * channel
  * nashville
  * auroral 
  * enhance
  * lomo
  * gotham
  * bw_gradient
  * vintage
* S3, for reliable image uploading
* Enivornment Configuration

## Installation

* Fork and clone this repository

* Install dependencies:

```js
npm install
```
* Install Imagemagick CLI tools. If you're on OSX, you can use Homebrew:

```js
brew install imagemagick
```
## Resource URL Patterns


### Image Upload

Syntax:

POST /babyanimals/upload?src={{image}}

Definition:

Uploads the requested image to the configured s3 bucket. Accepts local files, and urls. The response is a JSON with a unique id that can be used to GET and transform the image, as well as access the image in s3 (the id is the s3 key).

Example Request:

```js
curl -X POST http://localhost:3000/babyanimals/upload?src=cute/baby/animal.png

or 

curl -X POST http://localhost:3000/babyanimals/upload?src=http://cutebabyanimal.png
```
Example Response: 

````js
{"id":"b21f37508f1c"}
````
GET /id        {{pic}}
GET /id/size?w=100&h=100   {{pic}}
GET /id/:filter {{pic}}
GET /id/info    {data}

how to deploy
-------------

define these environment vars:
  - AWS_ACCESS_KEY
  - AWS_SECRET_KEY
  - AWS_BUCKET
  - mongoose


built using
------
