#!/bin/bash

# Script que inicia o MongoDB e restaura automaticamente o backup mais recente
# Este script é chamado automaticamente pelo npm run mongodb:start:with-restore

CONTAINER_NAME="desafio-mongodb"
DB_NAME="desafioscteciaparadevs"
BACKUP_DIR="$(dirname "$0")/../data/backups"
SCRIPT_DIR="$(dirname "$0")"

# Primeiro, inicia o MongoDB
echo "🚀 Iniciando MongoDB..."
bash "${SCRIPT_DIR}/start-mongodb-direct.sh"

# Aguarda o MongoDB estar pronto
echo "⏳ Aguardando MongoDB estar pronto..."
sleep 5

# Verifica se há backups disponíveis
LATEST_BACKUP=$(ls -t "${BACKUP_DIR}"/*.archive.gz 2>/dev/null | head -1)

if [ -z "$LATEST_BACKUP" ]; then
    echo "ℹ️  Nenhum backup encontrado. MongoDB iniciado sem restauração."
    echo "   Para criar um backup: npm run mongodb:backup"
    exit 0
fi

# Verifica se o container está rodando antes de restaurar
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "❌ Erro: Container MongoDB não está rodando após inicialização!"
    exit 1
fi

# Restaura o backup mais recente
echo "📥 Restaurando backup mais recente..."
echo "   Backup: $(basename ${LATEST_BACKUP})"

# Copia o backup para o container
BACKUP_FILENAME=$(basename "${LATEST_BACKUP}")
docker cp "${LATEST_BACKUP}" ${CONTAINER_NAME}:/tmp/${BACKUP_FILENAME}

if [ $? -ne 0 ]; then
    echo "❌ Erro ao copiar backup para o container!"
    exit 1
fi

# Faz o restore
docker exec ${CONTAINER_NAME} mongorestore \
    --db ${DB_NAME} \
    --archive=/tmp/${BACKUP_FILENAME} \
    --gzip \
    --drop \
    --quiet

if [ $? -eq 0 ]; then
    # Remove o arquivo temporário do container
    docker exec ${CONTAINER_NAME} rm -f /tmp/${BACKUP_FILENAME}
    
    echo "✅ MongoDB iniciado e backup restaurado com sucesso!"
    echo "   Database: ${DB_NAME}"
    echo "   Backup restaurado: $(basename ${LATEST_BACKUP})"
else
    echo "⚠️  Aviso: Erro ao restaurar backup, mas MongoDB está rodando."
    echo "   Você pode restaurar manualmente: npm run mongodb:restore"
    # Remove o arquivo temporário mesmo em caso de erro
    docker exec ${CONTAINER_NAME} rm -f /tmp/${BACKUP_FILENAME}
fi
