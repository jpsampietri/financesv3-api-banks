# Finances V3 - API - Banks
Typescript RESTFul microservice for the Finances V3 app, Bank and Account resources using Express and MongoDB. Tests using Mocha and Chai.

## Folder Structure
This project is organized using the structure decribed below:

```
.
+--src/ //Project code
|  +--data/ //Code related to the data access layer
|  |  +--access/ //Repositories that implements the database integration for each resource
|  |  +--model/ //Data models used to manipulate data from the database
|  +--service/ //Code related to the service layer
|  |  +--controller/ //Controllers that implement the service layer business logic
|  |  +--util/ //Auxiliar classes with shared capabilities
|  |  +--validation/ //Middlewares to validate the request
|  +--test/ //Test classes
+--settings.prop //Properties file
+--testSettings.prop //Test properties file
```

## Data Structures
This microservice enables CRUD operations for Bank and Account resources, with expected values as follows:

### Bank
```
{
    "_id": "00000000a00000aa0a00000a", //Returns a MongoDB ObjectID
    "label": "Label", //Requires a not null string
    "color": "#000000" //Requires a /\#[A-F0-9]{6}/g
}
```

### Account
```
{
    "_id": "00000000a00000aa0a00000a", //Returns a MongoDB ObjectID
    "label": "Label", //Requires a not null string
    "letter": "L", //Requires a /[A-Z]{1,2}/g
    "limit": "L", //Requires a number
    
}
```
