#!/bin/bash

# Script para parar o MongoDB usando docker diretamente

CONTAINER_NAME="desafio-mongodb"

if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "🛑 Parando MongoDB..."
    docker stop ${CONTAINER_NAME}
    echo "✅ MongoDB parado!"
else
    echo "ℹ️  MongoDB não está rodando"
fi
