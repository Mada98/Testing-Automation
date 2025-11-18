/**
 * Page Object Model para SauceDemo
 * Implementa métodos para:
 * - Login
 * - Gestión de productos
 * - Gestión del carrito
 * - Checkout
 * - Logout
 */

Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

import SauceDemoLocators from './locators/SauceDemoLocators.json';

class SauceDemoPage {
  
  // ============================================================================
  // MÉTODOS DE LOGIN
  // ============================================================================
  
  visitarPagina() {
    cy.visit('/');
  }

  realizarLogin(username, password) {
    cy.get(SauceDemoLocators.inputUsername).type(username);
    cy.get(SauceDemoLocators.inputPassword).type(password);
    cy.get(SauceDemoLocators.btnLogin).click();
  }

  verificarLoginExitoso() {
    cy.url().should('include', '/inventory.html');
    cy.get(SauceDemoLocators.inventoryContainer).should('be.visible');
    cy.get(SauceDemoLocators.inventoryItem).should('have.length.greaterThan', 0);
  }

  // ============================================================================
  // MÉTODOS DE PRODUCTOS
  // ============================================================================

  verificarProductosVisibles() {
    cy.get(SauceDemoLocators.inventoryItem).should('have.length.greaterThan', 0);
    cy.get(SauceDemoLocators.inventoryItemName).should('have.length.greaterThan', 0);
  }

  agregarProductoAlCarritoPorIndice(indice) {
    cy.get(SauceDemoLocators.inventoryItem).eq(indice).within(() => {
      cy.get(SauceDemoLocators.btnInventory).should('contain.text', 'Add to cart').click();
    });
  }

  agregarPrimerProductoAlCarrito() {
    this.agregarProductoAlCarritoPorIndice(0);
  }

  agregarSegundoProductoAlCarrito() {
    this.agregarProductoAlCarritoPorIndice(1);
  }

  verificarBotonCambioARemove(indice) {
    cy.get(SauceDemoLocators.inventoryItem).eq(indice).within(() => {
      cy.get(SauceDemoLocators.btnInventory).should('contain.text', 'Remove');
    });
  }

  verificarContadorCarrito(cantidad) {
    cy.get(SauceDemoLocators.shoppingCartBadge)
      .should('be.visible')
      .and('contain', cantidad.toString());
  }

  // ============================================================================
  // MÉTODOS DE FILTRADO
  // ============================================================================

  verificarFiltroVisible() {
    cy.get(SauceDemoLocators.productSortContainer).should('be.visible');
  }

  filtrarPorNombreAZ() {
    cy.get(SauceDemoLocators.productSortContainer).select('az');
    cy.wait(500);
  }

  filtrarPorPrecioLowToHigh() {
    cy.get(SauceDemoLocators.productSortContainer).select('lohi');
    cy.wait(500);
  }

  verificarProductosOrdenadosPorPrecio() {
    let prices = [];
    cy.get(SauceDemoLocators.inventoryItemPrice).each(($el) => {
      const priceText = $el.text().replace('$', '');
      prices.push(parseFloat(priceText));
    }).then(() => {
      for (let i = 0; i < prices.length - 1; i++) {
        expect(prices[i]).to.be.at.most(prices[i + 1]);
      }
    });
  }

  // ============================================================================
  // MÉTODOS DEL CARRITO
  // ============================================================================

  irAlCarrito() {
    cy.get(SauceDemoLocators.shoppingCartLink).click();
  }

  verificarPaginaCarrito() {
    cy.url().should('include', '/cart.html');
  }

  verificarProductosEnCarrito(cantidad) {
    cy.get(SauceDemoLocators.cartItem).should('have.length', cantidad);
    cy.get(SauceDemoLocators.inventoryItemName).should('have.length', cantidad);
  }

  verificarBotonesCarrito() {
    cy.get(SauceDemoLocators.btnContinueShopping).should('be.visible');
    cy.get(SauceDemoLocators.btnCheckout).should('be.visible');
  }

  eliminarProductoDelCarritoPorIndice(indice) {
    cy.get(SauceDemoLocators.cartItem).eq(indice).within(() => {
      cy.get(SauceDemoLocators.cartButton).click();
    });
  }

  eliminarPrimerProductoDelCarrito() {
    this.eliminarProductoDelCarritoPorIndice(0);
  }

  verificarCarritoVacio() {
    cy.get(SauceDemoLocators.cartItem).should('not.exist');
  }

  continuarComprando() {
    cy.get(SauceDemoLocators.btnContinueShopping).click();
    cy.url().should('include', '/inventory.html');
  }

  // ============================================================================
  // MÉTODOS DE CHECKOUT
  // ============================================================================

