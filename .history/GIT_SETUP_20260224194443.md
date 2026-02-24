# 🔐 Configuração do Git e GitHub

## Problema: Erro 403 ao fazer push

Se você está recebendo `Permission denied` ou erro 403 ao tentar fazer push, siga uma das soluções abaixo.

## Solução 1: Usar SSH (Recomendado)

### Passo 1: Verificar se já tem chave SSH

```bash
ls -la ~/.ssh/id_*.pub
```

Se não existir, crie uma:

```bash
ssh-keygen -t ed25519 -C "andre.vilmo@gmail.com"
# Pressione Enter para aceitar o local padrão
# Opcionalmente, defina uma senha para a chave
```

### Passo 2: Adicionar chave SSH ao GitHub

```bash
# Copiar a chave pública
cat ~/.ssh/id_ed25519.pub
```

1. Copie a saída do comando acima
2. Acesse: https://github.com/settings/keys
3. Clique em "New SSH key"
4. Cole a chave e salve

### Passo 3: Alterar remote para SSH

```bash
git remote set-url origin git@github.com:andrevilmo/desafioscteciaparadevs.git
git remote -v  # Verificar
```

### Passo 4: Testar conexão

```bash
ssh -T git@github.com
```

Se aparecer "Hi andrevilmo! You've successfully authenticated...", está funcionando!

### Passo 5: Fazer push

```bash
git push --set-upstream origin develop
```

## Solução 2: Usar Personal Access Token (HTTPS)

### Passo 1: Criar Personal Access Token

1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token" > "Generate new token (classic)"
3. Dê um nome (ex: "desafioscteciaparadevs")
4. Selecione escopos: `repo` (acesso completo aos repositórios)
5. Clique em "Generate token"
6. **COPIE O TOKEN** (você só verá ele uma vez!)

### Passo 2: Limpar credenciais antigas

```bash
# Remover credenciais salvas
git credential-cache exit
# ou
git credential-store erase
rm ~/.git-credentials  # Se existir
```

### Passo 3: Fazer push (será solicitado token)

```bash
git push --set-upstream origin develop
```

Quando solicitado:
- **Username**: `andrevilmo`
- **Password**: Cole o Personal Access Token (não sua senha do GitHub!)

### Passo 4: Salvar credenciais (opcional)

O Git pode perguntar se deseja salvar. Se sim, use o token como senha.

## Solução 3: Usar GitHub CLI

### Instalar GitHub CLI

```bash
# Ubuntu/Debian
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh
```

### Autenticar

```bash
gh auth login
# Siga as instruções na tela
```

### Fazer push

```bash
git push --set-upstream origin develop
```

## Verificar Configuração Atual

```bash
# Ver remote
git remote -v

# Ver configuração do usuário
git config user.name
git config user.email

# Ver credenciais salvas (se houver)
cat ~/.git-credentials 2>/dev/null || echo "Nenhuma credencial salva"
```

## Troubleshooting

### Erro: "remote: Support for password authentication was removed"

GitHub não aceita mais senhas. Use:
- Personal Access Token (Solução 2)
- SSH (Solução 1)

### Erro: "Permission denied (publickey)"

1. Verifique se a chave SSH está adicionada ao GitHub
2. Teste a conexão: `ssh -T git@github.com`
3. Verifique se está usando SSH: `git remote -v` deve mostrar `git@github.com`

### Erro: "fatal: could not read Username"

Configure o username no remote:
```bash
git remote set-url origin https://andrevilmo@github.com/andrevilmo/desafioscteciaparadevs.git
```

### Limpar tudo e começar de novo

```bash
# Remover credenciais
git credential-cache exit
rm ~/.git-credentials 2>/dev/null

# Verificar remote
git remote -v

# Se estiver usando HTTPS, pode mudar para SSH
git remote set-url origin git@github.com:andrevilmo/desafioscteciaparadevs.git
```

## Recomendação

**Use SSH (Solução 1)** - É mais seguro e não precisa ficar inserindo tokens.
