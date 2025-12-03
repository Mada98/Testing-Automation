# 🎓 Guía de Demo: cy.prompt() para Clase de Cypress - 2S Advance Automation Testing

---


## 📋 Introducción

`cy.prompt()` es una función experimental de Cypress v15.4.0+ que permite escribir tests usando **lenguaje natural** en lugar de comandos de Cypress tradicionales. Esto hace que los tests sean más accesibles para personas sin experiencia en programación.

## 🚀 Requisitos Previos

### 1. Versión de Cypress
```bash
# Verificar versión actual
npx cypress --version

# Actualizar a v15.4.0 o superior (si es necesario)
npm install cypress@latest
```

### 2. Configuración en cypress.config.js
```javascript
module.exports = defineConfig({
  e2e: {
    experimentalPromptCommand: true, // Habilita cy.prompt()
    // ... otras configuraciones
  },
})
```

### 3. Cuenta de Cypress Cloud
- Crear cuenta gratuita en: https://cloud.cypress.io
- Iniciar sesión en la aplicación de Cypress
- O usar `--record` con una key válida

## 🌍 Soporte de Idiomas

### ⚠️ IMPORTANTE sobre idiomas:

- **cy.prompt() oficial de Cypress**: Optimizado para **inglés únicamente**
  - Requiere Cypress v15.4.0+
  - No garantiza soporte para otros idiomas
  
- **Nuestro fallback personalizado**: Soporta **inglés Y español**
  - Funciona con cualquier versión de Cypress
  - Reconoce comandos en ambos idiomas automáticamente
  - Ver ejemplos en: `cypress/e2e/features/login-prompt-demo-espanol.spec.js`

### Ejemplo en Español:

```javascript
usePrompt([
  'visitar https://www.saucedemo.com',
  'escribir "standard_user" en el campo de usuario',
  'escribir "secret_sauce" en el campo de contraseña',
  'hacer clic en el botón de login',
  'verificar que somos redirigidos a la página de inventario',
])
```

### Ejecutar ejemplos en español:

```bash
# Modo headed (con navegador visible)
npm run demo:prompt-espanol

# Modo interactivo (abre Cypress GUI para seleccionar archivo)
npm run demo:prompt-espanol-open
```

## 📚 Ejemplos para la Demo

### Ejemplo 1: Login Básico

**Código tradicional de Cypress:**
```javascript
it('Login básico', () => {
  cy.visit('https://www.saucedemo.com')
  cy.get('#user-name').type('standard_user')
  cy.get('#password').type('secret_sauce')
  cy.get('#login-button').click()
  cy.url().should('include', '/inventory.html')
})
```

**Con cy.prompt():**
```javascript
it('Login básico', () => {
  cy.prompt([
    'visit https://www.saucedemo.com',
    'type "standard_user" in the username field',
    'type "secret_sauce" in the password field',
    'click the login button',
    'verify we are redirected to the inventory page',
  ])
})
```

### Ejemplo 2: Usando Placeholders (Datos Sensibles)

```javascript
it('Login con placeholders', () => {
  const password = 'secret_sauce'
  
  cy.prompt(
    [
      'visit https://www.saucedemo.com',
      'type "standard_user" in the username field',
      'type {{password}} in the password field',
      'click the login button',
    ],
    {
      placeholders: {
        password: password,
      },
    }
  )
})
```

**Ventajas de placeholders:**
- ✅ Los datos sensibles NO se envían a la AI
- ✅ Mejora el cache (cambios en valores no invalidan el cache)
- ✅ Permite loops eficientes

### Ejemplo 3: Estilo Gherkin/BDD

```javascript
it('Login estilo Gherkin', () => {
  cy.prompt([
    'Given the user is on the login page',
    'When the user enters "standard_user" in the username field',
    'And the user enters "secret_sauce" in the password field',
    'And the user clicks the login button',
    'Then the user should be redirected to the inventory page',
  ])
})
```

### Ejemplo 4: Probar Múltiples Usuarios

```javascript
it('Probar login con múltiples usuarios', () => {
  const usuarios = [
    { username: 'standard_user', password: 'secret_sauce' },
    { username: 'problem_user', password: 'secret_sauce' },
    { username: 'performance_glitch_user', password: 'secret_sauce' },
  ]

  usuarios.forEach((usuario) => {
    cy.prompt(
      [
        'visit https://www.saucedemo.com',
        `type "{{username}}" in the username field`,
        `type "{{password}}" in the password field`,
        'click the login button',
        'verify the inventory container is visible',
      ],
      {
        placeholders: {
          username: usuario.username,
          password: usuario.password,
        },
      }
    )
  })
})
```

## 🎯 Mejores Prácticas para Escribir Prompts

