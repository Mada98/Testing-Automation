/**
 * 🎓 DEMO DE CLASE: Step Definitions usando cy.promptWithFallback()
 * 
 * Estos step definitions muestran cómo integrar cy.promptWithFallback()
 * con Cucumber/Gherkin para hacer los tests más accesibles.
 * 
 * NOTA: cy.promptWithFallback() usa el comando oficial cy.prompt() si está disponible,
 * o un fallback con comandos tradicionales de Cypress si no lo está.
 * 
 * VENTAJAS:
 * - No se necesita escribir código manualmente
 * - Los tests son más legibles para no-programadores
 * - cy.prompt se auto-repara cuando la UI cambia (si estuviese disponible, sino prosigue vía fallback)
 */

import { Given, When, Then, And } from "@badeball/cypress-cucumber-preprocessor";

/**
 * Step usando cy.prompt para login con usuario específico
 * 
 * Ejemplo de uso en Gherkin:
 *   When Me logueo usando cy.prompt con usuario "standard_user"
 */
When("Me logueo usando cy.prompt con usuario {string}", (username) => {
  cy.promptWithFallback(
    [
      'visit https://www.saucedemo.com',
      `type "${username}" in the username field`,
      'type "secret_sauce" in the password field',
      'click the login button',
      'verify we are redirected to the inventory page',
    ]
  )
})

/**
 * Step usando cy.prompt con placeholders para datos sensibles
 * 
 * Ejemplo de uso en Gherkin:
 *   When Me logueo usando cy.prompt con usuario "standard_user" y contraseña "secret_sauce"
 */
When("Me logueo usando cy.prompt con usuario {string} y contraseña {string}", (username, password) => {
  cy.promptWithFallback(
    [
      'visit https://www.saucedemo.com',
      `type "{{username}}" in the username field`,
      `type "{{password}}" in the password field`,
      'click the login button',
      'verify the inventory container is visible',
    ],
    {
      placeholders: {
        username: username,
        password: password,
      },
    }
  )
})

/**
 * Step usando cy.prompt estilo Gherkin completo
 * 
 * Ejemplo de uso en Gherkin:
 *   Given Estoy en la página de login usando cy.prompt
 *   When Ingreso credenciales usando cy.prompt
 *   Then Valido login exitoso usando cy.prompt
 */
Given("Estoy en la página de login usando cy.prompt", () => {
  cy.promptWithFallback([
    'visit https://www.saucedemo.com',
    'verify the login form is visible',
  ])
})

When("Ingreso credenciales usando cy.prompt", () => {
  cy.promptWithFallback([
    'type "standard_user" in the username field',
    'type "secret_sauce" in the password field',
    'click the login button',
  ])
})

Then("Valido login exitoso usando cy.prompt", () => {
  cy.promptWithFallback([
    'verify we are redirected to the inventory page',
    'verify the inventory container is visible',
    'verify the "Products" heading is displayed',
  ])
})

/**
 * Step para validar errores usando cy.prompt
 * 
 * Ejemplo de uso en Gherkin:
 *   When Intento loguearme con usuario bloqueado usando cy.prompt
 *   Then Valido mensaje de error usando cy.prompt
 */
When("Intento loguearme con usuario bloqueado usando cy.prompt", () => {
  cy.promptWithFallback([
    'visit https://www.saucedemo.com',
    'type "locked_out_user" in the username field',
    'type "secret_sauce" in the password field',
    'click the login button',
  ])
})

Then("Valido mensaje de error usando cy.prompt", () => {
  cy.promptWithFallback([
    'verify the error message contains "locked out"',
    'verify we are still on the login page',
  ])
})

/**
 * Step para flujo completo de e-commerce usando cy.prompt
 * 
 * Ejemplo de uso en Gherkin:
 *   When Agrego producto al carrito usando cy.prompt
 *   Then Valido producto en carrito usando cy.prompt
 */
When("Agrego producto al carrito usando cy.prompt", () => {
  cy.promptWithFallback([
    'click the "Add to cart" button for the first product',
    'verify the cart icon shows 1 item',
  ])
})

Then("Valido producto en carrito usando cy.prompt", () => {
  cy.promptWithFallback([
    'click the cart icon',
    'verify the cart page is displayed',
    'verify the product is in the cart',
  ])
})

