JSD
=============
[![Build Status](https://travis-ci.org/Webfreshener/JSD.svg?branch=master)](https://travis-ci.org/Webfreshener/JSD)
[![Dev Dependency Status](https://david-dm.org/webfreshener/jsd/dev-status.svg)](https://david-dm.org/webfreshener/jsd?type=dev)

**Schema Based Self-Validating and Observable Data Models**
 

[Online Developer Documentation](https://webfreshener.github.io/JSD/)

### Purpose 
 Most every developer has wished for a way to quickly and easily validate data from User Input or remote API calls and
 and to be able to easily recieve update notifications without having to manually write code to facilitaate those 
 objectives it is to that end that JSD was developed, an Observable, Schema Based Data Validation Utility written for Javascript, 
 but which sets forth a Specification which may be implemented in any

### Table of Contents

**[Installation Instructions](#installation-instructions)**

**[Basic Usage](#basic-usage)**




#### Installation Instructions ####
There are no dependencies or prerequesites besides NPM and NodeJS

```
$ npm i --save @jsd/core
```

#### Basic Usage ####

##### Schema Basics #####

A schema is simply a JSON Document that 
describes the attributes of a Data Model

The example below defines an Schema that expects a `name` and an `age` attribute

```
let _schema = {
    "name": {
        "type": "String",
        "required": true
    },
    "age" {
        "type": "Number",
        "required": true
    }
};
const _handlers = {
    next: function(model) {
        console.log(`${_jsd.document}`); // prints: {"name": "Frank", "age": 23}
    },
    error: function(e) {
        console.log(e);
    }
}
const _jsd = new JSD(_schema);
// set invalid data to the model to trigger error handler
_jsd.document.model = {
    "name": "Frank",
    "age": "23"
};

// set valid data to the model to trigger next handler 
_jsd.document.model = {
    "name": "Frank",
    "age": 23
};
```