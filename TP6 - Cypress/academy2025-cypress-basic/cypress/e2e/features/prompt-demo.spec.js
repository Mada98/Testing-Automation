
// Helper para usar cy.prompt con fallback automático
function usePrompt(steps, options = {}) {
  // Siempre usar promptWithFallback que maneja la detección internamente
  return cy.promptWithFallback(steps, options);
}

describe('🎓 Demo: cy.prompt() - Lenguaje natural', () => {
  

  /**
   * EJEMPLO: Flujo de e-commerce con cy.prompt
   * 
   * Ejemplo extendido flujo completo de compra.
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
})


