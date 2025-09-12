import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars{
    PORT                       : number;
    NATS_SERVERS: string[],
    //* YA NO SE UTILIZAN AL CAMBIAR A CONFIGURACIÓN CON SERVIDOR NATS
    // PRODUCTS_MICROSERVICE_HOST : string;
    // PRODUCTS_MICROSERVICE_PORT : number;
    // ORDERS_MICROSERVICE_HOST   : string;
    // ORDERS_MICROSERVICE_PORT   : number;
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    NATS_SERVERS: joi.array().items( joi.string() ).required(),

    // PRODUCTS_MICROSERVICE_HOST : joi.string().required(),
    // PRODUCTS_MICROSERVICE_PORT : joi.number().required(),
    // ORDERS_MICROSERVICE_HOST : joi.string().required(),
    // ORDERS_MICROSERVICE_PORT : joi.number().required(),
}).unknown(true);

const { error, value } = envsSchema.validate({ 
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS.split(',') //convirtiendo la variable en un array
});

if( error ) {
    throw new Error(`Config validation error: ${ error.message }`);
}

const envVars : EnvVars = value;

export const envs = {
    port: envVars.PORT,
    natsServers: envVars.NATS_SERVERS,

    // productsMicroserviceHost: envVars.PRODUCTS_MICROSERVICE_HOST,
    // productsMicroservicePort: envVars.PRODUCTS_MICROSERVICE_PORT,
    // ordersMicroserviceHost: envVars.ORDERS_MICROSERVICE_HOST,
    // ordersMicroservicePort: envVars.ORDERS_MICROSERVICE_PORT,
}  