  iniciarCheckout() {
    cy.get(SauceDemoLocators.btnCheckout).click();
    cy.url().should('include', '/checkout-step-one.html');
  }

  completarInformacionCheckout(firstName, lastName, postalCode) {
    cy.get(SauceDemoLocators.inputFirstName).type(firstName);
    cy.get(SauceDemoLocators.inputLastName).type(lastName);
    cy.get(SauceDemoLocators.inputPostalCode).type(postalCode);
    cy.get(SauceDemoLocators.btnContinue).click();
  }

  verificarPaginaResumen() {
    cy.url().should('include', '/checkout-step-two.html');
    cy.get(SauceDemoLocators.cartItem).should('have.length', 1);
    cy.get(SauceDemoLocators.summaryInfo).should('be.visible');
  }

  completarCompra() {
    cy.get(SauceDemoLocators.btnFinish).click();
  }

  verificarConfirmacionCompra() {
    cy.url().should('include', '/checkout-complete.html');
    cy.get(SauceDemoLocators.completeHeader).should('contain', 'Thank you for your order!');
    cy.get(SauceDemoLocators.btnBackToProducts).should('be.visible');
  }

  volverAProductos() {
    cy.get(SauceDemoLocators.btnBackToProducts).click();
  }

  // ============================================================================
  // MÉTODOS DE LOGOUT
  // ============================================================================

  abrirMenu() {
    cy.get(SauceDemoLocators.btnBurgerMenu).click();
    cy.get(SauceDemoLocators.bmMenu).should('be.visible');
  }

  realizarLogout() {
    cy.get(SauceDemoLocators.logoutSidebarLink).click();
  }

  verificarLogoutExitoso() {
    cy.url().should('eq', Cypress.config('baseUrl') + '/');
    cy.get(SauceDemoLocators.inputUsername).should('be.visible');
    cy.get(SauceDemoLocators.inputPassword).should('be.visible');
    cy.get(SauceDemoLocators.btnLogin).should('be.visible');
  }

  // ============================================================================
  // MÉTODOS CON DATA-TEST (para mayor robustez)
  // ============================================================================

  realizarLoginConDataTest(username, password) {
    cy.get(SauceDemoLocators.dataTestUsername).clear().type(username);
    cy.get(SauceDemoLocators.dataTestPassword).clear().type(password);
    cy.get(SauceDemoLocators.dataTestLoginButton).click();
  }

  agregarTodosLosProductosAlCarrito() {
    cy.get(SauceDemoLocators.dataTestAddToCartBackpack).click();
    cy.get(SauceDemoLocators.dataTestAddToCartBoltTShirt).click();
    cy.get(SauceDemoLocators.dataTestAddToCartOnesie).click();
    cy.get(SauceDemoLocators.dataTestAddToCartBikeLight).click();
    cy.get(SauceDemoLocators.dataTestAddToCartFleeceJacket).click();
    cy.get(SauceDemoLocators.dataTestAddToCartRedTShirt).click();
  }

  irAlCarritoConDataTest() {
    cy.get(SauceDemoLocators.dataTestShoppingCartBadge).click();
  }

  iniciarCheckoutConDataTest() {
    cy.get(SauceDemoLocators.dataTestCheckout).click();
  }

  completarInformacionCheckoutConDataTest(firstName, lastName, postalCode) {
    cy.get(SauceDemoLocators.dataTestFirstName).clear().type(firstName);
    cy.get(SauceDemoLocators.dataTestLastName).clear().type(lastName);
    cy.get(SauceDemoLocators.dataTestPostalCode).clear().type(postalCode);
    cy.get(SauceDemoLocators.dataTestContinue).click();
  }

  verificarInformacionPago() {
    cy.get(SauceDemoLocators.dataTestPaymentInfoLabel).should('have.text', 'Payment Information:');
    cy.get(SauceDemoLocators.dataTestShippingInfoLabel).should('have.text', 'Shipping Information:');
  }

  completarCompraConDataTest() {
    cy.get(SauceDemoLocators.dataTestFinish).click();
  }

  verificarConfirmacionCompraConDataTest() {
    cy.get(SauceDemoLocators.dataTestCompleteHeader).should('have.text', 'Thank you for your order!');
    cy.get(SauceDemoLocators.dataTestPonyExpress).should('have.class', 'pony_express');
    cy.get(SauceDemoLocators.dataTestBackToProducts).should('have.text', 'Back Home');
  }

  volverAProductosConDataTest() {
    cy.get(SauceDemoLocators.dataTestBackToProducts).click();
  }
}

export default new SauceDemoPage();

