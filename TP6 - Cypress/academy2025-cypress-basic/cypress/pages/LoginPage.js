Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
});
/// <reference types="cypress" />
import LoginLocators from './locators/LoginLocators.json'

class LoginPage{

    visitarPagina = () => { 
        cy.visit('/');
    };

    doLoginAdmin = (json) => { //realiza el login en la aplicacion de acuerdo a los datos cargados en el archivo "LoginAdminExample.json"
    cy.get(LoginLocators.inpUsernameLogin).type(json.username);
    cy.get(LoginLocators.inpPassLogin).type(json.pass);
    cy.get(LoginLocators.btnIniciarSesionLogin).click();
};
    doLogin = (json) => { //realiza el login en la aplicacion de acuerdo a los datos cargados en el archivo "LoginExample.json"
    cy.get(LoginLocators.inpUsernameLogin).type(json.username);
    cy.get(LoginLocators.inpPassLogin).type(json.pass);
    cy.get(LoginLocators.btnIniciarSesionLogin).click();
};
    doLoginScenarioOutline = (user,pass) => { //realiza el login en la aplicacion de acuerdo a los datos cargados en el escenario Outline, parametrizando así variables
    cy.get(LoginLocators.inpUsernameLogin).type(user);
    cy.get(LoginLocators.inpPassLogin).type(pass);
    cy.get(LoginLocators.btnIniciarSesionLogin).click();
};
}

export default new LoginPage(); 
