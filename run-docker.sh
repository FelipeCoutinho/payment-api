#!/bin/bash
set -e # Interrompe a execução em caso de erro

if ! command -v docker &>/dev/null; then
  echo " Docker não está instalado! Instale o Docker antes de rodar este script."
  exit 1
fi

if ! command -v docker-compose &>/dev/null; then
  echo "Docker Compose não está instalado! Instale o Docker Compose antes de rodar este script."
  exit 1
fi

echo "Parando e removendo containers antigos..."
docker-compose -f _development/compose.yml down -v

echo "Subindo os containers com Docker Compose..."
docker-compose -f _development/compose.yml up -d --build

echo "✅ Docker Compose rodando com sucesso!"
