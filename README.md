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
> **Warnings**
> 1. Before running script ``_docker:start_``, please clear the data in **your Docker Desktop** containers
> 2. Make sure, that your `PostgreSQL` is started
> MacOS: `brew services list`
> WinOS: `tasklist | findstr postgres`

#### Open new Terminal tab -> Run docker:
```shell
npm run docker:start
```
#### Open new Terminal tab -> Run tests:
```shell
npm run test
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
- Visit My DockerHub repo to see images and their sizes: 
  - [Application](https://hub.docker.com/repository/docker/solidados/home-library-app/tags)
  - [Database](https://hub.docker.com/repository/docker/solidados/home-library-db/tags)
### OpenAPI Swagger
- Visit [documentation](http://localhost:4000/doc) while Docker container is running
> IMPORTANT STEPS!
> 1. Signup
> 2. Login
> 3. Refresh (up to you) - paste to the body `refreshToken` from previous **step-2**
> 4. Copy `accessToken` from **step-2**, press `Authorize` button on top, paste token and authorize.
> 5. After that you can perform all CRUD operations in **User** | **Track** | **Album** | **Artist** | **Favorite** sections

## Testing

After application running open new terminal and enter:

To run all tests with authorization:

```shell
npm run test:auth
```
```shell
npm run test:refresh
```

## Application Logs

### Check log files
```
docker exec -it home-library ls -ls logs
```

### Check Log file content
```
# example: docker exec -it home-library cat ./logs/logs_1.log
```
```
docker exec -it home-library cat <log_filename>
```

## Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