### ✅ OK: Steps claros y específicos
```javascript
cy.prompt([
  'visit https://www.saucedemo.com',
  'type "standard_user" in the username field',
  'click the "Login" button',
  'verify the "Products" heading is visible',
])
```

### ❌ ERRONEO: Steps ambiguos
```javascript
cy.prompt([
  'go to site',
  'enter user',
  'click button',
  'check page',
])
```

### ✅ OK: Una acción por paso
```javascript
cy.prompt([
  'type "standard_user" in the username field',
  'type "secret_sauce" in the password field',
  'click the login button',
])
```

### ❌ ERRONEO: Múltiples acciones en un paso
```javascript
cy.prompt([
  'visit site and login with standard_user and secret_sauce',
])
```

### ✅ OK: Usar comillas para valores específicos
```javascript
cy.prompt([
  'click the "Login" button',
  'verify the "Products" heading is visible',
])
```

## 🔍 Cómo Ver el Código Generado

1. Ejecutar el test con `cypress open`
2. En el Command Log, hacer clic en el botón **"Code"** junto a `cy.prompt`
3. Ver el código de Cypress generado
4. Opciones disponibles:
   - **Save to file**: Guardar el código en tu archivo de test
   - **Copy**: Copiar el código al portapapeles

## 🎬 Flujo de Demo Recomendado

### Parte 1: Introducción (5 min)
1. Mostrar un test tradicional de Cypress
2. Explicar que requiere conocimiento de selectores y comandos
3. Mostrar el mismo test con `cy.prompt()`
4. Destacar la diferencia en legibilidad

### Parte 2: Ejecución en Vivo (10 min)
1. Abrir Cypress App (`npm run cypress:runner`)
2. Ejecutar `login-prompt-demo.spec.js`
3. Mostrar cómo aparece en el Command Log
4. Hacer clic en "Code" para mostrar el código generado
5. Explicar que puedes exportar el código si lo deseas

### Parte 3: Placeholders (5 min)
1. Mostrar ejemplo con placeholders
2. Explicar ventajas:
   - Seguridad (datos sensibles no van a AI)
   - Performance (mejor cache)
   - Flexibilidad (loops eficientes)

### Parte 4: Estilo Gherkin (5 min)
1. Mostrar ejemplo estilo Gherkin
2. Explicar que es familiar para equipos que usan BDD
3. Destacar que no necesitas step definitions

### Parte 5: Integración con Cucumber (5 min)
1. Mostrar `login-prompt-demo.feature`
2. Ejecutar los escenarios
3. Explicar cómo combinar Gherkin con `cy.prompt()`

## 📝 Archivos de Ejemplo Incluidos

1. **`cypress/e2e/features/login-prompt-demo.spec.js`**
   - Ejemplos completos de uso de `cy.prompt()`
   - Incluye mejores prácticas
   - Listo para ejecutar

2. **`cypress/e2e/features/login-prompt-demo.feature`**
   - Ejemplos en Gherkin usando `cy.prompt()`
   - Integración con Cucumber

3. **`cypress/e2e/step_definitions/promptDemoSteps.js`**
   - Step definitions que usan `cy.prompt()`
   - Ejemplos de integración

## ⚠️ Limitaciones Importantes

1. **Requiere Cypress Cloud**: Necesitas estar logueado o usar `--record`
2. **Solo E2E**: No funciona en Component Testing
3. **Solo Chromium**: Chrome, Edge, Electron (no Firefox/Safari)
4. **Idioma**: Optimizado para inglés (otros idiomas no garantizados)
5. **Experimental**: Puede cambiar en futuras versiones

## 🎓 Puntos Claves

1. **Accesibilidad**: Cualquiera puede escribir tests sin conocer Cypress
2. **Auto-reparación**: Los tests se adaptan a cambios en la UI
3. **Transparencia**: Siempre puedes ver el código generado
4. **Flexibilidad**: Puedes exportar el código o mantener `cy.prompt()`
5. **Performance**: Cache inteligente hace que los tests sean rápidos

## 🔗 Recursos Adicionales

- [Documentación oficial de cy.prompt()](https://docs.cypress.io/api/commands/prompt)
- [Cypress Cloud](https://cloud.cypress.io)
- [Blog: Introducción a cy.prompt()](https://www.cypress.io/blog/cy-prompt-experimental-launch/)

## 💡 Tips para la Demo

1. **Preparar con anticipación**: Asegúrate de tener cuenta de Cypress Cloud
2. **Tener conexión a internet**: cy.prompt requiere conexión para la AI
3. **Mostrar ambos workflows**: Generar código vs mantener cy.prompt()
4. **Enfatizar transparencia**: Siempre puedes ver qué está haciendo
5. **Mostrar casos reales**: Usar ejemplos relevantes para tu audiencia

---

**¡Éxitos en la ejecución de la demo! 🚀**

