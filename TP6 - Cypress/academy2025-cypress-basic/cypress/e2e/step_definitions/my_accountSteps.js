import { Given, When, Then, And } from "@badeball/cypress-cucumber-preprocessor";
// Importar page objects existentes según necesidad
// import MyAccountLoginPage from '../../pages/generated/my_account_loginPage';
// import MyAccountRegistrationPage from '../../pages/generated/my_account_registrationPage';

// Given("Navego al sitio automationtesting", () => {
//     cy.log('🌐 Navegando al sitio de pruebas...');
//     cy.visit('/my-account/', { failOnStatusCode: false });
// });

Then("Verifico que inicio sesión exitosamente", () => {
    cy.log('✅ Verificando inicio de sesión exitoso');
    cy.get('.woocommerce-MyAccount-content')
        .should('be.visible')
        .and('contain.text', 'Hello');
});

When("Hago click en el menú My Account", () => {
    cy.log('🔍 Ejecutando: Hago click en el menú My Account');
    cy.get('#menu-item-50').click();
});

When("Ingreso el usuario registrado en el campo username", () => {
    cy.log('🔍 Ejecutando: Ingreso el usuario registrado en el campo username');
    cy.get('#username').type('usuario_registrado');
});

When("Ingreso la contraseña en el campo password", () => {
    cy.log('🔍 Ejecutando: Ingreso la contraseña en el campo password');
    cy.get('#password').type('contraseña_segura');
});

When("Hago click en el botón de login", () => {
    cy.log('🔍 Ejecutando: Hago click en el botón de login');
    cy.get('button[name="login"]').click();
});

When("Hago click en el enlace My Account", () => {
    cy.log('🔍 Ejecutando: Hago click en el enlace My Account');
    cy.get('.woocommerce-MyAccount-navigation-link--dashboard a').click();
});

Then("Verifico que puedo ver el Dashboard", () => {
    cy.log('🔍 Ejecutando: Verifico que puedo ver el Dashboard');
    cy.get('.woocommerce-MyAccount-content').should('be.visible');
});

When("Hago click en el enlace Orders", () => {
    cy.log('🔍 Ejecutando: Hago click en el enlace Orders');
    cy.get('.woocommerce-MyAccount-navigation-link--orders a').click();
});

Then("Verifico que puedo ver mis pedidos", () => {
    cy.log('🔍 Ejecutando: Verifico que puedo ver mis pedidos');
    cy.get('.woocommerce-order-details').should('be.visible');
});

When("Hago click en el botón View", () => {
    cy.log('🔍 Ejecutando: Hago click en el botón View');
    cy.get('.woocommerce-orders-table__cell-order-actions .button.view').first().click();
});

Then("Verifico que puedo ver los detalles del pedido, cliente y facturación", () => {
    cy.log('🔍 Ejecutando: Verifico que puedo ver los detalles del pedido, cliente y facturación');
    cy.get('.woocommerce-order-details').should('be.visible'); 
    cy.get('.woocommerce-customer-details').should('be.visible');
});

Then("Verifico que puedo ver el número de pedido, fecha y estado", () => {
    cy.log('🔍 Ejecutando: Verifico que puedo ver el número de pedido, fecha y estado');
    cy.get('.order-number').should('be.visible'); 
    cy.get('.order-date').should('be.visible');
});

When("Hago click en el enlace Address", () => {
    cy.log('🔍 Ejecutando: Hago click en el enlace Address');
    cy.get('.woocommerce-MyAccount-navigation-link--edit-address a').click();
});

Then("Verifico que puedo ver las direcciones de facturación y envío", () => {
    cy.log('🔍 Ejecutando: Verifico que puedo ver las direcciones de facturación y envío');
    cy.get('.woocommerce-address-fields').should('be.visible');
});

When("Hago click en Editar dirección de envío", () => {
    cy.log('🔍 Ejecutando: Hago click en Editar dirección de envío');
    cy.get('.edit-shipping').click();
});

Then("Verifico que puedo editar la dirección de envío", () => {
    cy.log('🔍 Ejecutando: Verifico que puedo editar la dirección de envío');
    cy.get('.shipping_address').should('be.visible');
});

When("Hago click en Account Details", () => {
    cy.log('🔍 Ejecutando: Hago click en Account Details');
    cy.get('.woocommerce-MyAccount-navigation-link--edit-account a').click();
});

Then("Verifico que puedo ver y cambiar los detalles de la cuenta", () => {
    cy.log('🔍 Ejecutando: Verifico que puedo ver y cambiar los detalles de la cuenta');
    cy.get('.woocommerce-MyAccount-content').should('be.visible');
});

When("Hago click en el botón Logout", () => {
    cy.log('🔍 Ejecutando: Hago click en el botón Logout');
    cy.get('.woocommerce-MyAccount-navigation-link--customer-logout a').click();
});

Then("Verifico que salí exitosamente del sitio", () => {
    cy.log('🔍 Ejecutando: Verifico que salí exitosamente del sitio');
    cy.url().should('not.contain', 'my-account');
});

// Steps específicos generados a partir del feature
// No se encontraron steps para generar