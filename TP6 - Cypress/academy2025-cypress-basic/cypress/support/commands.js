/**
 * 🚀 CYPRESS COMMANDS - Integración de Scripts de Procesamiento
 * 
 * Comandos que permiten usar los scripts de análisis directamente
 * en los flujos BDD Cucumber para casuística dinámica
 */

// ============================================================================
// COMANDOS DE SCRAPING Y ANÁLISIS
// ============================================================================

/**
 * Comando para mapear elementos de página y generar locators dinámicamente
 */
Cypress.Commands.add('mapPageElements', (options = {}) => {
    const { 
        includeNavigation = true, 
        includeButtons = true, 
        includeInputs = true,
        saveToFile = false 
    } = options;
    
    cy.log('🗺️ Iniciando mapeo dinámico de elementos...');
    
    // Esperar que la página esté cargada
    cy.get('body').should('be.visible');
    cy.wait(1000); // Dar tiempo para que se carguen todos los elementos
    
    cy.window().then((win) => {
        const elements = {
            metadata: {
                url: win.location.href,
                timestamp: new Date().toISOString(),
                totalElements: 0
            },
            navigation: [],
            buttons: [],
            inputs: [],
            links: [],
            containers: []
        };
        
        // Procesar todo en un solo then block para evitar problemas de timing
        return cy.get('body').then($body => {
            
            // Mapear navegación si está habilitado
            if (includeNavigation) {
                const navSelectors = 'nav, .nav, .navbar, .navigation, header, .menu, [role="navigation"]';
                const $navElements = $body.find(navSelectors);
                
                $navElements.each((index, nav) => {
                    const $nav = Cypress.$(nav);
                    if ($nav.is(':visible')) {
                        // Buscar elementos interactivos dentro de la navegación
                        const navItems = $nav.find('a, button, [role="button"], [role="menuitem"]');
                        navItems.each((i, el) => {
                            const $el = Cypress.$(el);
                            const text = $el.text().trim();
                            if (text.length > 0) {
                                const element = {
                                    text: text,
                                    href: $el.attr('href'),
                                    tag: el.tagName.toLowerCase(),
                                    selectors: [
                                        el.id ? `#${el.id}` : null,
                                        el.className ? `.${el.className.split(' ')[0]}` : null,
                                        `${el.tagName.toLowerCase()}:contains('${text}')`
                                    ].filter(Boolean),
                                    isInteractive: true,
                                    position: { x: el.offsetLeft || 0, y: el.offsetTop || 0 }
                                };
                                elements.navigation.push(element);
                            }
                        });
                    }
                });
            }
            
            // Mapear botones si está habilitado
            if (includeButtons) {
                const buttonSelectors = 'button, input[type="button"], input[type="submit"], .btn, [role="button"]';
                const $buttons = $body.find(buttonSelectors);
                
                $buttons.each((index, btn) => {
                    const $btn = Cypress.$(btn);
                    if ($btn.is(':visible')) {
                        const text = $btn.text().trim() || $btn.val() || $btn.attr('value') || '';
                        const element = {
                            text: text,
                            tag: btn.tagName.toLowerCase(),
                            type: $btn.attr('type') || 'button',
                            selectors: [
                                btn.id ? `#${btn.id}` : null,
                                btn.className ? `.${btn.className.split(' ')[0]}` : null,
                                btn.tagName.toLowerCase() + ($btn.attr('type') ? `[type="${$btn.attr('type')}"]` : '')
                            ].filter(Boolean),
                            isInteractive: true
                        };
                        elements.buttons.push(element);
                    }
                });
            }
            
            // Mapear inputs si está habilitado
            if (includeInputs) {
                const inputSelectors = 'input:not([type="button"]):not([type="submit"]), textarea, select';
                const $inputs = $body.find(inputSelectors);
                
                $inputs.each((index, input) => {
                    const $input = Cypress.$(input);
                    if ($input.is(':visible')) {
                        const element = {
                            name: $input.attr('name') || '',
                            type: $input.attr('type') || 'text',
                            placeholder: $input.attr('placeholder') || '',
                            tag: input.tagName.toLowerCase(),
                            selectors: [
                                input.id ? `#${input.id}` : null,
                                input.name ? `[name="${input.name}"]` : null,
                                input.className ? `.${input.className.split(' ')[0]}` : null
                            ].filter(Boolean),
                            isInteractive: true
                        };
                        elements.inputs.push(element);
                    }
                });
            }
            
            // También mapear enlaces adicionales
            const $links = $body.find('a[href]');
            $links.each((index, link) => {
                const $link = Cypress.$(link);
                if ($link.is(':visible')) {
                    const text = $link.text().trim();
                    if (text.length > 0 && text.length < 100) {
                        const element = {
                            text: text,
                            href: $link.attr('href'),
                            tag: 'a',
                            selectors: [
                                link.id ? `#${link.id}` : null,
                                link.className ? `.${link.className.split(' ')[0]}` : null,
                                `a:contains('${text}')`
                            ].filter(Boolean),
                            isInteractive: true
                        };
                        elements.links.push(element);
                    }
                }
            });
            
            // Calcular total
            elements.metadata.totalElements = 
                elements.navigation.length + 
                elements.buttons.length + 
                elements.inputs.length + 
                elements.links.length;
            
            // Guardar en alias para uso posterior
            cy.wrap(elements).as('discoveredElements');
            
            // Guardar archivo si se solicita
            if (saveToFile) {
                cy.task('saveDiscoveredElements', elements);
            }
            
            cy.log(`📊 Elementos mapeados: ${elements.metadata.totalElements}`);
            cy.log(`🧭 Navegación: ${elements.navigation.length}`);
            cy.log(`🔘 Botones: ${elements.buttons.length}`);
            cy.log(`📝 Inputs: ${elements.inputs.length}`);
            cy.log(`🔗 Enlaces: ${elements.links.length}`);
            
            return cy.wrap(elements);
        });
    });
});

