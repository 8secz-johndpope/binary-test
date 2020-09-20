# Binary-test

This project is based on modified LoopBack 4 ( Typescript )

## Overview

This application covers 3 aspects

1. User Signup & Login, using JWT authorization

2. CRUD for Advert resource through secure API

3. Upload Public API for Advert ( both image & video)

## Usage

Start the application by running npm start and go to

http://localhost:3000/explorer. You’ll see the 3 new endpoints under

`UserController` together with the other endpoints under `AdvertController`.

![enter image description here](https://raw.githubusercontent.com/shujahm/binary-test/master/documents/image.png?token=ACA6DDKQ2CYXPWUDQUDZAZK7M2AOK)

## Backend APIs

1. **Sign up using the/signup API**

Since we don’t have any users created, click on `POST /signup`. For the requestBody, the minimum you need is `email` and `password`. i.e.

```json
{
  "email": "testuser2@abc.com",
  "password": "testuser2",
  "username": "shujahm"
}
```

2. **Log in using the POST /users/login API**

After calling /users/login , the response body will look something like:

```json
{
  "user": {
    "name": "shujahm",
    "id": "1",
    "email": "shujahm@gmail.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJuYW1lIjoic2h1amFobSIsImVtYWlsIjoic2h1amFobUBnbWFpbC5jb20iLCJpYXQiOjE2MDA1NTE5OTYsImV4cCI6MTYwMDU3MzU5Nn0.VZx86vr9Ut3ckc_SjySq1H1EzikQ02NJdIdwEskA-o8"
}
```

Copy the token. Go to the top of the API Explorer, click the “Authorize” button.

![enter image description here](https://raw.githubusercontent.com/shujahm/binary-test/master/documents/image2.png?token=ACA6DDMQYBULW337FJXVT3C7M2A3M)

Paste the token that you previously copied to the “Value” field and then click Authorize.

![authorize dialog](https://loopback.io/pages/en/lb4/imgs/auth-tutorial-jwt-token.png)

In the future API calls, this token will be added to the `Authorization` header .

3. **Get all adverts using `GET /adverts` API**

You should be able to call this API with following filters for fetching 'video' or 'image' media types:

IMAGE TYPE

    {
    	"offset": 0,
    	"limit": 100,
    	"skip": 0,
    	"where": {
    		"mediaType": "image"
    	},
    	"fields": {
    		"id": true,
    		"title": true,
    		"description": true,
    		"mediaType": true,
    		"mediaLink": true
    	}
    }

VIDEO TYPE

    {
    	"offset": 0,
    	"limit": 100,
    	"skip": 0,
    	"where": {
    		"mediaType": "video"
    	},
    	"fields": {
    		"id": true,
    		"title": true,
    		"description": true,
    		"mediaType": true,
    		"mediaLink": true
    	}
    }

## Media Uploader

1. Media upload is static html/css/jquery file uploader that uses the public APIs build above on loopback.

2. It can be accessed at `http://127.0.0.1:3000`

3. The media types support for upload are `image/x-png,image/gif,image/jpeg,video/mp4`

4. Files are uploaded to the `/public/files` on the project level and can be access by route `http://127.0.0.1:3000/public/<file-name>`

## TODOs

1. Adding more restrictions on mimetypes
2. Adding Request throttling i.e. not allowing more than 1 request per second from single IP
3. Doing it in a microservice architecture where file upload is handled by separate process to balance the load.
4. Adding more security on file upload to avoid corrupt images and file by detecting inconsistent bytecodes while uploading data.
5. Maintaining multiple environment for deployment and testing.

## License

MIT

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

## INCASE CHROME RETURNS (blocked:other) as response status for XHR request while using swagger , please disable any adblock or ny plugin that manipulates outgoing traffic from chrome.
