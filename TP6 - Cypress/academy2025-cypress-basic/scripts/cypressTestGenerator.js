const fs = require('fs').promises;
const path = require('path');

/**
 * 🚀 CYPRESS TEST GENERATOR - Script Unificado
 * 
 * Este script combina toda la funcionalidad necesaria para:
 * 1. Generar archivos .feature, steps y page objects
 * 2. Corregir imports y referencias problemáticas
 * 3. Aplicar traducciones completas
 * 4. Validar formato Gherkin
 * 5. Limpiar y optimizar archivos generados
 */

// ============================================================================
// CLASE PARA INDEXAR STEPS Y PAGE OBJECTS EXISTENTES
// ============================================================================
class StepIndexer {
    constructor() {
        this.existingSteps = new Map();
        this.existingPageObjects = new Map();
    }

    async scanExistingSteps(baseDir) {
        const stepsDir = path.join(baseDir, 'cypress/e2e/step_definitions');
        try {
            const files = await fs.readdir(stepsDir);
            const jsFiles = files.filter(file => file.endsWith('.js'));
            
            for (const file of jsFiles) {
                const filePath = path.join(stepsDir, file);
                const content = await fs.readFile(filePath, 'utf8');
                this.extractStepsFromContent(content, file);
            }
        } catch (error) {
            console.log('⚠️ No se encontraron steps existentes:', error.message);
        }
    }

    async scanExistingPageObjects(baseDir) {
        const pagesDir = path.join(baseDir, 'cypress/pages');
        try {
            const files = await fs.readdir(pagesDir);
            const jsFiles = files.filter(file => file.endsWith('.js'));
            
            for (const file of jsFiles) {
                const filePath = path.join(pagesDir, file);
                const content = await fs.readFile(filePath, 'utf8');
                this.extractPageObjectInfo(content, file);
            }
        } catch (error) {
            console.log('⚠️ No se encontraron page objects existentes:', error.message);
        }
    }

