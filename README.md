# BabyAnimals

BabyAnimals is a simple image service for your app. Upload, process, and fetch images easily using a RESTful API. 

BabyAnimals service can resize, blur, and filter images. The service is built over ImageMagick and express.js for image processing, and Amazon s3 as the image storage platform.

## Features:

* Image Uploading
* Image Deletion
* Image Fetching
* Image Resizing
* Image Transforming:
  * bw
  * sepia
  * auroral 
  * enhance
  * gotham
  * bw_grad
  * vintage
* Image Metadata
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


### Image Uploading

Uploads the requested image to the configured s3 bucket. The request may be a path or a URL. The response is a JSON with a unique id that can be used to GET and transform the image, as well as access the image in s3 (the id is the s3 key).

**Syntax:**

```js
POST /babyanimals/upload?src={{image}}
```

**Example Request:**
```js
curl -X POST http://localhost:3000/babyanimals/upload?src=cute/baby/animal.png
```
or 
```js
curl -X POST http://localhost:3000/babyanimals/upload?src=http://cutebabyanimal.png
```

**Example Response:** 
````js
{"id":"b21f37508f1c"}
````

### Image Fetching

Fetches the requested image from s3.

**Syntax:**

```js
GET /babyanimals/{{id}}
```

**Example Request:**

```js
curl -X GET http://localhost:3000/babyanimals/b21f37508f1c
```

![baby duck](https://raw.github.com/kbrainwave/BabyAnimals/master/assets/readme/babyduckoriginal.jpg)

### Image Resizing

Resizes the image to the dimensions that are specified by the URL query. The accepted dimensions are pixels (not percent). The dimensions default to the original images width and height, so if only one query is provided the default value will be utilized when maintaining the aspect ratio. At least one of width and height are required.

**Syntax:**
```js
GET /babyanimals/{{id}}/size?w={{width}}&h={{height}}
```
**Example Request:**

```js
curl -X GET http://localhost:3000/babyanimals/b21f37508f1c/size?w=150&h=200
```

**Original Image:**

![baby penguin](https://raw.github.com/kbrainwave/BabyAnimals/master/assets/readme/babypenguinoriginal.jpg)

**Resized Image:**

![baby penguin](https://raw.github.com/kbrainwave/BabyAnimals/master/assets/readme/babypenguinresize.jpg)


### Image Filtering

Apply the filter that is specified by the URL query to the requested image. Because I like large land animals a lot

**Syntax**
```js
GET /id/:filter {{pic}}
```
**Example Request:**
```js
curl -X GET http://localhost:3000/b21f37508f1c/vintage
```

**Original Image**

![baby elephant](https://raw.github.com/kbrainwave/BabyAnimals/master/assets/readme/babyelephantoriginal.jpg)

**bw**

![baby elephant](https://raw.github.com/kbrainwave/BabyAnimals/master/assets/readme/babyelephantbw.jpg)

**Sepia**

![baby elephant](https://raw.github.com/kbrainwave/BabyAnimals/master/assets/readme/babyelephantsepia.jpg)

**Auroral**

![baby elephant](https://raw.github.com/kbrainwave/BabyAnimals/master/assets/readme/babyelephantauroral.jpg)

**Enhance**

![baby elephant](https://raw.github.com/kbrainwave/BabyAnimals/master/assets/readme/babyelephantenhance.jpg)

**Gotham**

![baby elephant](https://raw.github.com/kbrainwave/BabyAnimals/master/assets/readme/babyelephantgotham.jpg)

**Bw_gradient**

![baby elephant](https://raw.github.com/kbrainwave/BabyAnimals/master/assets/readme/babyelephantbw_grad.jpg)

**Vintage**

![baby elephant](https://raw.github.com/kbrainwave/BabyAnimals/master/assets/readme/babyelephantvintage.jpg)


 ## Fetching Image Metadata

 Returns the S3 URL pointing to the image, as well as metadata about the image itself. This request only works for images that have already been uploaded to S3.

 **Syntax**
 ```js
 GET /babyanimals/{{id}}/info
 ```

 **Example Request:**
 ```js
 curl -X GET http://localhost:3000/b21f37508f1c/info
 ```

 **Example Response:**
 ```js
 {
  "id": "39f2d22e6967",
  "bucket": "babyanimals",
  "url": "/babyanimals/39f2d22e6967",
  "width": 500,
  "height": 335,
  "filesize": 3.97266kb,
  "format: "PNG" 
 }
 ```

## HTTP Status Code Summary

* **200 OK** GET request succeeded
* **201 Created** POST request succeeded 
* **204 No Content** DELETE request succeeded
* **400 Bad Request** Missing required query parameter
* **404 Not Found** The the requested image does not exist 

## Deployment

BabyAnimals is designed to be deployed with your application. Before deployment, a few environment variables need to be defined.

To define environment variables with Heroku, set up an .env file and assign the following variables to point to your AWS access key, secret key, bucket, and region:

![AWS screen shot](https://raw.github.com/kbrainwave/BabyAnimals/master/assets/readme/s3config.png)


You will need to configure your application to use MongoDB. If you're deploying with Heroku, add a MongoHQ database to your application.

Adding MongoHQ will configure a MONGOHQ_URL environment variable of the following format:

![AWS screen shot](https://raw.github.com/kbrainwave/BabyAnimals/master/assets/readme/mongoconfig.png)

## Tech Stack

BabyAnimals is built using node.js and express.js on the backend, and Imagemagick for all server-side image processing. All image storage is hosted by s3, and MongoDB for image reference. Tests where asserted by Mocha. Grunt was used for automated testing, and overall task management. 
