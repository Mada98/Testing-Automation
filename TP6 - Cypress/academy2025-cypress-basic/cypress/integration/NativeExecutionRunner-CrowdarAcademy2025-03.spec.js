// NativeExecutionRunner-CrowdarAcademy2023-03.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test
/* ==== Test Created with Cypress Studio ==== */
it('Login-PayDelivery-Checkout', function() {
  /* ==== Generated with Cypress Studio ==== */
  cy.visit('https://practice.automationtesting.in//');
  cy.get('#menu-item-50 > a').click();
  cy.get('#username').clear();
  cy.get('#username').type('academyCypress_usuarioNormal@crowdaronline.com');
  cy.get('#password').clear();
  cy.get('#password').type('Crowdar.2025!');
  cy.get(':nth-child(3) > .woocommerce-Button').click();
  cy.get('#site-logo > a > img').click();
  cy.get('.post-160 > .button').click();
  cy.get('.post-163 > .button').click();
  cy.get('.post-165 > .button').click();
  cy.get('.wpmenucart-contents > .amount').click();
  cy.get('.checkout-button').click();
  cy.get('#place_order').click({force: true});
  /* ==== End Cypress Studio ==== */
});
