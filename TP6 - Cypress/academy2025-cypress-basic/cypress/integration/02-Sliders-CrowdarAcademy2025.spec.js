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

describe('Home Page Test', () => {
    it('Should have only three sliders on Home page', () => {
      // 1) Open the browser and enter the URL “http://practice.automationtesting.in/”
      cy.visit('https://practice.automationtesting.in/');
  
      // 2) Click on Shop Menu
      cy.get('#menu-item-40 > a').click();
  
      // 3) Now click on Home menu button
      cy.get('.woocommerce-breadcrumb > a').click();
  
      // 4) Loop through the carousel and check for the three sliders each time
    for (let i = 0; i < 3; i++) {
        cy.get('.n2-ss-slide')
          .should('have.length', 3);
  
        if (i === 2) {
          // We've gone through all three slides
          break;
        }
  
        cy.get('#n2-ss-6-arrow-next > .n2-ow').click();
      }
  
      // 5) The Home page must contain only three sliders

    });
  });
  