#!/bin/bash

echo "🔧 Corrigindo permissões do Docker..."
echo ""

# Verifica se o usuário já está no grupo docker
if groups | grep -q docker; then
    echo "✅ Você já está no grupo 'docker'"
    echo "   Execute: newgrp docker"
    echo "   Ou faça logout e login novamente"
else
    echo "📝 Adicionando usuário '$USER' ao grupo 'docker'..."
    echo ""
    echo "Execute o seguinte comando (será solicitada sua senha):"
    echo "  sudo usermod -aG docker $USER"
    echo ""
    echo "Depois execute:"
    echo "  newgrp docker"
    echo ""
    echo "Ou faça logout e login novamente."
    echo ""
    read -p "Deseja executar o comando agora? (s/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        sudo usermod -aG docker $USER
        echo ""
        echo "✅ Usuário adicionado ao grupo docker!"
        echo ""
        echo "Agora execute:"
        echo "  newgrp docker"
        echo ""
        echo "Ou faça logout e login novamente."
    fi
fi