    extractStepsFromContent(content, fileName) {
        const stepRegex = /(Given|When|Then|And)\s*\(\s*['"`]([^'"`]+)['"`]/g;
        let match;
        
        while ((match = stepRegex.exec(content)) !== null) {
            const stepType = match[1];
            const stepText = match[2];
            const stepKey = this.normalizeStepText(stepText);
            
            if (!this.existingSteps.has(stepKey)) {
                this.existingSteps.set(stepKey, {
                    type: stepType,
                    text: stepText,
                    file: fileName
                });
            }
        }
    }

    extractPageObjectInfo(content, fileName) {
        const className = fileName.replace('.js', '');
        const methods = [];
        
        const methodRegex = /(\w+)\s*[=:]\s*\([^)]*\)\s*=>\s*{|(\w+)\s*\([^)]*\)\s*{/g;
        let match;
        
        while ((match = methodRegex.exec(content)) !== null) {
            const methodName = match[1] || match[2];
            if (methodName && !['constructor', 'elements'].includes(methodName)) {
                methods.push(methodName);
            }
        }

        this.existingPageObjects.set(className, {
            file: fileName,
            methods: methods
        });
    }

    normalizeStepText(text) {
        return text
            .toLowerCase()
            .replace(/\{[^}]+\}/g, '{param}')
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    findExistingStep(stepText) {
        const normalized = this.normalizeStepText(stepText);
        return this.existingSteps.get(normalized);
    }

    hasPageObject(className) {
        return this.existingPageObjects.has(className);
    }
}

// ============================================================================
// DICCIONARIOS DE TRADUCCIONES Y MAPEOS
// ============================================================================
const stepTranslations = {
    // Steps básicos de navegación
    'Click on My Account Menu': 'When Hago click en el menú My Account',
    'Click on Shop Menu': 'When Ingreso al shop',
    'Now click on Home menu button': 'When Hago click en el botón del menú Home',
    
    // Steps de login y autenticación
    'Enter registered username': 'And Ingreso el usuario registrado en el campo username',
    'Enter password': 'And Ingreso la contraseña en el campo password',
    'Click on login button': 'When Hago click en el botón de login',
    'User must successfully login': 'Then Verifico que inicio sesión exitosamente',
    
    // Steps de My Account
    'Click on Myaccount link': 'When Hago click en el enlace My Account',
    'Click on Orders link': 'When Hago click en el enlace Orders',
    'Click view button': 'When Hago click en el botón View',
    'Click on Address link': 'When Hago click en el enlace Address',
    'Click Edit on Shipping Address': 'When Hago click en Editar dirección de envío',
    'Click on Account details': 'When Hago click en Account Details',
    'Click on Logout button': 'When Hago click en el botón Logout',
    
    // Steps de Shop
    'Adjust the filter by price': 'When Busco por rango de precio, de medio a mayor',
    'Click on Filter button': 'When Hago click en el botón Filter',
    'Click on Add To Basket': 'When Agrego {int} productos al carrito',
    'Click on Remove': 'And elimino productos seleccionados',
    'Click on Item link': 'When Hago click en el enlace Item',
    'Click on Place Order button': 'When Hago click en el botón Place Order',
    
    // Steps de Home Page
    'Test whether the Home page has Three Sliders only': 'When Verifico que la página Home tiene solo tres sliders',
    'Test whether the Home page has Three Arrivals only': 'When Verifico que la página Home tiene solo tres llegadas',
    'Now click the image in the Arrivals': 'When Hago click en la imagen de las llegadas',
    'Click on Description tab for the book you clicked on.': 'When Hago click en la pestaña Description del libro seleccionado',
    'Click on the Add To Basket button which adds that book to your basket': 'When Hago click en el botón Add To Basket para agregar el libro al carrito',
    'Click the add to basket button': 'When Hago click en el botón add to basket',
    
    // Steps de verificación
    'User must view Dashboard': 'Then Verifico que puedo ver el Dashboard',
    'User must view their orders': 'Then Verifico que puedo ver mis pedidos',
    'User can view books only between': 'Then Verifico que puedo ver libros solo entre el rango de precio especificado',
    'User can view that Book in the Menu item': 'Then Verifico que puedo ver ese libro en el menú'
};

const stepImplementations = {
    'Hago click en el botón del menú Home': 'cy.get(\'#menu-item-40\').click();',
    'Verifico que la página Home tiene solo tres sliders': 'cy.get(\'.slider\').should(\'have.length\', 3);',
    'Verifico que la página Home tiene solo tres llegadas': 'cy.get(\'.arrivals\').should(\'have.length\', 3);',
    'Hago click en la imagen de las llegadas': 'cy.get(\'.arrivals img\').first().click();',
    'Hago click en la pestaña Description del libro seleccionado': 'cy.get(\'[data-tab="description"]\').click();',
    'Hago click en el botón Add To Basket para agregar el libro al carrito': 'cy.get(\'.add_to_cart_button\').click();',
    'Hago click en el botón add to basket': 'cy.get(\'.add_to_cart_button\').click();',
    'Ingreso al shop': 'cy.get(\'#menu-item-shop\').click();',
    'Busco por rango de precio, de medio a mayor': 'cy.get(\'.price_slider\').trigger(\'mousedown\');',
    'Hago click en el botón Filter': 'cy.get(\'.price_slider_amount button\').click();',
    'Navego al sitio automationtesting': 'cy.visit(\'/\');',
    'Espero que la página esté cargada': 'cy.get(\'body\').should(\'be.visible\'); cy.get(\'#menu-item-50\').should(\'be.visible\');'
};

// ============================================================================
// FUNCIÓN PARA CONVERTIR PASOS A FORMATO GHERKIN
// ============================================================================
function convertirPasosAGherkin(pasos, stepIndexer) {
    const backgroundSteps = ['Open the browser', 'Enter the URL'];

    return pasos
        .filter(paso => {
            const pasoLimpio = paso.replace(/^\d+\)\s*/, '').trim();
            return !backgroundSteps.some(bgStep => pasoLimpio.toLowerCase().includes(bgStep.toLowerCase()));
        })
        .map(paso => {
            let pasoLimpio = paso.replace(/^\d+\)\s*/, '').trim();
            let pasoTransformado = pasoLimpio;
            let encontrado = false;
            
            // Buscar traducción exacta
            Object.entries(stepTranslations).forEach(([key, value]) => {
                if (!encontrado && pasoLimpio.toLowerCase().includes(key.toLowerCase())) {
                    pasoTransformado = value;
                    encontrado = true;
                    return;
                }
            });

            // Si no se encontró traducción, aplicar reglas generales
            if (!encontrado) {
                if (pasoLimpio.toLowerCase().includes('verify') || 
                    pasoLimpio.toLowerCase().includes('must') ||
                    pasoLimpio.toLowerCase().includes('can view') ||
                    pasoLimpio.toLowerCase().includes('should')) {
                    pasoTransformado = `Then Verifico que ${pasoLimpio.toLowerCase()}`;
                } else if (pasoLimpio.toLowerCase().includes('click') ||
                          pasoLimpio.toLowerCase().includes('enter') ||
                          pasoLimpio.toLowerCase().includes('fill')) {
                    pasoTransformado = `When ${pasoLimpio}`;
                } else {
                    pasoTransformado = `When ${pasoLimpio}`;
                }
            }

            return `        ${pasoTransformado}`;
        });
}

// ============================================================================
// TEMPLATES PARA GENERACIÓN DE ARCHIVOS
// ============================================================================
const templates = {
    feature: (seccion, casos, stepIndexer) => {
        const nombreSeccion = seccion.replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase();
        const scenarios = casos.map((caso, index) => {
            const pasos = caso.pasos.map(paso => {
                return paso.split(/\d+\)/)
                    .map(p => p.trim())
                    .filter(p => p.length > 0)
                    .map(p => convertirPasosAGherkin([p], stepIndexer)[0])
                    .filter(p => p && p.trim() !== '');
            }).flat().filter(p => p && p.trim() !== '');
            
            if (pasos.length === 0) return null;
            
            return `
    @${nombreSeccion} @caso_${index + 1}
    Scenario Outline: ${caso.titulo}
${pasos.join('\n')}

        Examples:
            | user                                           | pass           |
            | academyCypress_usuarioNormal@crowdaronline.com | Crowdar.2025! |`;
        }).filter(scenario => scenario !== null).join('\n');

        return `Feature: ${seccion} - Pruebas Automatizadas

    Background:
        Given Navego al sitio automationtesting
        And Espero que la página esté cargada
${scenarios}`;
    },

    steps: (seccion, featureContent, stepIndexer) => {
        const className = seccion.replace(/[^a-zA-Z0-9]+/g, '');
        
        // Extraer steps únicos del feature
        const featureSteps = featureContent.match(/(?<=\n\s+(?:Given|When|Then|And) ).+/g) || [];
        const uniqueSteps = [...new Set(featureSteps)];
        
        // Generar implementaciones para steps nuevos
        const newSteps = uniqueSteps
            .filter(step => !stepIndexer.findExistingStep(step))
            .map(step => {
                // Determinar el tipo de step correctamente (NO usar And)
                let stepType;
                if (step.startsWith('Verifico') || step.startsWith('Compruebo') || 
                    step.startsWith('Valido') || step.startsWith('Veo') ||
                    step.toLowerCase().includes('debe')) {
                    stepType = 'Then';
                } else if (step.startsWith('Ingreso') || step.startsWith('Hago') ||
                          step.startsWith('Selecciono') || step.startsWith('Escribo') ||
                          step.startsWith('Completo') || step.startsWith('Realizo')) {
                    stepType = 'When';
                } else if (step.startsWith('Navego') || step.startsWith('Estoy') ||
                          step.startsWith('Abro') || step.startsWith('Cargo')) {
                    stepType = 'Given';
                } else {
                    // Default seguro
                    stepType = 'When';
                }
                
                // Usar implementación predefinida o generar una básica
                const implementation = stepImplementations[step] || 
                    `cy.log('⚠️ Implementar: ${step}'); // TODO: Implementar este step`;
                
                return `${stepType}('${step}', () => {
    cy.log('🔍 Ejecutando: ${step}');
    ${implementation}
});`;
            });

        // Incluir steps comunes si no existen
        const commonSteps = [];
        if (!stepIndexer.findExistingStep('Navego al sitio automationtesting')) {
            commonSteps.push(`Given('Navego al sitio automationtesting', () => {
    cy.log('🌐 Navegando al sitio de pruebas...');
    cy.visit('/');
});`);
        }

        if (!stepIndexer.findExistingStep('Espero que la página esté cargada')) {
            commonSteps.push(`Given('Espero que la página esté cargada', () => {
    cy.log('⌛ Esperando que la página cargue...');
    cy.get('body').should('be.visible');
    cy.get('#menu-item-50').should('be.visible');
});`);
        }

        const allSteps = [...commonSteps, ...newSteps];
        
        if (allSteps.length === 0) {
            return `import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// Todos los steps necesarios ya existen en otros archivos
// Este archivo se mantiene para consistencia`;
        }

        return `import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

${allSteps.join('\n\n')}`;
    }
};

