# 🔧 Corrigir Permissões do Docker

## Problema

Você está recebendo um dos seguintes erros:
- `permission denied while trying to connect to the Docker daemon socket`
- `Error while fetching server API version`
- `Not supported URL scheme http+docker`

## Causa

Seu usuário não está no grupo `docker`, então você não tem permissão para acessar o Docker daemon.

## Solução Rápida

```bash
# 1. Adicionar seu usuário ao grupo docker
sudo usermod -aG docker $USER

# 2. Ativar as novas permissões (escolha uma opção):
newgrp docker
# OU faça logout e login novamente
# OU reinicie o computador

# 3. Verificar se funcionou
docker ps
```

## Solução com Script

```bash
# Use o script auxiliar do projeto
npm run docker:fix-permissions
```

## Verificar se Está Funcionando

Após executar os comandos acima, teste:

```bash
# Deve funcionar sem sudo
docker ps

# Se funcionar, você pode iniciar o MongoDB
npm run mongodb:start
```

## Por Que Isso Acontece?

Por padrão, apenas o usuário `root` e usuários no grupo `docker` podem acessar o Docker daemon. Isso é uma medida de segurança.

## Se Ainda Não Funcionar

1. **Verifique se o Docker está rodando**:
```bash
sudo systemctl status docker
```

2. **Se não estiver rodando, inicie**:
```bash
sudo systemctl start docker
sudo systemctl enable docker
```

3. **Verifique seus grupos**:
```bash
groups
```

Você deve ver `docker` na lista. Se não aparecer, execute novamente:
```bash
sudo usermod -aG docker $USER
newgrp docker
```

4. **Se ainda não funcionar, faça logout completo e login novamente**
