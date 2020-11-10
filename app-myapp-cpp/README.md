# Example C++ development with Docker containers

In this example, you will start a c++ example that runs inside a container.

Content:

- [Overview](#overview)
- [Requirements](#requirements)
- [Create container](#create-container)
- [Test MySQL client example](#test-mysql-client-example)
- [Native authentication protocol](#native-authentication-protocol)
- [Create an Image From a Container](#create-an-image-from-a-container)

## Overview

<p align="center">
  <img src="doc/draw/img/app-myapp-cpp.png">
</p>

[Docker]: https://docs.docker.com/get-docker
[GitHub]: https://github.com

## Requirements

- Install [Docker][] on your machine.
- Install [GitHub][] client on your machine.

## Create container

1. Clone the git repository `cpp-apps` using the `app-myapp-cpp` branch.

`$ git clone -b app-myapp-cpp https://github.com/jorgeiglesiasfernandez/cpp-apps.git`

2. Go to clone directory and download the Dockerfile:

```
$ cd cpp-apps/app-myapp-cpp
$ curl https://raw.githubusercontent.com/jorgeiglesiasfernandez/containers/master/app-items-mysql/sql/hardware.sql > Dockerfile`
```

In tnis example:

`$ mkdir -pv /Users/jorgeiglesias/Development/data/storage/app-items-mysql`

2. Create container instance with persistent storage created in previous step and with port forwarding set to `13306` using `mysql` docker image:

`$ docker run --name app-items-mysql -v /Users/jorgeiglesias/Development/data/storage/app-items-mysql:/var/lib/mysql -p 13306:3306 -e MYSQL_USER=user1 -e MYSQL_PASSWORD=user1 -e MYSQL_DATABASE=items -e MYSQL_ROOT_PASSWORD=user1 -d mysql --default-authentication-plugin=mysql_native_password`

***Note:*** The -p option configures port forwarding. In this case, all connections from the host IP address to port `13306` are forwarded to container port `3306`.
The command default-authentication-plugin sets
`--default-authentication-plugin=mysql_native_password` update the contents of a running container because by default mysql client does not support authentication protocol requested by server.

3. Run the following command to inspect the ports:

```
$ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                                NAMES
e9350aeef0b4        mysql               "docker-entrypoint.s…"   2 minutes ago       Up 2 minutes        33060/tcp, 0.0.0.0:13306->3306/tcp   app-items-mysql
```

4. Loading the database using MySQL client:

Download the sql file with example data `db.sql` file:

`$ curl https://raw.githubusercontent.com/jorgeiglesiasfernandez/containers/master/app-items-mysql/sql/hardware.sql > db.sql`

Loading the database:

```
$ mysql -u user1 -p items -h 127.0.0.1 -P 13306 < db.sql
Enter password: 
```

***Note:*** we are using the default database items

5. Verify that the database was loaded correctly with one of the three
following alternatives:

```
$ mysql -u user1 -p items -h 127.0.0.1 -P 13306 -e "select * from Hardware"
Enter password: 
+----+----------+-------+
| id | name     | code  |
+----+----------+-------+
|  1 | Disk     | P1010 |
|  2 | Keyboard | P2020 |
|  3 | Screen   | P2030 |
|  4 | Mouse    | P2040 |
+----+----------+-------+
```

## Test MySQL client example

1. Clone the git repository `nodejs-apps` using the `app-items-mysql` branch.

`$ git clone -b app-items-mysql https://github.com/jorgeiglesiasfernandez/nodejs-apps.git`


2. Go into the project directory `app-items-mysql` and execute:

```
$ cd nodejs-apps/app-items-mysql
$ npm install
$ node test-db.js

> test-db@0.0.1 start /Users/jorgeiglesias/Development/ibm/CloudExpertLab/Containers/app-items-mysql
> node test-db.js

Connection established
Data received from Db:
[
  RowDataPacket { id: 1, name: 'Disk', code: 'P1010' },
  RowDataPacket { id: 2, name: 'Keyboard', code: 'P2020' },
  RowDataPacket { id: 3, name: 'Screen', code: 'P2030' },
  RowDataPacket { id: 4, name: 'Mouse', code: 'P2040' }
]

Disk has the code P1010
Keyboard has the code P2020
Screen has the code P2030
Mouse has the code P2040
```

## Native authentication protocol

If you create the container witout the parameter `--default-authentication-plugin=mysql_native_password` you have to update the contents of a running container because by default mysql client does not support authentication protocol requested by server to use the old mysql_native_password.

```
$ docker exec -it app-items-mysql /bin/bash
# mysql -u root -p
Enter password: <root_password>
mysql> ALTER USER 'user1'@'%' IDENTIFIED WITH mysql_native_password BY 'user1';
mysql> FLUSH PRIVILEGES;
mysql> quit
# exit
```

## Create an image from a container

To save a Docker container, we just need to use the docker commit command like this:

```
$ docker commit app-items-mysql
sha256:08e85dc86e8beb4cc61c3e0534841a2a73332f2340be932142e34523d0c66158
docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
<none>              <none>              08e85dc86e8b        51 seconds ago      545MB
mysql               latest              b5c10a3624ce        10 days ago         545MB
$ docker tag 08e85dc86e8b app-items-mysql
$ docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
app-items-mysql     latest              08e85dc86e8b        3 minutes ago       545MB
mysql               latest              b5c10a3624ce        10 days ago         545MB
```

###### Developed by [@_jorgeiglesias](http://jorgeiglesiasf.blogspot.com.es/).