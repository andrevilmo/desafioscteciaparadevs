#!/bin/bash

# Verifica se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado!"
    echo ""
    echo "Para instalar Docker no Ubuntu/Debian:"
    echo "  sudo apt update"
    echo "  sudo apt install docker.io docker-compose"
    echo "  sudo systemctl start docker"
    echo "  sudo systemctl enable docker"
    echo ""
    echo "Ou use snap:"
    echo "  sudo snap install docker"
    echo ""
    exit 1
fi

# Verifica qual comando usar (docker compose ou docker-compose)
if docker compose version &> /dev/null; then
    echo "✅ Docker encontrado (versão moderna - usando 'docker compose')"
    export DOCKER_COMPOSE_CMD="docker compose"
elif docker-compose --version &> /dev/null; then
    echo "✅ Docker encontrado (versão antiga - usando 'docker-compose')"
    export DOCKER_COMPOSE_CMD="docker-compose"
else
    echo "❌ Docker Compose não está disponível!"
    exit 1
fi

echo "Comando a ser usado: $DOCKER_COMPOSE_CMD"
