import {Given, Then, When, And} from "@badeball/cypress-cucumber-preprocessor"
import LoginPage from '@pages/LoginPage'
import HomePage from '@pages/HomePage'



Given("Me logueo como usuario correctamente", () => {
    cy.fixture('examples/LoginExample.json').then((json) => {
        cy.visit("/");
        //LoginPage.visitarPagina();
        LoginPage.doLogin(json);
    });
});


When("Me logueo como usuario con user {string} y pass {string}", (user,pass) => {
    LoginPage.doLoginScenarioOutline(user,pass);
})

Then("Valido saludo de bienvenida en el Título", () => {
    HomePage.verificarHome();     
})


