# Example NodeJS API invoking a MySQL database

Application based on [NodeJS][] using Express server.

Content:

- [Overview](#overview)
- [Requirements](#requirements)
- [Create container](#create-container)
- [Run example](#run-example)

## Overview

This container has an Express-based server, with a service exposed `/v1/data` to query the Hardware table of the `items` database.

<p align="center">
  <img src="doc/draw/img/app-items-api.png">
</p>

[Docker]: https://docs.docker.com/get-docker
[GitHub]: https://github.com

## Requirements

- [Docker][] installed.
- [MySQL container database "app-items-mysql" example installed and running.](https://github.ibm.com/CloudExpertLab/Containers/tree/master/app-items-mysql)
- Install [GitHub][] client on your machine.

## Create container

1. Clone the git repository `nodejs-apps` using the `app-items-api` branch.

`$ git clone -b app-items-api https://github.com/jorgeiglesiasfernandez/nodejs-apps.git`

2. Go to clone directory and download the Dockerfile:

```
$ cd nodejs-apps/app-items-api
$ curl https://raw.githubusercontent.com/jorgeiglesiasfernandez/containers/master/app-items-api/Dockerfile > Dockerfile`
```

3. Build the image:

`$ docker build -t app-items-api .`

Your image will now be listed by Docker:
```
$ docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
app-items-api       latest              004e40da270a        53 seconds ago      925MB
```

4. Inspect the IP address from app-items-mysql container

```
$ docker inspect -f "{{ .NetworkSettings.IPAddress }}" app-items-mysql
172.17.0.2
```

5. Create a NodeJS container instance with port forwarding to `13306`. The -p flag redirects a public port to a private port inside the container. Sets the environment variables with the `app-items-mysql` IP container. In this example 172.17.0.2

`$ docker run --name app-items-api -p 8003:8003 -e DATABASE_URL=172.17.0.2 -e DATABASE_PORT=3306 -e DATABASE_USER=user1 -e DATABASE_PASSWORD=user1 -d app-items-api`

## Run example

1. From a terminal execute an API call to obtain the data from the database:

```
curl --request POST http://localhost:8003/v1/data
{"message":[{"type":"Disk","size":"P1010"},{"type":"Keyboard","size":"P2020"},{"type":"Screen","size":"P2030"},{"type":"Mouse","size":"P2040"}]}
```

###### Developed by [@_jorgeiglesias](http://jorgeiglesiasf.blogspot.com.es/).