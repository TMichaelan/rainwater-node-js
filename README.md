# rainwater-node-js

This is a simple Node.js service that calculates the volume of water stored after a rainfall over a surface represented by a given array.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Running Tests](#running-tests)
- [Linting](#linting)

## Installation

### Requirements
* Docker
* docker-compose

### Clone the repository
```sh
git clone https://github.com/YourUsername/rainwater-node-js.git
cd rainwater-node-js
```

### Run docker-compose
```sh
docker-compose up --build
```

## Usage

### Example usage via CLI
#### Calculating water volume

```sh
curl -X POST 'http://localhost:3000/calculate-water' -H "Content-Type: application/json" -d '{"heights":[4, 1, 1, 0, 2, 3]}'
```
### Response:
```json
{
  "volume": 8
}
```
## Running Tests
```sh
docker-compose exec app npm test
```

## Linting
```sh
docker-compose exec app npm run lint
```
```sh
docker-compose exec app npm run lint:fix
```
```sh
docker-compose exec app npm run format
```
```sh
docker-compose exec app npm run format:check
```
```sh
docker-compose exec app npm run pre-checkin
```

### Adminer
Adminer is a database management tool that allows you to manage databases, tables, columns, relations, indexes, users, permissions, and more.

To access Adminer, navigate to `http://localhost:8080` in your web browser. Use the following credentials to log in:
```
System: PostgreSQL
Server: db
Username: rainwater
Password: rainwater
Database: rainwater
```


![Build Status](https://github.com/TMichaelan/rainwater-node-js/actions/workflows/ci.yml/badge.svg)