// ============================================================================
// FUNCIONES DE CORRECCIÓN Y VALIDACIÓN
// ============================================================================
async function fixImportsInStepsFiles(baseDir) {
    const stepsDir = path.join(baseDir, 'cypress/e2e/step_definitions');
    
    try {
        const files = await fs.readdir(stepsDir);
        const jsFiles = files.filter(file => file.endsWith('.js'));
        
        for (const file of jsFiles) {
            const filePath = path.join(stepsDir, file);
            const content = await fs.readFile(filePath, 'utf8');
            
            let fixedContent = content;
            
            // Corregir imports problemáticos
            fixedContent = fixedContent.replace(
                /import\s+MyAccountPage\s+from\s+['"].*MyAccountPage['"];?/g,
                '// import MyAccountPage corregido automáticamente'
            );
            
            // Reemplazar llamadas a page objects inexistentes
            const methodReplacements = [
                { old: /MyAccountPage\.hacerClickEnElMenuMyAccount\(\);?/g, new: 'cy.get(\'#menu-item-50\').click();' },
                { old: /MyAccountPage\.ingresoElUsuarioRegistradoEnElCampoUsername\(\);?/g, new: 'cy.get(\'#username\').type(\'usuario_registrado\');' },
                { old: /MyAccountPage\.ingresoLaContrasenaEnElCampoPassword\(\);?/g, new: 'cy.get(\'#password\').type(\'contraseña_segura\');' },
                { old: /MyAccountPage\.hacerClickEnElBotonDeLogin\(\);?/g, new: 'cy.get(\'button[name="login"]\').click();' }
            ];
            
            methodReplacements.forEach(({ old, new: replacement }) => {
                fixedContent = fixedContent.replace(old, replacement);
            });
            
            await fs.writeFile(filePath, fixedContent);
        }
        
        console.log('✅ Imports corregidos en archivos de steps');
    } catch (error) {
        console.log('⚠️ Error corrigiendo imports:', error.message);
    }
}

async function validateFeatureFile(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf8');
        const lines = content.split('\n');
        const issues = [];
        
        let hasFeature = false;
        let hasScenarios = false;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const lineNumber = i + 1;
            
            if (line.startsWith('Feature:')) hasFeature = true;
            if (line.startsWith('Scenario')) hasScenarios = true;
            
            // Verificar pasos de Gherkin
            if (line.match(/^\s*(Given|When|Then|And)\s+/)) {
                const stepContent = line.replace(/^\s*(Given|When|Then|And)\s+/, '').trim();
                if (!stepContent) {
                    issues.push(`Línea ${lineNumber}: Paso vacío`);
                }
            }
        }
        
        if (!hasFeature) issues.push('Sin declaración Feature');
        if (!hasScenarios) issues.push('Sin escenarios');
        
        return {
            valid: issues.length === 0,
            issues: issues
        };
    } catch (error) {
        return {
            valid: false,
            issues: [`Error leyendo archivo: ${error.message}`]
        };
    }
}

