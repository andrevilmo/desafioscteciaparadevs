#!/bin/bash

echo "🔐 Configurando Git para usar SSH"
echo ""

# Verificar se já tem chave SSH
if [ -f ~/.ssh/id_ed25519.pub ] || [ -f ~/.ssh/id_rsa.pub ]; then
    echo "✅ Chave SSH encontrada!"
    if [ -f ~/.ssh/id_ed25519.pub ]; then
        KEY_FILE=~/.ssh/id_ed25519.pub
        KEY_PRIVATE=~/.ssh/id_ed25519
    else
        KEY_FILE=~/.ssh/id_rsa.pub
        KEY_PRIVATE=~/.ssh/id_rsa
    fi
    
    # Verificar se a chave tem o email antigo
    if grep -q "grana.ai" "$KEY_FILE" 2>/dev/null; then
        echo ""
        echo "⚠️  A chave existente foi criada com andre.vilmo@grana.ai"
        echo ""
        read -p "Deseja recriar a chave com andre.vilmo@gmail.com? (s/N): " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Ss]$ ]]; then
            echo "🗑️  Removendo chave antiga..."
            rm -f "$KEY_FILE" "$KEY_PRIVATE"
            echo "📝 Criando nova chave SSH com andre.vilmo@gmail.com..."
            ssh-keygen -t ed25519 -C "andre.vilmo@gmail.com" -f ~/.ssh/id_ed25519 -N ""
            KEY_FILE=~/.ssh/id_ed25519.pub
        fi
    fi
    
    echo ""
    echo "Sua chave pública SSH:"
    echo "---"
    cat $KEY_FILE
    echo "---"
    echo ""
    echo "📋 Copie a chave acima e adicione no GitHub:"
    echo "   https://github.com/settings/keys"
    echo ""
    read -p "Pressione Enter após adicionar a chave no GitHub..."
else
    echo "📝 Criando nova chave SSH..."
    echo ""
    ssh-keygen -t ed25519 -C "andre.vilmo@gmail.com" -f ~/.ssh/id_ed25519 -N ""
    
    echo ""
    echo "✅ Chave SSH criada!"
    echo ""
    echo "Sua chave pública SSH:"
    echo "---"
    cat ~/.ssh/id_ed25519.pub
    echo "---"
    echo ""
    echo "📋 Copie a chave acima e adicione no GitHub:"
    echo "   https://github.com/settings/keys"
    echo ""
    read -p "Pressione Enter após adicionar a chave no GitHub..."
fi

# Alterar remote para SSH
echo ""
echo "🔄 Alterando remote para SSH..."
git remote set-url origin git@github.com:andrevilmo/desafioscteciaparadevs.git

echo ""
echo "✅ Remote atualizado!"
echo ""
git remote -v

echo ""
echo "🧪 Testando conexão SSH..."
ssh -T git@github.com 2>&1 | head -3

echo ""
echo "✅ Configuração concluída!"
echo ""
echo "Agora você pode fazer push:"
echo "  git push --set-upstream origin develop"
