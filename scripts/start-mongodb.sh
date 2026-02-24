#!/bin/bash

echo "🚀 Iniciando MongoDB..."
docker-compose -f docker-compose.dev.yml up -d

echo "⏳ Aguardando MongoDB estar pronto..."
sleep 5

echo "✅ MongoDB iniciado!"
echo "📊 Status:"
docker ps | grep desafio-mongodb || echo "⚠️  MongoDB não está rodando"
