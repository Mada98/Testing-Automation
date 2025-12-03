import { Given, When, Then, And } from "@badeball/cypress-cucumber-preprocessor";
import TestCasesPage from '@pages/TestCasesPage';

Given("Navego a la página de Test Cases", () => {
    cy.log('🌐 Navegando a la página de Test Cases...');
    TestCasesPage.visitarPaginaTestCases();
});

When("Expando la sección {string}", (seccion) => {
    cy.log(`📂 Expandiendo sección: ${seccion}`);
    TestCasesPage.expandirSeccion(seccion);
});

Then("Verifico que existan {int} casos de prueba", (cantidad) => {
    cy.log(`🔍 Verificando ${cantidad} casos de prueba...`);
    TestCasesPage.verificarCantidadCasos(cantidad);
});

Then("Verifico que existan {int} casos de prueba de login", (cantidad) => {
    cy.log(`🔍 Verificando ${cantidad} casos de prueba de login...`);
    TestCasesPage.verificarCantidadCasosLogin(cantidad);
});

Then("Verifico que existan {int} casos de prueba de shop", (cantidad) => {
    cy.log(`🔍 Verificando ${cantidad} casos de prueba de shop...`);
    TestCasesPage.verificarCantidadCasosShop(cantidad);
});

Then("Verifico que existan {int} casos de prueba de registro", (cantidad) => {
    cy.log(`🔍 Verificando ${cantidad} casos de prueba de registro...`);
    TestCasesPage.verificarCantidadCasosRegistro(cantidad);
});

Then("Verifico que el primer caso sea {string}", (titulo) => {
    cy.log(`✅ Verificando título del primer caso: ${titulo}`);
    TestCasesPage.verificarTituloPrimerCaso(titulo);
});

Then("Verifico que incluya pruebas de {string}", (caso) => {
    cy.log(`✅ Verificando existencia del caso: ${caso}`);
    TestCasesPage.verificarExistenciaCaso(caso);
});

Then("Verifico que incluya {string}", (caso) => {
    cy.log(`✅ Verificando existencia del caso: ${caso}`);
    TestCasesPage.verificarExistenciaCaso(caso);
});

Then("Verifico que incluya validación de {string}", (caso) => {
    cy.log(`✅ Verificando existencia del caso: ${caso}`);
    TestCasesPage.verificarExistenciaCaso(caso);
});

When("Extraigo toda la información de casos de prueba", () => {
    cy.log('📥 Extrayendo información de todos los casos de prueba...');
    
    cy.wrap(null).then(() => {
        return TestCasesPage.extraerInformacionCasos();
    }).then((casos) => {
        cy.log('✅ Información extraída y guardada en casos_prueba.json');
        cy.log(`📊 Se encontraron ${Object.keys(casos).length} secciones`);
        Object.keys(casos).forEach(seccion => {
            cy.log(`   - ${seccion}: ${casos[seccion].length} casos`);
        });
    });
}); 