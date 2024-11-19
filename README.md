# [Dimension Labs](http://dimensionlabs.io) - Build intelligence around any conversation

Dimension Labs is an A.I.-powered B.I. Platform for your Customer Interactions

## Setup

Create an account at [https://www.dimensionlabs.io](https://www.dimensionlabs.io) and get an API_KEY.

Dimension Labs is available via NPM.

```bash
npm install --save dimensionlabs
```

Follow the instructions at [https://docs.dimensionlabs.io/](https://docs.dimensionlabs.io/)

## Configuration Options
Additional configuration options are available when importing the Dimension Labs module. The configuration options are passed through via a config object in the Dimension Labs call. 

```javascript
const configuration = {
  'debug': true,
  'redact': true,
  'timeout': 1000,
}

const dimensionLabs = require('dimensionlabs')(process.env.DIMENSIONLABS_API_KEY_ALEXA, configuration).alexa;
```

The following are the available configuration keys:

***debug*** - ```boolean``` logs helpful debugging information  
***redact*** - ```boolean``` removes personally identifiable information using redact-pii (more info [here](https://www.dashbot.io/docs/pii-redaction/))  
***timeout*** - ```number``` timeouts requests after given milliseconds

