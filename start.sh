#!/bin/bash

# Carrega as variáveis de ambiente do arquivo .env
if [ -f ./app/.env ]; then
    export $(grep -v '^#' ./app/.env | xargs)
    echo ".env ok"
else
    echo "'.env' not exist"
fi

# Desliga qualquer contêiner em execução
docker-compose down


docker-compose up -d --build


# Mostra o Endpoint configurado
echo " "
echo "Domain: $DOMAIN"
echo "Port: $NODE_LOCAL_PORT"
