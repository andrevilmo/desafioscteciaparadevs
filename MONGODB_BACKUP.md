# 📦 MongoDB Backup e Restore

Este documento descreve como usar os scripts de backup e restore do MongoDB.

## 📋 Visão Geral

O sistema de backup permite:
- ✅ Criar backups do banco de dados MongoDB
- ✅ Restaurar backups automaticamente na inicialização
- ✅ Restaurar backups manualmente quando necessário
- ✅ Listar backups disponíveis

Os backups são salvos na pasta `data/backups/` em formato comprimido (`.archive.gz`).

## 🚀 Comandos Disponíveis

### Criar Backup

```bash
npm run mongodb:backup
```

Este comando:
- Cria um backup completo do banco de dados
- Salva na pasta `data/backups/` com timestamp
- Mostra o tamanho do arquivo criado
- Lista os últimos 5 backups

**Exemplo de saída**:
```
📦 Iniciando backup do MongoDB...
   Database: desafioscteciaparadevs
   Destino: data/backups/backup_20240115_143022
✅ Backup criado com sucesso!
   Arquivo: data/backups/backup_20240115_143022.archive.gz
   Tamanho: 2.5M
   Data: 2024-01-15 14:30:22
```

### Restaurar Backup

#### Restaurar o backup mais recente

```bash
npm run mongodb:restore
```

#### Restaurar um backup específico

```bash
npm run mongodb:restore data/backups/backup_20240115_143022.archive.gz
```

Ou apenas o nome do arquivo:

```bash
npm run mongodb:restore backup_20240115_143022.archive.gz
```

**⚠️ Atenção**: A restauração substitui todos os dados atuais do banco de dados!

### Listar Backups

```bash
npm run mongodb:backup:list
```

Mostra os últimos 10 backups disponíveis com tamanho e data.

### Iniciar MongoDB com Restore Automático

```bash
npm run mongodb:start:with-restore
```

Este comando:
1. Inicia o MongoDB
2. Aguarda o MongoDB estar pronto
3. Restaura automaticamente o backup mais recente (se existir)

**Útil para**: Desenvolvimento onde você quer sempre começar com dados conhecidos.

## 📁 Estrutura de Arquivos

```
data/
└── backups/
    ├── backup_20240115_143022.archive.gz
    ├── backup_20240115_120000.archive.gz
    └── ...
```

## 🔄 Fluxo de Trabalho Recomendado

### Desenvolvimento

1. **Criar backup inicial**:
   ```bash
   npm run mongodb:backup
   ```

2. **Iniciar com restore automático**:
   ```bash
   npm run mongodb:start:with-restore
   ```

3. **Trabalhar normalmente** - fazer alterações, testes, etc.

4. **Criar backup antes de mudanças importantes**:
   ```bash
   npm run mongodb:backup
   ```

### Produção

1. **Backup regular** (agendar via cron):
   ```bash
   # Adicionar ao crontab para backup diário às 2h
   0 2 * * * cd /caminho/do/projeto && npm run mongodb:backup
   ```

2. **Backup antes de atualizações**:
   ```bash
   npm run mongodb:backup
   ```

3. **Restore em caso de problemas**:
   ```bash
   npm run mongodb:restore backup_YYYYMMDD_HHMMSS.archive.gz
   ```

## 📝 Detalhes Técnicos

### Formato dos Backups

- **Formato**: Archive comprimido com gzip
- **Extensão**: `.archive.gz`
- **Ferramenta**: `mongodump` e `mongorestore`
- **Compressão**: Gzip para economizar espaço

### Localização

- **Diretório**: `data/backups/`
- **Nomenclatura**: `backup_YYYYMMDD_HHMMSS.archive.gz`
- **Exemplo**: `backup_20240115_143022.archive.gz`

### Requisitos

- MongoDB deve estar rodando
- Container Docker `desafio-mongodb` deve estar ativo
- Espaço em disco suficiente para os backups

## 🔧 Troubleshooting

### Erro: "Container MongoDB não está rodando"

**Solução**: Inicie o MongoDB primeiro:
```bash
npm run mongodb:start
```

### Erro: "Nenhum backup encontrado"

**Solução**: Crie um backup primeiro:
```bash
npm run mongodb:backup
```

### Erro: "Erro ao fazer backup"

**Possíveis causas**:
- Container não está rodando
- Sem espaço em disco
- Problemas de permissão

**Solução**:
1. Verifique se o MongoDB está rodando: `npm run mongodb:status`
2. Verifique espaço em disco: `df -h`
3. Verifique permissões: `ls -la data/backups/`

### Backup muito grande

**Solução**: Os backups são comprimidos automaticamente. Se ainda assim forem grandes:
- Considere fazer backup apenas de coleções específicas
- Limpe backups antigos regularmente
- Use backup incremental (requer configuração adicional)

### Restaurar backup antigo

**Solução**: Liste os backups disponíveis e especifique o arquivo:
```bash
npm run mongodb:backup:list
npm run mongodb:restore backup_YYYYMMDD_HHMMSS.archive.gz
```

## 🔐 Segurança

### Backups Contêm Dados Sensíveis

⚠️ **Importante**: Os backups contêm todos os dados do banco de dados, incluindo informações sensíveis.

**Recomendações**:
- Não commite backups no Git (já está no `.gitignore`)
- Armazene backups em local seguro
- Criptografe backups em produção
- Limite acesso aos arquivos de backup

### Limpeza de Backups Antigos

Para manter apenas os backups mais recentes:

```bash
# Manter apenas os últimos 7 backups
cd data/backups
ls -t *.archive.gz | tail -n +8 | xargs rm -f
```

Ou criar um script de limpeza automática.

## 📊 Exemplos de Uso

### Backup antes de teste destrutivo

```bash
# Criar backup
npm run mongodb:backup

# Executar testes que podem modificar dados
npm test

# Restaurar se necessário
npm run mongodb:restore
```

### Backup diário automático

Adicione ao crontab:
```bash
crontab -e
```

Adicione a linha:
```
0 2 * * * cd /caminho/do/projeto && npm run mongodb:backup >> /var/log/mongodb-backup.log 2>&1
```

### Restaurar dados de produção em desenvolvimento

```bash
# 1. Copiar backup de produção para data/backups/
cp /backup/producao/backup_20240115.archive.gz data/backups/

# 2. Parar MongoDB
npm run mongodb:stop

# 3. Iniciar e restaurar
npm run mongodb:start:with-restore
```

## 🎯 Boas Práticas

1. **Backup regular**: Crie backups antes de mudanças importantes
2. **Teste restauração**: Periodicamente teste se os backups podem ser restaurados
3. **Múltiplos backups**: Mantenha vários backups (diário, semanal, mensal)
4. **Verificação**: Verifique o tamanho dos backups para detectar problemas
5. **Documentação**: Documente quando e por que cada backup foi criado
6. **Limpeza**: Remova backups antigos para economizar espaço

---

**Para mais informações sobre MongoDB backup/restore, consulte a [documentação oficial](https://docs.mongodb.com/manual/core/backups/).**
