/* ==== Test Created with Cypress Studio ==== */
it('Exploratorio_AAT2025', function() {
  /* ==== Generated with Cypress Studio ==== */
  cy.visit('https://www.saucedemo.com/');
  cy.get('[data-test="password"]').click();
  cy.get('[data-test="password"]').should('be.visible');
  cy.get('[data-test="username"]').type('standard_user');
  cy.get('[data-test="login-button"]').click();
  cy.get('.login_wrapper-inner').click();
  cy.get('[data-test="password"]').clear();
  cy.get('[data-test="password"]').type('secret_sauce');
  cy.get('[data-test="login-button"]').click();
  cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').should('be.visible');
  cy.get('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').should('be.visible');
  cy.get('[data-test="add-to-cart-sauce-labs-onesie"]').should('be.visible');
  cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').should('be.visible');
  cy.get('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').should('be.visible');
  cy.get('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]').should('be.visible');
  cy.get('#react-burger-menu-btn').click();
  cy.get('[data-test="logout-sidebar-link"]').click();
  /* ==== End Cypress Studio ==== */
});