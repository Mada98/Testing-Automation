Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
});
/// <reference types="cypress" />
import HomeLocators from './locators/HomeLocators.json'

class HomePage{
    verificarHome = () => {
        // Validar que estamos en la página de inventario de SauceDemo
        cy.url().should('include', '/inventory.html');
        cy.get('.inventory_container').should('be.visible');
        // Validar que hay productos disponibles
        cy.get('.inventory_item').should('have.length.greaterThan', 0);
    }

}

export default new HomePage();