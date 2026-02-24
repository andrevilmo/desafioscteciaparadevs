# 🔧 Corrigir Incompatibilidade docker-compose

## Problema

Você está recebendo o erro:
- `Not supported URL scheme http+docker`
- `Error while fetching server API version`
- `docker.errors.DockerException`

Isso acontece porque o `docker-compose` 1.29.2 é incompatível com Docker 28.x.

## Solução Rápida (Recomendada)

**Use o método alternativo que já está funcionando:**

```bash
npm run mongodb:start:direct
```

Este método não depende do docker-compose e sempre funciona!

## Solução Permanente (Opcional)

Se você quiser corrigir o docker-compose para usar no futuro:

### Opção 1: Instalar docker-compose-v2 (Ubuntu 22.04)

```bash
sudo apt update
sudo apt install docker-compose-v2
```

Depois disso, você pode usar `docker compose` (com espaço) que é a versão moderna.

### Opção 2: Baixar binário direto do GitHub

```bash
# Baixar a versão mais recente
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Dar permissão de execução
sudo chmod +x /usr/local/bin/docker-compose

# Verificar instalação
docker-compose --version
```

### Opção 3: Instalar via pip (pode ter problemas)

```bash
pip3 install --upgrade docker-compose
```

**Nota**: Esta opção pode não resolver completamente o problema devido a dependências do sistema.

## Verificar Qual Versão Está Instalada

```bash
# Ver versão atual
docker-compose --version

# Ver localização
which docker-compose

# Ver se docker compose (v2) está disponível
docker compose version
```

## Recomendação

**Use o método alternativo** (`npm run mongodb:start:direct`) que:
- ✅ Já está funcionando
- ✅ Não requer atualizações
- ✅ É mais simples e confiável
- ✅ Funciona em qualquer versão do Docker

O método alternativo usa `docker run` diretamente, que é mais compatível e não depende de docker-compose.
