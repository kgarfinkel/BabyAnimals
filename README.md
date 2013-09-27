BabyAnimals
===========

BabyAnimals is a simple image service for your app. Upload, process, and fetch images easily using a RESTful API. 

BabyAnimals service can resize, blur, and filter images. The service is built over ImageMagick and express.js for image processing, and Amazon S3 as the image storage platform.

Features:
=========
- image transformation:
  - resize
  - blur
  - bw
  - sepia
  - channel
  - nashville
  - auroral 
  - enhance
  - lomo
  - gotham
  - bw_gradient
  - vintage
- s3, for reliable image uploading
- enivornment configuration

Installation
------------
- fork and clone
- run npm install

how to deploy
-------------

define these environment vars:
  - AWS_ACCESS_KEY
  - AWS_SECRET_KEY
  - AWS_BUCKET
  - mongoose

Resource URL Patterns
---------------------

REQUEST       RESPONSE

POST/upload an image  an id
GET /id        {{pic}}
GET /id/size?w=100&h=100   {{pic}}
GET /id/:filter {{pic}}
GET /id/info    {data}

built using
------
