
# Payment API

Este projeto é uma **API RESTful** desenvolvida com **NestJS** para gerenciamento de pagamentos, utilizando **arquitetura hexagonal** e um conjunto robusto de tecnologias modernas para garantir escalabilidade, testabilidade e manutenção.

---

## 📌 **Arquitetura do Projeto**
O projeto segue **80% da arquitetura hexagonal**, onde os módulos e serviços são organizados em **camadas separadas** para melhor isolamento e manutenibilidade.

**📌 Arquitetura implementada:**
✅ **Camada de Domínio:** Contém **entidades** e **regras de negócio**.  
✅ **Camada de Aplicação:** Implementa **casos de uso** e **lógica de serviços**.  
✅ **Camada de Infraestrutura:** Repositórios, banco de dados e comunicação com serviços externos.  
✅ **Camada de Interface:** Controladores expostos via **Swagger** para consumo externo.  

Utilizamos **arquitetura hexagonal** para garantir:
- **Baixo acoplamento** entre componentes.
- **Facilidade de manutenção e escalabilidade**.
- **Testabilidade** aprimorada com `TestContainers`, `Jest` e `Supertest`.

---

## 📌 **Tecnologias Utilizadas**
| Tecnologia     | Descrição |
|---------------|-----------|
| **NestJS**    | Framework Node.js para construção modular e escalável de APIs. |
| **TypeScript**| Superset do JavaScript com tipagem estática. |
| **PostgreSQL**| Banco de dados relacional utilizado no projeto. |
| **TypeORM**   | ORM para manipulação da base de dados com suporte a migrations. |
| **Jest**      | Framework de testes para validar funcionalidades e integração. |
| **Supertest** | Biblioteca para testar endpoints HTTP. |
| **TestContainers** | Criação de containers dinâmicos para testes de integração. |
| **Docker & Docker Compose** | Containerização para execução do ambiente local. |
| **Shell Script** | Automação do setup do ambiente (`run-docker.sh`). |
| **Swagger**   | Documentação automática da API. |
| **MVC**       | Organização do código seguindo o padrão **Model-View-Controller**. |

---

## 📌 **Instalação e Execução**
### **1️⃣ Pré-requisitos**
Antes de iniciar, certifique-se de ter instalado:
- **[Node.js](https://nodejs.org/) (v18+)**
- **[Docker & Docker Compose](https://www.docker.com/)**
- **`npm`** ou **`yarn`** para gerenciamento de pacotes.

### **2️⃣ Configuração do Ambiente**
1. **Clone o repositório**
   ```sh
   git clone https://github.com/seu-usuario/payment-api.git
   cd payment-api
Instale as dependências



Rode as migrations
sh
```
Editar
npm run migration:run
```
Inicie a API
sh
```
Copiar
npm run start:dev
```
📌 Testes
O projeto inclui testes unitários e de integração usando Jest, Supertest e TestContainers.

Após iniciar a API, acesse:
```
http://localhost:3000/api/docs
```

Endpoints principais
POST /payments - Criar um pagamento
GET /payments - Listar todos os pagamentos
GET /payments/:id - Buscar pagamento por ID
PUT /payments/:id/status - Atualizar status do pagamento

📌 Estrutura de Pastas
```
├── .eslintrc.js
├── .exemple.env
├── .gitignore
├── .prettierrc
├── Dockerfile
├── README.md
├── _development
    ├── 01-init-databases.sql
    └── compose.yml
├── nest-cli.json
├── package-lock.json
├── package.json
├── run-docker.sh
├── src
    ├── app.module.ts
    ├── app.ormconfig.ts
    ├── app.properties.ts
    ├── app
    │   ├── database
    │   │   ├── orm
    │   │   │   ├── abstract-entity.ts
    │   │   │   ├── abstract.repository.ts
    │   │   │   ├── custom-pagination-meta.ts
    │   │   │   ├── order-by-util.ts
    │   │   │   └── pagination-query-pipe.ts
    │   │   ├── sort
    │   │   │   ├── dynamic-sort-pipe.ts
    │   │   │   └── dynamic-sort.ts
    │   │   └── test-database.ts
    │   ├── health
    │   │   ├── health.controller.ts
    │   │   └── health.module.ts
    │   └── payment
    │   │   ├── controlleres
    │   │       ├── payment.controller.spec.ts
    │   │       └── payment.controller.ts
    │   │   ├── dto
    │   │       ├── external-payment-status.dto.ts
    │   │       ├── payment-create.dto.ts
    │   │       └── payment-status.dto.ts
    │   │   ├── entities
    │   │       └── payment.entity.ts
    │   │   ├── enum
    │   │       └── payment-enum.ts
    │   │   ├── payment.module.ts
    │   │   ├── repository
    │   │       ├── payment.repository.spec.ts
    │   │       └── payment.repository.ts
    │   │   └── services
    │   │       ├── payment.service.spec.ts
    │   │       └── payment.service.ts
    ├── config
    │   ├── keycloak-admin
    │   │   └── keycloak-admin.service.ts
    │   ├── keycloak
    │   │   ├── global-keycloak.guard.ts
    │   │   ├── keycloak-config.module.ts
    │   │   └── keycloak-config.service.ts
    │   └── roles.const.ts
    ├── main.ts
    ├── middleware
    │   ├── global-advice
    │   │   ├── dto
    │   │   │   └── error.dto.ts
    │   │   ├── exception
    │   │   │   ├── state-machine.error.ts
    │   │   │   └── validation-exception.error.ts
    │   │   ├── global-advice.module.ts
    │   │   ├── global-exception.filter.ts
    │   │   └── global-validation.pipe.ts
    │   ├── logger
    │   │   └── logger.middleware.ts
    │   └── user-header.middleware.ts
    ├── migrations
    │   └── 1710428197025-CreatePayment.ts
    ├── resource
    │   ├── ExternalPaymentProvider
    │   │   ├── dto
    │   │   │   └── dto.ts
    │   │   ├── externalPaymentProvider-resource.module.ts
    │   │   └── externalPaymentProvider-resource.service.ts
    │   └── resource.module.ts
    └── util
    │   ├── json-util.ts
    │   └── mapper-util.ts
├── test
    └── jest-e2e.json
├── tsconfig.build.json
└── tsconfig.json
