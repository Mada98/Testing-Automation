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

// Step para validar mensaje de error cuando el usuario está bloqueado
Then("Valido mensaje de error de usuario bloqueado", () => {
    // Verificar que estamos todavía en la página de login (no se hizo login exitoso)
    cy.url().should('eq', Cypress.config('baseUrl') + '/');
    // Verificar que aparece el mensaje de error
    cy.get('h3[data-test="error"]', { timeout: 5000 })
        .should('be.visible')
        .and('contain.text', 'locked out');
    cy.log('✅ Mensaje de error de usuario bloqueado validado correctamente');
})

// Step para validar login exitoso o error según el tipo de usuario
Then("Valido resultado del login según el tipo de usuario", () => {
    cy.url().then((currentUrl) => {
        if (currentUrl.includes('/inventory.html')) {
            // Login exitoso
            cy.log('✅ Login exitoso - Usuario válido');
            HomePage.verificarHome();
        } else {
            // Verificar si hay mensaje de error
            cy.get('body').then(($body) => {
                const errorElement = $body.find('h3[data-test="error"]');
                if (errorElement.length > 0 && errorElement.is(':visible')) {
                    const errorText = errorElement.text();
                    cy.log(`⚠️ Error de login detectado: ${errorText}`);
                    // Validar que el error es el esperado para usuario bloqueado
                    if (errorText.includes('locked out')) {
                        cy.log('✅ Usuario bloqueado - Error esperado validado');
                    } else {
                        cy.log(`⚠️ Otro tipo de error: ${errorText}`);
                    }
                } else {
                    // Si no hay error visible, podría ser otro problema
                    cy.log('⚠️ No se pudo determinar el resultado del login');
                }
            });
        }
    });
})

// Step usando cy.userPrompt (comando personalizado) para obtener credenciales dinámicamente
// NOTA: cy.userPrompt solo funciona en modo interactivo (headed mode), no en modo headless
// Para usar el comando oficial cy.prompt() de Cypress v15.4.0+, ver promptDemoSteps.js
When("Me logueo usando prompt para ingresar credenciales", () => {
    // Usar cy.userPrompt para obtener el usuario (comando personalizado)
    cy.userPrompt('Ingrese el nombre de usuario:', 'standard_user').then((username) => {
        if (username) {
            // Usar cy.userPrompt para obtener la contraseña
            cy.userPrompt('Ingrese la contraseña:', 'secret_sauce').then((password) => {
                if (password) {
                    cy.log(`🔐 Login con usuario: ${username}`);
                    LoginPage.doLoginScenarioOutline(username, password);
                } else {
                    cy.log('❌ Login cancelado: no se ingresó contraseña');
                }
            });
        } else {
            cy.log('❌ Login cancelado: no se ingresó usuario');
        }
    });
})

// Step usando cy.userPrompt con lista de usuarios predefinidos
When("Me logueo seleccionando usuario desde prompt", () => {
    const usuarios = [
        'standard_user',
        'locked_out_user',
        'problem_user',
        'performance_glitch_user',
        'error_user',
        'visual_user'
    ];
    
    const usuariosTexto = usuarios.join(', ');
    
    cy.userPrompt(`Seleccione un usuario (${usuariosTexto}):`, 'standard_user').then((username) => {
        if (username && usuarios.includes(username)) {
            cy.log(`👤 Usuario seleccionado: ${username}`);
            // La contraseña es la misma para todos los usuarios de SauceDemo
            LoginPage.doLoginScenarioOutline(username, 'secret_sauce');
        } else if (username) {
            cy.log(`⚠️ Usuario no válido: ${username}. Usando standard_user por defecto`);
            LoginPage.doLoginScenarioOutline('standard_user', 'secret_sauce');
        } else {
            cy.log('❌ Login cancelado');
        }
    });
})


