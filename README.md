# newman-reporter-tedboard

TedUtility reporter for [Newman](https://github.com/postmanlabs/newman) that sends the test results information to TedBoard dashboard.

## Getting Started

1. Install `newman`
2. Install `newman-reporter-tedboard`

### Prerequisites

1. `node` and `npm`
2. `newman` - `npm install -g newman`

---

## Installation

```console
npm install -g tedutility
```

> Installation should be done globally if newman is installed globally, otherwise install without `-g` option

---

## Usage

Specify `-r tedutility` option while running the collection

```bash
newman run <collection-url> -r tedutility \
  --reporter-tedutility-testName <testName> \
  --reporter-tedutility-accessKey <access-key> \
  --reporter-tedutility-signatureKey <signature-key> \
  --reporter-tedutility-user <user-name> \
  --reporter-tedutility-password <password> \
  --reporter-tedutility-serverBaseUrl <base-url>
```


Example:

```
# For tedutility version 1.x

newman run https://www.getpostman.com/collections/631643-f695cab7-6878-eb55-7943-ad88e1ccfd65-JsLv -r tedutility \
--reporter-tedutility-testName newtest \
--reporter-tedutility-accessKey _16fdd731cb7a50d995b1abf2e796780f8459895f7cd665d6f9c367405 \
--reporter-tedutility-signatureKey _9d5c8bb40bf7e9a6e2eb7c3fd20f9105d34afbf4553d3d0 \
--reporter-tedutility-user drupal-admin \
--reporter-tedutility-password drupal-pswd \
--reporter-tedutility-serverBaseUrl http://app.tedboard.com


### Options:

**Option** | **Remarks**
--- | --- 
`--reporter-tedutility-testName` | Test name
`--reporter-tedutility-accessKey` | Access key of a project
`--reporter-tedutility-signatureKey` | Signature key of a project
`--reporter-tedutility-user` | Username of API hosted server
`--reporter-tedutility-password` | Password of API hosted server
`--reporter-tedutility-serverBaseUrl` | Base URL of API hosted server

---


## To Do

- [] Convert to ES6 based version

---
