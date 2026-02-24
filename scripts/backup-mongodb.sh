#!/bin/bash

# Script para fazer backup do banco de dados MongoDB
# Os backups são salvos na pasta data/backups/

CONTAINER_NAME="desafio-mongodb"
DB_NAME="desafioscteciaparadevs"
BACKUP_DIR="$(dirname "$0")/../data/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}"

# Cria o diretório de backups se não existir
mkdir -p "${BACKUP_DIR}"

# Verifica se o container está rodando
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "❌ Erro: Container MongoDB não está rodando!"
    echo "   Execute: npm run mongodb:start"
    exit 1
fi

echo "📦 Iniciando backup do MongoDB..."
echo "   Database: ${DB_NAME}"
echo "   Destino: ${BACKUP_FILE}"

# Faz o backup usando mongodump
docker exec ${CONTAINER_NAME} mongodump \
    --db ${DB_NAME} \
    --archive=/tmp/backup_${TIMESTAMP}.archive \
    --gzip

if [ $? -ne 0 ]; then
    echo "❌ Erro ao fazer backup!"
    exit 1
fi

# Copia o backup do container para o host
docker cp ${CONTAINER_NAME}:/tmp/backup_${TIMESTAMP}.archive "${BACKUP_FILE}.archive.gz"

# Remove o arquivo temporário do container
docker exec ${CONTAINER_NAME} rm -f /tmp/backup_${TIMESTAMP}.archive

if [ $? -eq 0 ]; then
    # Obtém o tamanho do arquivo
    FILE_SIZE=$(du -h "${BACKUP_FILE}.archive.gz" | cut -f1)
    echo "✅ Backup criado com sucesso!"
    echo "   Arquivo: ${BACKUP_FILE}.archive.gz"
    echo "   Tamanho: ${FILE_SIZE}"
    echo "   Data: $(date '+%Y-%m-%d %H:%M:%S')"
    
    # Lista os últimos 5 backups
    echo ""
    echo "📋 Últimos 5 backups:"
    ls -lh "${BACKUP_DIR}"/*.archive.gz 2>/dev/null | tail -5 | awk '{print "   " $9 " (" $5 ")"}'
else
    echo "❌ Erro ao copiar backup do container!"
    exit 1
fi
