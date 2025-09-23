<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

##Cliente Gateway
El gateway es el punto de comunicación entre nuestros clientes y nuestros servicios
Es el encargado de recibir la peticiones, enviarlas a los servicios
correspondientes y devolver la respuesta al cliente

#dev

1. Clonar el repositorio
2. Instalar dependencias
3. Crear un archivo `.env` basado en el `env.templete`
4. Levantar el servidor de NATS
```
docker run -d --name nats-serve -p 4222:4222 -p 8222:8222 nats
```
5. Tener levantados los microservicios que se van a consumir
6. Levantar el proyecto con `npm run start:dev`

## Nats
Levantar servidor nats con
```
docker run -d --name nats-serve -p 4222:4222 -p 8222:8222 nats
```

## Crear versión de producción
```
docker build -f dockerfile.prod -t client-gateway . 
```