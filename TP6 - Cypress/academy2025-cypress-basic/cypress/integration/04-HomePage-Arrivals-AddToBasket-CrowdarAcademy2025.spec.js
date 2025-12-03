// NativeExecutionRunner-CrowdarAcademy2023-HomePage-Arrivals-AddToBasket.spec created with Cypress
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

      // 4) Test whether the Home page has Three Arrivals only
      cy.get('.products').find('.product').should('have.length', 3);

      // 6) Now click the image in the Arrivals
      cy.get('.products').contains('h3', 'Mastering JavaScript').parents('.product').find('.woocommerce-LoopProduct-link').click();

      // 7) Test whether it is navigating to next page where the user can add that book into his basket.
      cy.url().should('include', 'product/mastering-javascript/');
      cy.get('.single_add_to_cart_button').should('be.visible');

      // 8) Image should be clickable and should navigate to next page where user can add that book to his basket
      cy.contains('Add to basket').click();

      // 9) Click on the Add To Basket button which adds that book to your basket
      cy.get('.woocommerce-message').should('contain.text', 'has been added to your basket.');

    });
  });
  