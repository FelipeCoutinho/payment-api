# Giro Chile - Organization Application

The project is responsible for capturing and storing all data relating to organizations and users, also taking care of the consistency of user data stored in KeyCloak (System for authentication and authorization with SSO - Single Sign-On) resource.

The application has public resources for requesting new access, where new companies can register by sending their data and documents for analysis.

Profiles that have permission to access protected resources:
* Administrators:
  * _ADMIN:_ Platform administrator
  * _ADMIN_BIDDING:_ Bidding administrator 
  * _ADMIN_PRODUCER:_ Producer administrator 
  * _ADMIN_DOMICILIARY:_ Domiciliary administrator 
  * _ADMIN_NON_DOMICILIARY:_ Non domiciliary administrator
* Clientes:
  * _MANAGER:_ Entity management users
  * _PRODUCER:_ Users of producing entity
  * _INDUSTRIAL_CONSUMER:_ Industrial consumer entity users
  * _CITY:_ City users

## 📋 Prerequisites
- [Node.js](https://nodejs.org/en/): 20+
- [PostgreSQL](https://www.postgresql.org/): 14+

## Installation

```bash
# Clone this repository
$ git clone <https://bitbucket.org/redeciclo/giro-organizations>

# Duplicate .exemple.env and set required ENVs (below are all existing ENVs)
$ cp .exemple.env .env

# Access the project folder in the terminal/cmd
$ cd giro-organizations

# Install dependencies
$ npm install

# Run the application in development mode
$ npm run start:dev

# Default server port: 3000
# API is running in <http://localhost:3000>
# Swagger is running in <http://localhost:3000/swagger-ui.html>
```

### Tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Project ENVs

| ENVIRONMENT VARIABLES                     | Example                                           | Default                                  |
|-------------------------------------------|---------------------------------------------------|------------------------------------------|
| GLOBAL_PREFIX                             | ""                                                | ""                                       |
| PORT                                      | 3000                                              | 3000                                     |
| CONTEXT_PATH                              | /giro-organizations                               | /giro-organizations                      |
| **Database**                              |                                                   |                                          |
| DATABASE_URL                              | postgresql://user:pass@host:port/db?schema=public |                                          |
| DATABASE_LOGGING                          | true/false                                        | false                                    |
| DATABASE_RUN_MIGRATION_ON_STARTUP         | true/false                                        | true                                     |
| **Keycloak**                              |                                                   |                                          |
| KEYCLOAK_AUTH_SERVER_URL                  | https://auth.keycloack.com                        |                                          |
| KEYCLOAK_REALM                            | giro                                              |                                          |
| KEYCLOAK_CLIENT_ID                        | 50665d1a-3159-4e38-a47f-b297c8b9c221              |                                          |
| KEYCLOAK_CLIENT_SECRET                    | VPYKU0wQz5FEdB4TVPYKU0wQz5FEdB4T                  |                                          |
| KEYCLOAK_ADMIN_USER                       | user-keycloack                                    |                                          |
| KEYCLOAK_ADMIN_PASS                       | pass-keycloack                                    |                                          |
| KEYCLOAK_GRANT_TYPE                       | password                                          | password                                 |
| KEYCLOAK_POLICY_ENFORCEMENT               | ENFORCING                                         | ENFORCING                                |
| KEYCLOAK_TOKEN_VALIDATION                 | ONLINE                                            | ONLINE                                   |
| KEYCLOAK_EMAIL_LIFESPAN                   | 3600                                              | 3600                                     |
| **Keycloak - ROLE NAMES**                 |                                                   |                                          |
| KEYCLOAK_MANAGER_ROLE_NAME                | giro-manager                                      | giro-manager                             |
| KEYCLOAK_PRODUCER_ROLE_NAME               | giro-producer                                     | giro-producer                            |
| KEYCLOAK_INDUSTRIAL_CONSUMER_ROLE_NAME    | giro-industrial-consumer                          | giro-industrial-consumer                 |
| KEYCLOAK_CITY_ROLE_NAME                   | giro-city                                         | giro-city                                |
| **Microservices**                         |                                                   |                                          |
| MS_ATTACHMENT_URL                         | https://url.com                                   |                                          |
| MS_MAILER_URL                             | https://url.com                                   |                                          |
| **Asynchonous Jobs**                      |                                                   |                                          |
| **AMQP**                                  |                                                   |                                          |
| AMQP_URI                                  | amqp://guest:guest@localhost:5672                 |                                          |
| ORGANIZATION_UPDATED_EXCHANGE_NAME        | giro-organizations.organizations.updated          | giro-organizations.organizations.updated |
| ORGANIZATION_UPDATED_EXCHANGE_TYPE        | fanout                                            | fanout                                   |
| ORGANIZATION_UPDATED_EXCHANGE_ROUTING_KEY | organizations.updated                             | organizations.updated                    |# Organization
