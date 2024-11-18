# Home Library Service

## Prerequisites
- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## `How to start` instructions
### Download
```shell
git clone https://github.com/solidados/nodejs2024Q3-service.git
```
### Change directory
```shell
cd nodejs2024Q1-service
```
### Switch branch
```shell
git checkout dev
```
### Install NPM dependencies
```shell
npm install
```
### Create Environment (based on `.env.example`):
```shell
cp .env.example ./.env
```

## Running application
#### Open new Terminal tab -> Run docker:
```shell
npm run docker
```
#### Open new Terminal tab -> Run tests:
```shell
npm run test or npm run docker:test
```
#### Vulnerabilities scanning (only after `npm run docker` command) run:
```shell
npm run docker:scan
```
#### Images size checks:
```shell
docker images
```
### DockerHub Images 
- Visit [DockerHub](https://hub.docker.com/repository/docker/solidados/homelibrary-app/tags)
### OpenAPI Swagger
- Visit [documentation](http://localhost:4000/doc) while running

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
