# Guia de Instalação do Docker

## Ubuntu/Debian

### Instalação Rápida

```bash
# 1. Atualizar pacotes
sudo apt update

# 2. Instalar Docker e Docker Compose
sudo apt install docker.io docker-compose

# 3. Iniciar serviço Docker
sudo systemctl start docker
sudo systemctl enable docker

# 4. Adicionar seu usuário ao grupo docker (para não precisar de sudo)
sudo usermod -aG docker $USER

# 5. IMPORTANTE: Faça logout e login novamente, ou execute:
newgrp docker

# 6. Verificar instalação
docker --version
docker-compose --version
```

### Verificar se está funcionando

```bash
# Testar Docker
docker run hello-world

# Verificar status do serviço
sudo systemctl status docker
```

## macOS

1. Baixe [Docker Desktop para macOS](https://www.docker.com/products/docker-desktop)
2. Instale o arquivo .dmg
3. Abra Docker Desktop da pasta Applications
4. Aguarde até que o Docker esteja rodando (ícone na barra de menu)

## Windows

1. Baixe [Docker Desktop para Windows](https://www.docker.com/products/docker-desktop)
2. Execute o instalador
3. Siga as instruções do instalador
4. Reinicie o computador se solicitado
5. Abra Docker Desktop

## Verificar Instalação

Após instalar, execute no terminal:

```bash
docker --version
docker compose version
# ou
docker-compose --version
```

Se todos os comandos funcionarem, o Docker está instalado corretamente!

## Solução de Problemas

### Erro de permissão no Linux

Se receber erro "permission denied" ao executar comandos docker:

```bash
sudo usermod -aG docker $USER
newgrp docker
```

### Docker não inicia

```bash
# Verificar status
sudo systemctl status docker

# Iniciar manualmente
sudo systemctl start docker

# Habilitar para iniciar automaticamente
sudo systemctl enable docker
```