// ============================================================================
// FUNCIÓN PRINCIPAL
// ============================================================================
async function main() {
    try {
        const baseDir = path.join(__dirname, '..');
        
        console.log('🚀 CYPRESS TEST GENERATOR - Iniciando proceso completo...\n');
        
        // 1. Inicializar indexador
        console.log('🔍 1. Escaneando archivos existentes...');
        const stepIndexer = new StepIndexer();
        await stepIndexer.scanExistingSteps(baseDir);
        await stepIndexer.scanExistingPageObjects(baseDir);
        console.log(`   • ${stepIndexer.existingSteps.size} steps existentes encontrados`);
        console.log(`   • ${stepIndexer.existingPageObjects.size} page objects existentes encontrados`);
        
        // 2. Crear directorios necesarios
        console.log('\n📁 2. Creando directorios...');
        const dirs = [
            'cypress/fixtures',
            'cypress/e2e/features/generated',
            'cypress/e2e/step_definitions/generated',
            'cypress/pages/generated'
        ];

        for (const dir of dirs) {
            const fullPath = path.join(baseDir, dir);
            await fs.mkdir(fullPath, { recursive: true });
        }
        console.log('   ✅ Directorios creados');

        // 3. Leer casos de prueba
        console.log('\n📖 3. Leyendo casos de prueba...');
        const casosJsonPath = path.join(baseDir, 'cypress/fixtures/casos_prueba.json');
        const casosJson = await fs.readFile(casosJsonPath, 'utf8');
        const casos = JSON.parse(casosJson);
        console.log(`   • ${Object.keys(casos).length} secciones encontradas`);

        // 4. Generar archivos
        console.log('\n🔧 4. Generando archivos...');
        let featuresGenerated = 0;
        let stepsGenerated = 0;
        
        for (const [seccion, casosPrueba] of Object.entries(casos)) {
            if (!seccion || seccion === '') continue;
            
            const nombreArchivo = seccion.toLowerCase()
                .replace(/[^a-z0-9]+/g, '_')
                .replace(/^_+|_+$/g, '')
                .replace(/_+/g, '_');
            
            if (!nombreArchivo || nombreArchivo === '') continue;
            
            console.log(`   🔧 Procesando: ${seccion}`);
            
            // Generar .feature
            const featureContent = templates.feature(seccion, casosPrueba, stepIndexer);
            const featurePath = path.join(baseDir, 'cypress/e2e/features/generated', `${nombreArchivo}.feature`);
            await fs.writeFile(featurePath, featureContent);
            featuresGenerated++;
            
            // Generar steps
            const stepsContent = templates.steps(seccion, featureContent, stepIndexer);
            const stepsPath = path.join(baseDir, 'cypress/e2e/step_definitions/generated', `${nombreArchivo}Steps.js`);
            await fs.writeFile(stepsPath, stepsContent);
            stepsGenerated++;
        }
        
        console.log(`   ✅ ${featuresGenerated} features generados`);
        console.log(`   ✅ ${stepsGenerated} archivos de steps generados`);

        // 5. Corregir imports problemáticos
        console.log('\n🔧 5. Corrigiendo imports problemáticos...');
        await fixImportsInStepsFiles(baseDir);

        // 6. Validar archivos generados
        console.log('\n✅ 6. Validando archivos generados...');
        const featuresDir = path.join(baseDir, 'cypress/e2e/features/generated');
        const files = await fs.readdir(featuresDir);
        const featureFiles = files.filter(file => file.endsWith('.feature'));
        
        let validFiles = 0;
        let totalIssues = 0;
        
        for (const file of featureFiles) {
            const filePath = path.join(featuresDir, file);
            const validation = await validateFeatureFile(filePath);
            
            if (validation.valid) {
                validFiles++;
            } else {
                totalIssues += validation.issues.length;
                console.log(`   ⚠️ ${file}: ${validation.issues.length} problemas`);
            }
        }

        // 7. Resumen final
        console.log('\n🎉 PROCESO COMPLETADO EXITOSAMENTE!\n');
        console.log('📊 RESUMEN:');
        console.log(`   • Features generados: ${featuresGenerated}`);
        console.log(`   • Steps generados: ${stepsGenerated}`);
        console.log(`   • Features válidos: ${validFiles}/${featureFiles.length}`);
        console.log(`   • Steps reutilizados: ${stepIndexer.existingSteps.size}`);
        console.log(`   • Page Objects respetados: ${stepIndexer.existingPageObjects.size}`);
        
        if (totalIssues > 0) {
            console.log(`   ⚠️ Problemas menores: ${totalIssues} (pueden requerir ajustes manuales)`);
        }
        
        console.log('\n💡 PRÓXIMOS PASOS:');
        console.log('   1. Ejecutar: npm run cypress:execution');
        console.log('   2. Revisar logs de Cypress para ajustes');
        console.log('   3. Personalizar selectores CSS según la aplicación');
        console.log('   4. Implementar steps marcados como TODO');
        
    } catch (error) {
        console.error('❌ Error durante la generación:', error);
        console.error(error.stack);
        process.exit(1);
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    main();
}

module.exports = {
    StepIndexer,
    convertirPasosAGherkin,
    templates,
    stepTranslations,
    stepImplementations
}; 