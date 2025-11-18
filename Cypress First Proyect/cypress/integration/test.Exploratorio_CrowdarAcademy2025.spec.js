// NativeExecutionRunner-CrowdarAcademy2023-Sliders.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
});


it('Add_to_basket_slide_menudrawer_myaccount', function() {
  cy.visit('https://practice.automationtesting.in/');
  // cy.get('.post-160 > .button').click();
  // cy.get('.post-163 > .button').click();
  // cy.get('.post-165 > .button').click();
  cy.get('#n2-ss-6-arrow-next > .n2-ow').click();
  cy.get('#n2-ss-6-arrow-next > .n2-ow').click();
  cy.get('#n2-ss-6-arrow-next > .n2-ow').click();
  cy.get('#menu-icon').click();
  cy.get('#menu-item-50 > a').click();
});