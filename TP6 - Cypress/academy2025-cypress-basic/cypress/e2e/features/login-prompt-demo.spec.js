/**
 * 🎓 DEMO DE CLASE: cy.prompt() - Ejemplos para enseñanza
 * 
 * Este archivo contiene ejemplos prácticos de cómo usar cy.prompt()
 * para crear tests con lenguaje natural.
 * 
 * REQUISITOS (para cy.prompt oficial):
 * - Cypress v15.4.0 o superior
 * - experimentalPromptCommand: true en cypress.config.js
 * - Cuenta de Cypress Cloud (gratuita)
 * 
 * FALLBACK AUTOMÁTICO:
 * Si cy.prompt() oficial no está disponible, se usan comandos tradicionales
 * automáticamente usando cy.promptWithFallback()
 */

// Helper para usar cy.prompt con fallback automático
function usePrompt(steps, options = {}) {
  // Siempre usar promptWithFallback que maneja la detección internamente
  return cy.promptWithFallback(steps, options);
}

describe('🎓 Demo: cy.prompt() - Login con lenguaje natural', () => {
  
  /**
   * EJEMPLO 1: Login básico con cy.prompt
   * 
   * Este ejemplo muestra cómo escribir un test de login
   * usando lenguaje natural en lugar de comandos de Cypress.
   */
  it('Ejemplo 1: Login básico con lenguaje natural', () => {
    usePrompt([
      'visit https://www.saucedemo.com',
      'type "standard_user" in the username field',
      'type "secret_sauce" in the password field',
      'click the login button',
      'verify we are redirected to the inventory page',
    ])
  })

  /**
   * EJEMPLO 2: Login con placeholders para datos sensibles
   * 
   * Usa placeholders {{variable}} para valores dinámicos o sensibles.
   * Los placeholders NO se envían a la AI, manteniendo tus datos seguros.
   */
  it('Ejemplo 2: Login con placeholders (datos sensibles)', () => {
    const password = 'secret_sauce'
    
    usePrompt(
      [
        'visit https://www.saucedemo.com',
        'type "standard_user" in the username field',
        'type {{password}} in the password field',
        'click the login button',
        'verify the inventory container is visible',
      ],
      {
        placeholders: {
          password: password,
        },
      }
    )
  })

  /**
   * EJEMPLO 3: Login con múltiples usuarios usando loops
   * 
   * Puedes usar placeholders en loops para probar múltiples escenarios
   * sin invalidar el cache de la AI.
   */
  it('Ejemplo 3: Probar login con múltiples usuarios', () => {
    const usuarios = [
      { username: 'standard_user', password: 'secret_sauce' },
      { username: 'problem_user', password: 'secret_sauce' },
      { username: 'performance_glitch_user', password: 'secret_sauce' },
    ]

    usuarios.forEach((usuario) => {
      usePrompt(
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

  /**
   * EJEMPLO 4: Estilo Gherkin/BDD con cy.prompt
   * 
   * cy.prompt soporta sintaxis estilo Gherkin (Given/When/Then),
   * haciendo que los tests sean más legibles y accesibles.
   */
  it('Ejemplo 4: Login estilo Gherkin/BDD', () => {
    usePrompt([
      'Given the user is on the login page',
      'When the user enters "standard_user" in the username field',
      'And the user enters "secret_sauce" in the password field',
      'And the user clicks the login button',
      'Then the user should be redirected to the inventory page',
      'And the inventory container should be visible',
    ])
  })

  /**
   * EJEMPLO 5: Validación de errores con cy.prompt
   * 
   * Puedes usar cy.prompt para validar mensajes de error
   * y comportamientos negativos.
   */
  it('Ejemplo 5: Validar error de usuario bloqueado', () => {
    usePrompt([
      'visit https://www.saucedemo.com',
      'type "locked_out_user" in the username field',
      'type "secret_sauce" in the password field',
      'click the login button',
      'verify the error message contains "locked out"',
      'verify we are still on the login page',
    ])
  })

  /**
   * EJEMPLO 6: Flujo completo de e-commerce con cy.prompt
   * 
   * Ejemplo más complejo mostrando un flujo completo de compra.
   */
  it('Ejemplo 6: Flujo completo - Login y agregar producto al carrito', () => {
    usePrompt([
      'visit https://www.saucedemo.com',
      'type "standard_user" in the username field',
      'type "secret_sauce" in the password field',
      'click the login button',
      'verify the inventory page loads',
      'click the "Add to cart" button for the first product',
      'verify the cart icon shows 1 item',
      'click the cart icon',
      'verify the cart page is displayed',
      'verify the product is in the cart',
    ])
  })

  /**
   * EJEMPLO 7: Mezclando cy.prompt con comandos tradicionales de Cypress
   * 
   * Puedes combinar cy.prompt con comandos tradicionales de Cypress
   * para mayor flexibilidad.
   * 
   * NOTA: Este ejemplo requiere Cypress v15.4.0+ con experimentalPromptCommand: true
   * Si no tienes esa versión, el test usará comandos tradicionales como fallback.
   */
  it('Ejemplo 7: Combinando cy.prompt con comandos tradicionales', () => {
    // Usar comandos tradicionales para setup
    cy.visit('https://www.saucedemo.com')
    cy.get('body').should('be.visible')
    
    // Intentar usar cy.prompt para el flujo principal
    // Si cy.prompt oficial no está disponible, usar comandos tradicionales
    const cypressVersion = Cypress.version
    const majorVersion = parseInt(cypressVersion.split('.')[0])
    const minorVersion = parseInt(cypressVersion.split('.')[1])
    
    if (majorVersion >= 15 && minorVersion >= 4) {
      // Usar cy.prompt oficial (requiere Cypress Cloud login)
      cy.prompt([
        'type "standard_user" in the username field',
        'type "secret_sauce" in the password field',
        'click the login button',
        'verify the inventory container is visible',
      ])
    } else {
      // Fallback: usar comandos tradicionales si cy.prompt no está disponible
      cy.log('⚠️ Cypress < v15.4.0 detectado. Usando comandos tradicionales como fallback.')
      cy.get('#user-name').type('standard_user')
      cy.get('#password').type('secret_sauce')
      cy.get('#login-button').click()
      cy.get('.inventory_container').should('be.visible')
    }
    
    // Usar comandos tradicionales para validaciones específicas
    cy.url().should('include', '/inventory.html')
    cy.get('.inventory_item').should('have.length.greaterThan', 0)
  })
})

describe('🎓 Demo: cy.prompt() - Mejores prácticas', () => {
  
  /**
   * BUENA PRÁCTICA 1: Steps claros y descriptivos
   * 
   * ✅ OK: Steps específicos con contexto
   * ❌ ERRONEO: Steps ambiguos y sin contexto
   */
  it('Buena práctica 1: Steps claros y descriptivos', () => {
    usePrompt([
      // ✅ OK: Específico y claro
      'visit https://www.saucedemo.com',
      'type "standard_user" in the username field',
      'type "secret_sauce" in the password field',
      'click the "Login" button',
      'verify the "Products" heading is visible',
      
      // Comparar con esto (❌ ERRONEO):
      // 'go to site',
      // 'enter user',
      // 'click button',
      // 'check page',
    ])
  })

  /**
   * BUENA PRÁCTICA 2: Un paso = una acción
   * 
   * ✅ OK: Una acción por paso
   * ❌ ERRONEO: Múltiples acciones en un paso
   */
  it('Buena práctica 2: Un paso = una acción', () => {
    usePrompt([
      // ✅ OK: Una acción por paso
      'visit https://www.saucedemo.com',
      'type "standard_user" in the username field',
      'type "secret_sauce" in the password field',
      'click the login button',
      
      // Comparar con esto (❌ ERRONEO):
      // 'visit site and login with standard_user and secret_sauce',
    ])
  })

  /**
   * BUENA PRÁCTICA 3: Usar comillas para valores específicos
   * 
   * ✅ OK: Valores específicos entre comillas
   * ❌ ERRONEO: Valores sin comillas (pueden ser ambiguos)
   */
  it('Buena práctica 3: Usar comillas para valores específicos', () => {
    usePrompt([
      // ✅ OK: Valores específicos entre comillas
      'visit https://www.saucedemo.com',
      'type "standard_user" in the username field',
      'type "secret_sauce" in the password field',
      'click the "Login" button',
      'verify the "Products" heading is visible',
      
      // Comparar con esto (❌ ERRONEO):
      // 'click Login button',
      // 'verify Products heading',
    ])
  })

  /**
   * BUENA PRÁCTICA 4: Usar placeholders para datos dinámicos
   * 
   * Los placeholders mejoran el cache y mantienen los datos seguros.
   */
  it('Buena práctica 4: Usar placeholders para datos dinámicos', () => {
    const usuarios = ['standard_user', 'problem_user', 'performance_glitch_user']
    
    usuarios.forEach((usuario) => {
      usePrompt(
        [
          'visit https://www.saucedemo.com',
          `type "{{username}}" in the username field`,
          `type "secret_sauce" in the password field`,
          'click the login button',
          'verify the inventory page loads',
        ],
        {
          placeholders: {
            username: usuario,
          },
        }
      )
    })
  })
})

