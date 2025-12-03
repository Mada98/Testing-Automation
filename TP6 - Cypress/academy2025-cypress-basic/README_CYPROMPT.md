# 🎓 Guía Rápida: cy.prompt() Demo

## ⚡ Inicio Rápido

### 1. Verificar/Actualizar Cypress
```bash
# Verificar versión (debe ser v15.4.0+)
npx cypress --version

# Si es menor a v15.4.0, actualizar:
npm install cypress@latest
```

### 2. Configurar Cypress Cloud
- Crear cuenta gratuita en: https://cloud.cypress.io
- Iniciar sesión en la aplicación de Cypress (`npm run cypress:runner`)

### 3. Ejecutar Demo
```bash
# Ejecutar ejemplos en JavaScript (inglés) - Modo headed
npm run demo:prompt

# Abrir Cypress GUI para seleccionar archivo manualmente
npm run demo:prompt-open

# Ejecutar ejemplos en español - Modo headed
npm run demo:prompt-espanol

# Abrir Cypress GUI para seleccionar archivo en español
npm run demo:prompt-espanol-open

# Ejecutar ejemplos en Gherkin/Cucumber
npm run demo:prompt-feature
```

## 📁 Archivos de Demo

- **`cypress/e2e/features/login-prompt-demo.spec.js`** - Ejemplos completos en JavaScript
- **`cypress/e2e/features/login-prompt-demo.feature`** - Ejemplos en Gherkin
- **`cypress/e2e/step_definitions/promptDemoSteps.js`** - Step definitions con cy.prompt
- **`CYPRESS_PROMPT_DEMO.md`** - Guía completa

## 🎯 Ejemplo Básico

```javascript
cy.prompt([
  'visit https://www.saucedemo.com',
  'type "standard_user" in the username field',
  'type "secret_sauce" in the password field',
  'click the login button',
  'verify we are redirected to the inventory page',
])
```

## 📚 Documentación Completa

Ver `CYPRESS_PROMPT_DEMO.md` para la guía completa de la demo.

