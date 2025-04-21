# AWS Backend with CDK and Lambda

Este proyecto implementa un backend serverless usando AWS CDK y Lambda Functions.

## Estructura del Proyecto

- `cdk/`: Infraestructura como código usando AWS CDK
- `lambdas/`: Funciones Lambda
  - `auth/`: Autenticación y autorización
  - `products/`: Gestión de productos
  - `orders/`: Gestión de órdenes
  - `files/`: Gestión de archivos

## Requisitos Previos

- Node.js 18+
- AWS CLI configurado
- AWS CDK instalado globalmente

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
   ```bash
   npm install
   ```

## Desarrollo

### Comandos Útiles

- `npm run build` - Compilar TypeScript
- `npm run watch` - Compilar y observar cambios
- `npm run test` - Ejecutar tests
- `npx cdk deploy` - Desplegar stack
- `npx cdk diff` - Comparar cambios
- `npx cdk synth` - Generar plantilla CloudFormation

### Configuración

1. Copiar `.env.example` a `.env`
2. Configurar las variables de entorno necesarias

## Despliegue

1. Bootstrap CDK (solo primera vez):
   ```bash
   npx cdk bootstrap
   ```

2. Desplegar infraestructura:
   ```bash
   npx cdk deploy
   ```

## Testing

```bash
npm test
```

## Ejecutar Lambda Localmente

```bash
npx ts-node lambdas/auth/login/test-local.ts
```
