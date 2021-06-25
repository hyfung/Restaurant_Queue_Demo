# Express API Server Demo

This is a demo Node.js API app with Redis.

API Endpoints
* `/api/v1/redis_test/`
* `/api/v1/restaurant_queue/`

## Setup

```bash
npm install
```

You should also have a running Redis instance locally.

## Running The Demo
```bash
npm run dev
```

## Dockerizing This Demo

### Building the image
```bash
sudo bash docker-build.sh
```

### Running the image
```bash
sudo bash docker-run.sh
```

## Screenshots (App Inventor 2)
![alt text](https://github.com/hyfung/Restaurant_Queue_Demo/blob/master/images/app_inventor.png "")