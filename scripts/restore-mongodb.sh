#!/bin/bash

# Script para restaurar um backup do MongoDB
# Uso: ./restore-mongodb.sh [arquivo_backup]
# Se nenhum arquivo for especificado, usa o backup mais recente

CONTAINER_NAME="desafio-mongodb"
DB_NAME="desafioscteciaparadevs"
BACKUP_DIR="$(dirname "$0")/../data/backups"

# Verifica se o container está rodando
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "❌ Erro: Container MongoDB não está rodando!"
    echo "   Execute: npm run mongodb:start"
    exit 1
fi

# Determina qual backup usar
if [ -n "$1" ]; then
    # Arquivo especificado pelo usuário
    if [ -f "$1" ]; then
        BACKUP_FILE="$1"
    elif [ -f "${BACKUP_DIR}/$1" ]; then
        BACKUP_FILE="${BACKUP_DIR}/$1"
    else
        echo "❌ Erro: Arquivo de backup não encontrado: $1"
        exit 1
    fi
else
    # Usa o backup mais recente
    BACKUP_FILE=$(ls -t "${BACKUP_DIR}"/*.archive.gz 2>/dev/null | head -1)
    
    if [ -z "$BACKUP_FILE" ]; then
        echo "❌ Erro: Nenhum backup encontrado em ${BACKUP_DIR}"
        echo "   Execute primeiro: npm run mongodb:backup"
        exit 1
    fi
fi

echo "🔄 Iniciando restauração do MongoDB..."
echo "   Database: ${DB_NAME}"
echo "   Backup: ${BACKUP_FILE}"

# Confirmação do usuário
read -p "⚠️  Esta operação irá substituir todos os dados atuais. Continuar? (s/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "❌ Restauração cancelada."
    exit 0
fi

# Copia o backup para o container
BACKUP_FILENAME=$(basename "${BACKUP_FILE}")
docker cp "${BACKUP_FILE}" ${CONTAINER_NAME}:/tmp/${BACKUP_FILENAME}

if [ $? -ne 0 ]; then
    echo "❌ Erro ao copiar backup para o container!"
    exit 1
fi

# Faz o restore usando mongorestore
echo "📥 Restaurando dados..."
docker exec ${CONTAINER_NAME} mongorestore \
    --db ${DB_NAME} \
    --archive=/tmp/${BACKUP_FILENAME} \
    --gzip \
    --drop

if [ $? -eq 0 ]; then
    # Remove o arquivo temporário do container
    docker exec ${CONTAINER_NAME} rm -f /tmp/${BACKUP_FILENAME}
    
    echo "✅ Restauração concluída com sucesso!"
    echo "   Database: ${DB_NAME}"
    echo "   Backup restaurado: ${BACKUP_FILENAME}"
else
    echo "❌ Erro ao restaurar backup!"
    # Remove o arquivo temporário mesmo em caso de erro
    docker exec ${CONTAINER_NAME} rm -f /tmp/${BACKUP_FILENAME}
    exit 1
fi