/**
 * Comando para generar steps dinámicamente basados en elementos descubiertos
 */
Cypress.Commands.add('generateDynamicSteps', (testCases, options = {}) => {
    cy.get('@discoveredElements').then((elements) => {
        // Crear steps dinámicos basados en elementos encontrados
        const dynamicSteps = [];
        
        // Generar steps de navegación
        elements.navigation.forEach(nav => {
            if (nav.text && nav.text.length > 0) {
                dynamicSteps.push(`When hago click en "${nav.text}"`);
                dynamicSteps.push(`Then verifico que navego a la sección "${nav.text}"`);
            }
        });
        
        // Generar steps de formularios
        elements.inputs.forEach(input => {
            if (input.name) {
                dynamicSteps.push(`When lleno el campo "${input.name}" con "{string}"`);
                dynamicSteps.push(`Then verifico que el campo "${input.name}" contiene el valor esperado`);
            }
        });
        
        // Generar steps de botones
        elements.buttons.forEach(btn => {
            if (btn.text && btn.text.length > 0) {
                dynamicSteps.push(`When hago click en el botón "${btn.text}"`);
                dynamicSteps.push(`Then verifico que el botón "${btn.text}" ejecuta la acción esperada`);
            }
        });
        
        cy.wrap(dynamicSteps).as('generatedSteps');
        cy.log(`🧠 Steps generados dinámicamente: ${dynamicSteps.length}`);
        
        return cy.wrap(dynamicSteps);
    });
});

/**
 * Comando para validar que los elementos mapeados funcionan correctamente
 */
Cypress.Commands.add('validateMappedElements', () => {
    cy.get('@discoveredElements').then((elements) => {
        let validElements = 0;
        let invalidElements = 0;
        
        // Validar navegación (simulado)
        elements.navigation.forEach(nav => {
            if (nav.selectors && nav.selectors.length > 0) {
                validElements++;
            } else {
                invalidElements++;
            }
        });
        
        cy.log(`✅ Elementos válidos: ${validElements}`);
        cy.log(`❌ Elementos inválidos: ${invalidElements}`);
        
        return cy.wrap({ valid: validElements, invalid: invalidElements });
    });
});

/**
 * Comando para simular extracción de casos de test
 */
Cypress.Commands.add('extractTestCasesToBDD', (selector = 'body') => {
    // Simular extracción de casos
    const mockSections = {
        "Home Page": [
            {
                titulo: "Home Page with three Sliders only",
                pasos: [
                    "Given navego a la sección \"Home Page\"",
                    "When ejecuto el caso \"Home Page with three Sliders only\"",
                    "Then verifico que el resultado es el esperado"
                ],
                seccion: "Home Page"
            }
        ],
        "Shop": [
            {
                titulo: "Filter by price functionality",
                pasos: [
                    "Given navego a la sección \"Shop\"",
                    "When ejecuto el caso \"Filter by price functionality\"",
                    "Then verifico que el resultado es el esperado"
                ],
                seccion: "Shop"
            }
        ]
    };
    
    cy.wrap(mockSections).as('extractedTestCases');
    cy.task('saveBDDTestCases', mockSections);
    
    const totalCases = Object.values(mockSections).reduce((sum, cases) => sum + cases.length, 0);
    cy.log(`📋 Casos extraídos (simulados): ${totalCases} en ${Object.keys(mockSections).length} secciones`);
    
    return cy.wrap(mockSections);
});

/**
 * Comando para generar feature file dinámicamente
 */
