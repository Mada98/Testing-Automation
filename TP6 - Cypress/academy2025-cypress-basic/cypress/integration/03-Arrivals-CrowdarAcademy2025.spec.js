// NativeExecutionRunner-CrowdarAcademy2023-Arrivals.spec.js created with Cypress
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

describe('Home Page Test', () => {
    it('Should have only three Arrivals on Home page', () => {
      // 1) Open the browser and enter the URL “http://practice.automationtesting.in/”
      cy.visit('https://practice.automationtesting.in/');
  
      // 2) Click on Shop Menu
      cy.get('#menu-item-40 > a').click();
  
      // 3) Now click on Home menu button
      cy.get('.woocommerce-breadcrumb > a').click();
  
      // 4) Verify that there are three Arrivals on the Home page
      cy.get('.products > .product')
        .should('have.length', 3);
  
      // 5) The Home page must contain only three Arrivals
    });
  });
  