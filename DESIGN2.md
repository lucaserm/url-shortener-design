# Design — URL Shortener

## Requisitos Funcionais

1. O sistema deve ser capaz de gerar um URL curto a partir de um URL longo.
2. O sistema deve ser capaz de redirecionar um URL curto para o URL longo correspondente.
3. O sistema deve suportar expiração de URLs (TTL configurável).
4. O sistema deve suportar URLs customizadas pelo usuário (ex: `short.url/meu-link`).
5. O sistema deve registrar analytics básicos por URL (total de cliques, data do último acesso).