Cypress.Commands.add('generateDynamicFeature', (sectionName, testCases, options = {}) => {
    const { language = 'es', includeBackground = true } = options;
    
    const featureContent = `# language: ${language}
@dynamic @auto-generated
Característica: ${sectionName} - Casos dinámicos
  Como usuario del sistema
  Quiero ejecutar casos de prueba generados dinámicamente
  Para verificar funcionalidad de ${sectionName}

${includeBackground ? `  Antecedentes:
    Dado que navego al sitio web
    Y espero que la página esté cargada` : ''}

${testCases.map((testCase, index) => `  @caso-${index + 1}
  Escenario: ${testCase.titulo}
${testCase.pasos.map(paso => `    ${paso}`).join('\n')}`).join('\n\n')}
`;

    cy.task('saveDynamicFeature', {
        sectionName: sectionName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        content: featureContent
    });
    
    cy.wrap(featureContent).as('dynamicFeature');
    cy.log(`📄 Feature dinámico generado para: ${sectionName}`);
    
    return cy.wrap(featureContent);
});

/**
 * Comando para ejecutar flujo completo de análisis + generación
 */
Cypress.Commands.add('runFullAnalysisFlow', (options = {}) => {
    const { 
        mapElements = true,
        extractCases = true, 
        generateSteps = true,
        generateFeature = true,
        saveToDisk = true 
    } = options;
    
    cy.log('🚀 Iniciando flujo completo de análisis...');
    
    if (mapElements) {
        cy.mapPageElements({ saveToFile: saveToDisk });
    }
    
    if (extractCases) {
        cy.extractTestCasesToBDD();
    }
    
    if (generateSteps) {
        cy.get('@extractedTestCases').then((testCases) => {
            Object.entries(testCases).forEach(([section, cases]) => {
                if (generateFeature) {
                    cy.generateDynamicFeature(section, cases);
                }
            });
        });
    }
    
    cy.log('✅ Flujo completo de análisis completado');
});

/**
 * Comando para ejecutar el procesador unificado
 */
Cypress.Commands.add('runUnifiedProcessor', (options = {}) => {
    cy.task('executeUnifiedProcessor', options).then((result) => {
        cy.wrap(result).as('processorResult');
        cy.log(`📊 Procesador unificado completado`);
        cy.log(`📝 Locators generados: ${result.locatorsGenerated || 0}`);
        cy.log(`🏗️ Features creados: ${result.featuresCreated || 0}`);
        cy.log(`📄 Steps creados: ${result.stepsCreated || 0}`);
        
        return cy.wrap(result);
    });
});

/**
 * Comando personalizado para mostrar un prompt interactivo al usuario
 * NOTA: Este comando solo se ejecuta cuando cy.prompt() se llama con sintaxis antigua (string)
 * Si se llama con un array, Cypress intentará usar el comando oficial primero
 * 
 * Solo funciona en modo interactivo (headed mode con cypress open), no en modo headless
 * En modo headless, usará el valor por defecto o variables de entorno
 * 
 * IMPORTANTE: Este comando usa window.prompt() del navegador, que puede ser bloqueado
 * por algunos navegadores o configuraciones. En ese caso, usará el valor por defecto.
 * 
 * @param {string} message - Mensaje a mostrar en el prompt
 * @param {string} defaultValue - Valor por defecto si el usuario cancela o en modo headless
 * @returns {Cypress.Chainable} - Promise que resuelve con el valor ingresado o el valor por defecto
 * 
 * @example
 * // Comando personalizado (sintaxis antigua - solo para prompts interactivos simples)
 * cy.userPrompt('Ingrese su usuario:', 'standard_user').then((username) => {
 *   cy.log(`Usuario ingresado: ${username}`);
 * });
 */
Cypress.Commands.add('userPrompt', (message, defaultValue = '') => {
    cy.log(`💬 Prompt interactivo: ${message} (valor por defecto: ${defaultValue})`);
    
    // En modo headless o cuando prompt está bloqueado, usar valor por defecto
    // Primero verificar si hay una variable de entorno configurada
    const envValue = Cypress.env('PROMPT_VALUE');
    if (envValue) {
        cy.log(`📝 Usando valor de variable de entorno: ${envValue}`);
        return cy.wrap(envValue);
    }
    
    // Intentar usar window.prompt en el contexto del navegador
    return cy.window().then((win) => {
        try {
            // window.prompt bloquea la ejecución hasta que el usuario responda
            // Esto solo funciona en modo interactivo (cypress open)
            const userInput = win.prompt(message, defaultValue);
            
            if (userInput === null) {
                // Usuario canceló el prompt
                cy.log(`❌ Usuario canceló el prompt. Usando valor por defecto: ${defaultValue}`);
                return cy.wrap(defaultValue);
            } else {
                // Usuario ingresó un valor (puede ser string vacío)
                const result = userInput || defaultValue;
                cy.log(`✅ Valor recibido del prompt: ${result}`);
                return cy.wrap(result);
            }
        } catch (error) {
            // Si hay error (modo headless, prompt bloqueado, etc.), usar valor por defecto
            cy.log(`⚠️ No se pudo mostrar el prompt (${error.message}). Usando valor por defecto: ${defaultValue}`);
            return cy.wrap(defaultValue);
        }
    });
});

export {};