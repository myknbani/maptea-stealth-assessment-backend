# Maptea Backend Assessment

This is a simple GraphQL backend, featuring creation and retrieval of leads and their interests.

## Tech Stack

- Backend framework: [Nestjs](https://nestjs.com/)
- ORM: [MikroORM](https://mikro-orm.io/)
- Database: [PostgreSQL](https://www.postgresql.org/)

This also uses [pnpm](https://pnpm.io/) as a package manager for features such as disk space savings
and faster (symlinked) installs.

## Getting Started

**This is hosted in https://api.stackslurper.xyz/graphql**

But to run locally, a Docker Compose file is provided.

- It needs [v2.22](https://docs.docker.com/compose/how-tos/file-watch/) or higher to use `--watch` mode.
- **[UNTESTED]** If you have an older version, you can just use `docker-compose up` instead.
  - The watch mode is for rebuilding the Docker image when new dependencies are added/updated/removed.

```
docker-compose up --build --watch
```

- Migrations and seeders (the 3 services + one dummy user) will run:
  ![migration](images/migration.png)
- The backend will then run, and GraphiQL will be available at: http://localhost:3001/graphql
  ![nest](images/nest-logs.png)

## Architecture

[3-layer architecture](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/projectstructre/createlayers.md)

- entry point will be GraphQL resolvers
  - this allows a possibility of using other entry points (e.g. REST, gRPC, or event-driven "doors"
    to other microservices)
  - `*.resolver.ts` files - very lean code, usually just delegating to services
- business logic will be in services
  - business logic goes here, and is GraphQL-agnostic and DB/ORM-agnostic as possible
  - `*.service.ts` files - fatter code
- data access will be in repositories
  - complicated `.find*` queries go here, or even falling back to raw SQL
  - `*.repository.ts` files
- models
  - `*.entity.ts` files - these are the MikroORM entities, and form the base of validation rules
  - `*.input.ts` files - these are the GraphQL input types, extracted from entities for DRY code

## Sample cURL Requests

### Create a lead

```sh
# Please use http://localhost:3001 on local
curl -s -X POST https://api.stackslurper.xyz/graphql \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d @- <<EOF # | jq   # Uncomment to pretty-print if you have jq installed
{
  "query": "mutation RegisterLead(\$registrationInput: RegisterLeadInput!) {
    register(registerLeadInput: \$registrationInput) {
      id
      name
    }
  }",
  "variables": {
    "registrationInput": {
      "name": "mike2",
      "email": "foo@bar.xyz",
      "fullPhoneNumber": "639294584946",
      "postCode": "2233",
      "servicesInterestedIn": ["delivery"]
    }
  }
}
EOF

```

### Get Leads

```sh
# Please use http://localhost:3001 on local
curl -X POST https://api.stackslurper.xyz/graphql \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d @- <<EOF # | jq   # Uncomment to pretty-print if you have jq installed
{
  "query": "query GetLeads(\$pagination: ListLeadsInput!) {
    leads(listLeadsInput: \$pagination) {
      pageInfo {
        totalItemsCount
        totalPageCount
      }
      leads {
        id
        name
        email
        servicesInterestedIn {
          name
        }
      }
    }
  }",
  "variables": {
    "pagination": {
      "page": 2,
      "limit": 2
    }
  }
}
EOF
```

### Get Lead

```sh
# Please use http://localhost:3001 on local
curl -s -X POST https://api.stackslurper.xyz/graphql \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d @- <<EOF # | jq   # Uncomment to pretty-print if jq is installed
{
  "query": "query GetLead(\$leadId: Int!) {
    lead(id: \$leadId) {
      id
      servicesInterestedIn {
        name
      }
      name
      email
    }
  }",
  "variables": {
    "leadId": 14
  }
}
EOF
```

---

### With Authentication

Felt like adding this, since unauthenticated ones are helpful for a low-friction demo, but a production
system would need authentication.

##### Get Access Token

There's only one user right now, that's seeded. Username and password are both `admin`, but there
are no administrative functions yet 😅

```sh
# Please use http://localhost:3001 on local
curl -s -X POST https://api.stackslurper.xyz/graphql \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d @- <<EOF # | jq   # Uncomment to pretty-print if jq is installed
{
  "query": "mutation Login(\$loginInput: LoginInput!) {
    login(loginInput: \$loginInput) {
      accessToken
    }
  }",
  "variables": {
    "loginInput": {
      "username": "admin",
      "password": "admin"
    }
  }
}
EOF
```

##### Get Authenticated Leads

Token has probably expired by now, but this is an example of how to use it.

```sh
# Please use http://localhost:3001 on local
curl -X POST https://api.stackslurper.xyz/graphql \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3NDgyMjQ1NjgsImV4cCI6MTc0ODIyODE2OH0.QRxqIWZKut6t9aHXHr6FacgMvqjVU-Drbs9j8_tqz40" \
  -d @- <<EOF # | jq   # Uncomment to pretty-print if you have jq installed
{
  "query": "query GetLeads(\$pagination: ListLeadsInput!) {
    authenticatedLeads(listLeadsInput: \$pagination) {
      pageInfo {
        totalItemsCount
        totalPageCount
      }
      leads {
        id
        name
        email
        servicesInterestedIn {
          name
        }
      }
    }
  }",
  "variables": {
    "pagination": {
      "page": 2,
      "limit": 2
    }
  }
}
EOF
```
