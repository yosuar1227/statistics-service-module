# statistics-service-module
# Servicio de Estadísticas — Short Links
- Este módulo forma parte del ecosistema del acortador de URLs. Su objetivo es permitir la consulta de métricas de uso de cada URL generada, incluyendo:

- Número total de visitas

- Cantidad de clics por día

- Estadísticas filtradas por fecha específica

- El servicio expone un endpoint REST que entrega estas métricas a partir del código del enlace.

# Características principales
1. Consultar estadísticas por código
2. El módulo expone el endpoint: GET /stats/{codigo}

- Este permite:

1. Obtener todas las estadísticas del link.
2. Ver los clics agrupados por día.
3. Filtrar por una fecha específica mediante query params, por ejemplo: GET /stats/abc123?date=2025-01-20

# Tecnologías utilizadas

- AWS Lambda → Lógica del redireccionamiento

- API Gateway → Exponer el endpoint GET /{codigo}

- DynamoDB (tabla compartida) → Almacena codigo → url_original

- Terraform → Infraestructura IaC para Lambda + API Gateway

- GitHub Actions → CI/CD para despliegue automático

# Estructura del proyecto
app/
├── src/
│   ├── databases
│   ├── handlers
│
└── terraform/
    ├── main.tf
    ├── providers.tf
    ├── variables.tf
    ├── backend.tf
    └── data.tf
