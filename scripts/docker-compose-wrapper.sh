#!/bin/bash

# Verifica se o usuário tem permissão para acessar o Docker
if ! docker ps &> /dev/null 2>&1; then
    if docker --version &> /dev/null 2>&1; then
        echo "❌ Erro: Sem permissão para acessar o Docker daemon!"
        echo ""
        echo "Você precisa adicionar seu usuário ao grupo 'docker':"
        echo "  sudo usermod -aG docker $USER"
        echo ""
        echo "Depois, execute um dos seguintes comandos:"
        echo "  newgrp docker"
        echo "  # OU faça logout e login novamente"
        echo ""
        echo "Para verificar se funcionou:"
        echo "  docker ps"
        echo ""
        exit 1
    fi
fi

# Verifica se o container já existe (criado pelo método alternativo)
CONTAINER_NAME="desafio-mongodb"
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    # Container existe, verifica se está rodando
    if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        if echo "$@" | grep -q "up"; then
            echo "✅ MongoDB já está rodando!"
            exit 0
        elif echo "$@" | grep -q "down"; then
            echo "🛑 Parando MongoDB..."
            docker stop ${CONTAINER_NAME}
            exit 0
        fi
    else
        # Container existe mas não está rodando
        if echo "$@" | grep -q "up"; then
            echo "🔄 Iniciando container existente..."
            docker start ${CONTAINER_NAME}
            exit 0
        fi
    fi
fi

# Detecta qual comando usar: docker compose (novo) ou docker-compose (antigo)
if docker compose version &> /dev/null 2>&1; then
    docker compose "$@"
elif docker-compose --version &> /dev/null 2>&1; then
    # Tenta usar docker-compose, mas se falhar com erro de compatibilidade ou conflito, usa alternativa
    docker-compose "$@" 2>&1 | tee /tmp/docker-compose-error.log
    EXIT_CODE=${PIPESTATUS[0]}
    
    if [ $EXIT_CODE -ne 0 ]; then
        ERROR_MSG=$(cat /tmp/docker-compose-error.log)
        if echo "$ERROR_MSG" | grep -q "Not supported URL scheme\|Error while fetching server API version\|Conflict.*container name.*already in use"; then
            echo ""
            if echo "$ERROR_MSG" | grep -q "Conflict.*container name"; then
                echo "⚠️  Container já existe! Usando método alternativo..."
            else
                echo "⚠️  Problema de compatibilidade detectado com docker-compose!"
                echo "   Usando método alternativo (docker run direto)..."
            fi
            echo ""
            
            # Usa o script alternativo baseado na operação
            if echo "$@" | grep -q "up"; then
                bash "$(dirname "$0")/start-mongodb-direct.sh"
                exit $?
            elif echo "$@" | grep -q "down"; then
                bash "$(dirname "$0")/stop-mongodb-direct.sh"
                exit $?
            else
                echo "❌ Operação não suportada pelo método alternativo"
                echo "   Tente usar: npm run mongodb:start ou npm run mongodb:stop"
                exit 1
            fi
        else
            exit $EXIT_CODE
        fi
    else
        exit 0
    fi
else
    echo "❌ Erro: Docker Compose não encontrado!"
    echo ""
    echo "Para instalar Docker e Docker Compose no Ubuntu/Debian:"
    echo "  sudo apt update"
    echo "  sudo apt install docker.io docker-compose"
    echo "  sudo systemctl start docker"
    echo "  sudo systemctl enable docker"
    echo "  sudo usermod -aG docker $USER"
    echo ""
    echo "Após instalar, faça logout e login novamente, ou execute:"
    echo "  newgrp docker"
    echo ""
    exit 1
fi
