/**
 * Page Object Model para la página de Test Cases
 * Implementa métodos para verificar las diferentes secciones de casos de prueba
 */

import TestCasesLocators from './locators/TestCasesLocators.json';

class TestCasesPage {
    // Navegación básica
    visitarPaginaTestCases() {
        cy.visit('/test-cases/');
        
        // Esperar a que la página cargue completamente y las animaciones terminen
        cy.wait(2000); // Esperar a que las animaciones CSS terminen
        
        // Verificar que al menos un h2 sea visible (puede haber múltiples h2 en la página)
        cy.get('h2').should('exist');
        
        // Verificar que el contenedor principal esté visible
        cy.get(TestCasesLocators.contenedorPrincipal, { timeout: 10000 })
          .should('be.visible');
          
        // Verificar que existan secciones de acordeón
        cy.get(TestCasesLocators.seccionesAcordeon, { timeout: 10000 })
          .should('exist')
          .and('be.visible');
    }

    extraerInformacionCasos() {
        const casosExtraidos = {};
        const secciones = {
            'Home Page': TestCasesLocators.seccionHomePage,
            'MY ACCOUNT - LOGIN': TestCasesLocators.seccionLogin,
            'SHOP': TestCasesLocators.seccionShop,
            'MY ACCOUNT - REGISTRATION': TestCasesLocators.seccionRegistro
        };

        // Esperar a que la página esté completamente cargada usando un selector más confiable
        return cy.get(TestCasesLocators.seccionesAcordeon, { timeout: 10000 })
            .should('exist')
            .and('be.visible')
            .then(() => {
                // Procesar cada sección secuencialmente
                return Object.entries(secciones).reduce((promise, [nombreSeccion, selector]) => {
                    return promise.then(() => {
                        cy.log(`📑 Procesando sección: "${nombreSeccion}" con selector: ${selector}`);
                        casosExtraidos[nombreSeccion] = [];

                        return cy.get(selector).then($seccion => {
                            if ($seccion.length === 0) {
                                cy.log(`⚠️ No se encontró la sección: ${nombreSeccion}`);
                                return;
                            }

                            // Expandir la sección si está cerrada
                            return cy.wrap($seccion)
                                .find(TestCasesLocators.btnExpandirSeccion)
                                .first()
                                .click()
                                .wait(500) // Esperar a que se expanda
                                .then(() => {
                                    return cy.wrap($seccion)
                                        .find(TestCasesLocators.listaCasos)
                                        .each(($caso, index) => {
                                            const titulo = $caso.find(TestCasesLocators.tituloCaso).text().trim();
                                            const contenido = $caso.find(TestCasesLocators.contenidoCaso).text().trim();
                                            
                                            if (titulo && contenido) {
                                                cy.log(`  📌 Caso ${index + 1}: "${titulo}"`);
                                                
                                                const pasos = contenido
                                                    .split('\n')
                                                    .map(paso => paso.trim())
                                                    .filter(paso => paso.length > 0);
                                                
                                                casosExtraidos[nombreSeccion].push({
                                                    titulo,
                                                    pasos
                                                });
                                            } else {
                                                cy.log(`  ⚠️ Caso ${index + 1} ignorado - título: "${titulo}", contenido: ${contenido ? 'presente' : 'ausente'}`);
                                            }
                                        });
                                });
                        });
                    });
                }, cy.wrap(null))
                .then(() => {
                    cy.log('📊 Resumen de extracción:');
                    Object.keys(casosExtraidos).forEach(seccion => {
                        cy.log(`  - ${seccion}: ${casosExtraidos[seccion].length} casos`);
                    });
                    
                    cy.log('💾 Guardando información en casos_prueba.json');
                    return cy.writeFile('cypress/fixtures/casos_prueba.json', casosExtraidos);
                })
                .then(() => {
                    cy.log('✅ Información guardada exitosamente');
                    return cy.wrap(casosExtraidos);
                });
            });
    }

    // Métodos de interacción con secciones
    expandirSeccion(nombreSeccion) {
        let selector;
        switch(nombreSeccion) {
            case 'Home Page':
                selector = TestCasesLocators.seccionHomePage;
                break;
            case 'MY ACCOUNT - LOGIN':
                selector = TestCasesLocators.seccionLogin;
                break;
            case 'SHOP':
                selector = TestCasesLocators.seccionShop;
                break;
            case 'MY ACCOUNT - REGISTRATION':
                selector = TestCasesLocators.seccionRegistro;
                break;
            default:
                throw new Error(`Sección no reconocida: ${nombreSeccion}`);
        }

        cy.get(selector)
            .find(TestCasesLocators.btnExpandirSeccion)
            .first()
            .click();
    }

    // Métodos de verificación
    verificarCantidadCasos(cantidad) {
        cy.get(TestCasesLocators.seccionHomePage)
            .find(TestCasesLocators.listaCasos)
            .should('have.length', cantidad);
    }

    verificarCantidadCasosLogin(cantidad) {
        cy.get(TestCasesLocators.seccionLogin)
            .find(TestCasesLocators.listaCasos)
            .should('have.length', cantidad);
    }

    verificarCantidadCasosShop(cantidad) {
        cy.get(TestCasesLocators.seccionShop)
            .find(TestCasesLocators.listaCasos)
            .should('have.length', cantidad);
    }

    verificarCantidadCasosRegistro(cantidad) {
        cy.get(TestCasesLocators.seccionRegistro)
            .find(TestCasesLocators.listaCasos)
            .should('have.length', cantidad);
    }

    verificarTituloPrimerCaso(titulo) {
        cy.get(TestCasesLocators.seccionHomePage)
            .find(TestCasesLocators.tituloCaso)
            .first()
            .should('contain.text', titulo);
    }

    verificarExistenciaCaso(caso) {
        cy.get(TestCasesLocators.seccionesAcordeon)
            .find(TestCasesLocators.tituloCaso)
            .should('contain.text', caso);
    }

    // Métodos de utilidad
    obtenerContenidoCaso(seccion, numeroCaso) {
        return cy.get(seccion)
            .find(TestCasesLocators.listaCasos)
            .eq(numeroCaso - 1)
            .find(TestCasesLocators.contenidoCaso);
    }
}

export default new TestCasesPage();