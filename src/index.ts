import express from 'express'
import { router } from './service/router.js';
import { authorizeRequest } from './service/validation/authenticator.js';
import { Properties } from './service/util/properties.js';

const prop = Properties.instance;

const app = express();
app.use(express.json());

const port = prop.getProperty('service.port');

app.use(authorizeRequest);

app.use(prop.getProperty('api.basePath'), router);

app.listen(port, () => `server running on port ${port}`);