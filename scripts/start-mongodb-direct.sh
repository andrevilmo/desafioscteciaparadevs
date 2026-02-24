#!/bin/bash

# Script alternativo que usa docker run diretamente ao invés de docker-compose
# Útil quando há problemas de compatibilidade com docker-compose

CONTAINER_NAME="desafio-mongodb"
IMAGE="mongo:6"
PORT="27017"
DB_NAME="desafioscteciaparadevs"

# Verifica se o container já existe e está rodando
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        echo "✅ MongoDB já está rodando!"
        exit 0
    else
        echo "🔄 Iniciando container existente..."
        docker start ${CONTAINER_NAME}
        exit 0
    fi
fi

# Cria a rede se não existir
if ! docker network ls --format '{{.Name}}' | grep -q "^desafio-network$"; then
    echo "📡 Criando rede desafio-network..."
    docker network create desafio-network
fi

# Cria volumes se não existirem
if ! docker volume ls --format '{{.Name}}' | grep -q "^desafioscteciaparadevs_mongodb_data$"; then
    echo "💾 Criando volumes..."
    docker volume create desafioscteciaparadevs_mongodb_data
    docker volume create desafioscteciaparadevs_mongodb_config
fi

# Inicia o container MongoDB
echo "🚀 Iniciando MongoDB..."
docker run -d \
    --name ${CONTAINER_NAME} \
    --restart unless-stopped \
    -p ${PORT}:27017 \
    -e MONGO_INITDB_DATABASE=${DB_NAME} \
    -v desafioscteciaparadevs_mongodb_data:/data/db \
    -v desafioscteciaparadevs_mongodb_config:/data/configdb \
    --network desafio-network \
    ${IMAGE}

if [ $? -eq 0 ]; then
    echo "✅ MongoDB iniciado com sucesso!"
    echo "   Container: ${CONTAINER_NAME}"
    echo "   Porta: ${PORT}"
    echo "   Database: ${DB_NAME}"
else
    echo "❌ Erro ao iniciar MongoDB"
    exit 1
fi
