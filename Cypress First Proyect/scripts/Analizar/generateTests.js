const fs = require('fs').promises;
const path = require('path');

// Clase para indexar y gestionar steps existentes
class StepIndexer {
    constructor() {
        this.existingSteps = new Map();
        this.existingPageObjects = new Map();
        this.existingMethods = new Map();
    }

    // Escanear archivos de steps existentes
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
            console.log('⚠️ No se encontraron steps existentes o error al leer:', error.message);
        }
    }

    // Escanear page objects existentes
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
            console.log('⚠️ No se encontraron page objects existentes o error al leer:', error.message);
        }
    }

    // Extraer steps de contenido de archivo
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
                    file: fileName,
                    fullMatch: match[0]
                });
            }
        }
    }

    // Extraer información de page objects
    extractPageObjectInfo(content, fileName) {
        const className = fileName.replace('.js', '');
        const methods = [];
        
        // Buscar métodos en el page object
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

    // Normalizar texto de step para comparación
    normalizeStepText(text) {
        return text
            .toLowerCase()
            .replace(/\{[^}]+\}/g, '{param}') // Reemplazar parámetros
            .replace(/[^\w\s]/g, '') // Remover puntuación
            .replace(/\s+/g, ' ') // Normalizar espacios
            .trim();
    }

    // Buscar step existente
    findExistingStep(stepText) {
        const normalized = this.normalizeStepText(stepText);
        return this.existingSteps.get(normalized);
    }

    // Verificar si existe page object
    hasPageObject(className) {
        return this.existingPageObjects.has(className);
    }

    // Obtener métodos de page object existente
    getPageObjectMethods(className) {
        const pageObj = this.existingPageObjects.get(className);
        return pageObj ? pageObj.methods : [];
    }
}

// Función mejorada para convertir pasos en formato Gherkin
function convertirPasosAGherkin(pasos, stepIndexer) {
    const backgroundSteps = [
        'Open the browser',
        'Enter the URL'
    ];

    const stepsMap = {
        'Click on My Account Menu': 'When Hago click en el menú My Account',
        'Enter registered username': 'And Ingreso el usuario registrado en el campo username',
        'Enter password': 'And Ingreso la contraseña en el campo password',
        'Click on login button': 'When Hago click en el botón de login',
        'User must successfully login': 'Then Verifico que inicio sesión exitosamente',
        'Click on Myaccount link': 'When Hago click en el enlace My Account',
        'Click on Orders link': 'When Hago click en el enlace Orders',
        'Click view button': 'When Hago click en el botón View',
        'User must view his Order details': 'Then Verifico que puedo ver los detalles del pedido, cliente y facturación',
        'User must view Order Number': 'Then Verifico que puedo ver el número de pedido, fecha y estado',
        'Click on Address link': 'When Hago click en el enlace Address',
        'User must view billing address': 'Then Verifico que puedo ver las direcciones de facturación y envío',
        'Click Edit on Shipping Address': 'When Hago click en Editar dirección de envío',
        'User can Edit Shipping address': 'Then Verifico que puedo editar la dirección de envío',
        'Click on Account details': 'When Hago click en Account Details',
        'User can view account details': 'Then Verifico que puedo ver y cambiar los detalles de la cuenta',
        'Click on Logout button': 'When Hago click en el botón Logout',
        'User successfully': 'Then Verifico que',
        'comes out from the site': 'salí exitosamente del sitio',
        'User must view Dashboard': 'Then Verifico que puedo ver el Dashboard',
        'User must view their orders': 'Then Verifico que puedo ver mis pedidos',
        'Click on Shop Menu': 'When Ingreso al shop',
        'Adjust the filter by price': 'When Busco por rango de precio, de medio a mayor',
        'Now click on the specific price range': 'And Ingreso al rango de busqueda marcada',
        'User can view the filtered price range products': 'Then Verifico que ingreso al rango de busqueda deseada',
        'Click on Add To Basket': 'When Agrego {int} productos al carrito',
        'User can view that Book in Cart': 'Then Verifico que se agregaron los productos al carrito correctamente',
        'Click on Remove': 'And elimino productos seleccionados',
        'Now click on View Basket': 'Then Verifico que no hay productos agregados',
        'Click on Filter button': 'When Hago click en el botón Filter',
        'User can view books only between': 'Then Verifico que puedo ver libros solo entre el rango de precio especificado',
        'Click any of the product links': 'When Hago click en cualquier enlace de producto disponible',
        'Now user can view only that particular product': 'Then Verifico que puedo ver solo ese producto específico',
        'Click on Sort by': 'When Hago click en ordenar por',
        'Now user can view the popular products only': 'Then Verifico que puedo ver solo los productos populares',
        'Read More option indicates': 'Then Verifico que la opción Read More indica',
        'User cannot add the product': 'And Verifico que no puedo agregar el producto',
        'User can clearly view the actual price': 'Then Verifico que puedo ver claramente el precio actual',
        'User can view that Book in the Menu item': 'Then Verifico que puedo ver ese libro en el menú',
        'Now user can find total and subtotal values': 'And Verifico que puedo encontrar los valores totales y subtotales',
        'The total always < subtotal': 'And Verifico que el total es menor que el subtotal',
        'User can view Billing Details': 'Then Verifico que puedo ver los detalles de facturación',
        'Now user can fill his details': 'And Verifico que puedo llenar mis detalles',
        'Click on Place Order button': 'When Hago click en el botón Place Order',
        'On clicking place-order button': 'Then Verifico que al hacer click en place-order',
        'Click on Item link': 'When Hago click en el enlace Item',
        'The tax rate varies': 'And Verifico que la tasa de impuestos varía'
    };

    return pasos
        .filter(paso => {
            const pasoLimpio = paso.replace(/^\d+\)\s*/, '').trim();
            return !backgroundSteps.some(bgStep => pasoLimpio.toLowerCase().includes(bgStep.toLowerCase()));
        })
        .map(paso => {
            // Remover numeración y espacios extra
            let pasoLimpio = paso.replace(/^\d+\)\s*/, '').trim();
            
            // Buscar y reemplazar frases comunes primero
            let pasoTransformado = pasoLimpio;
            let encontrado = false;
            
            Object.entries(stepsMap).forEach(([key, value]) => {
                if (!encontrado && pasoLimpio.toLowerCase().includes(key.toLowerCase())) {
                    pasoTransformado = value;
                    encontrado = true;
                    return;
                }
            });

            // Si no se encontró una transformación específica, aplicar reglas generales
            if (!encontrado) {
                // Determinar el tipo de paso basado en el contenido
                if (pasoLimpio.toLowerCase().includes('verify') || 
                    pasoLimpio.toLowerCase().includes('must') ||
                    pasoLimpio.toLowerCase().includes('can view') ||
                    pasoLimpio.toLowerCase().includes('should') ||
                    pasoLimpio.toLowerCase().includes('user can') ||
                    pasoLimpio.toLowerCase().includes('indicates') ||
                    pasoLimpio.toLowerCase().includes('always') ||
                    pasoLimpio.toLowerCase().includes('rate') ||
                    pasoLimpio.toLowerCase().includes('completes')) {
                    pasoTransformado = `Then Verifico que ${pasoLimpio.toLowerCase()}`;
                } else if (pasoLimpio.toLowerCase().includes('click') ||
                          pasoLimpio.toLowerCase().includes('enter') ||
                          pasoLimpio.toLowerCase().includes('fill') ||
                          pasoLimpio.toLowerCase().includes('opt') ||
                          pasoLimpio.toLowerCase().includes('place order')) {
                    pasoTransformado = `When ${pasoLimpio}`;
                } else if (pasoLimpio.toLowerCase().includes('naveg') ||
                          pasoLimpio.toLowerCase().includes('open') ||
                          pasoLimpio.toLowerCase().includes('load') ||
                          pasoLimpio.toLowerCase().includes('start')) {
                    pasoTransformado = `Given ${pasoLimpio}`;
                } else {
                    // Por defecto, asumir que es un When (NO usar And)
                    pasoTransformado = `When ${pasoLimpio}`;
                }
            }

            return `        ${pasoTransformado}`;
        });
}

// Plantillas mejoradas para generación de archivos
const templates = {
    feature: (seccion, casos, stepIndexer) => {
        const nombreSeccion = seccion.replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase();
        const scenarios = casos.map((caso, index) => {
            const pasos = caso.pasos.map(paso => {
                // Dividir los pasos si están concatenados
                return paso.split(/\d+\)/)
                    .map(p => p.trim())
                    .filter(p => p.length > 0)
                    .map(p => convertirPasosAGherkin([p], stepIndexer)[0])
                    .filter(p => p && p.trim() !== ''); // Filtrar pasos vacíos
            }).flat().filter(p => p && p.trim() !== ''); // Filtrar pasos vacíos
            
            // Solo incluir el escenario si tiene pasos válidos
            if (pasos.length === 0) {
                return null;
            }
            
            return `
    @${nombreSeccion} @caso_${index + 1}
    Scenario Outline: ${caso.titulo}
${pasos.join('\n')}

        Examples:
            | user                                           | pass           |
            | academyCypress_usuarioNormal@crowdaronline.com | Crowdar.2025! |`;
        }).filter(scenario => scenario !== null).join('\n'); // Filtrar escenarios nulos

        return `Feature: ${seccion} - Pruebas Automatizadas

    Background:
        Given Navego al sitio automationtesting
        And Espero que la página esté cargada
${scenarios}`;
    },

    steps: (seccion, featureContent, stepIndexer) => {
        const className = seccion.replace(/[^a-zA-Z0-9]+/g, '');
        const existingPageObject = stepIndexer.hasPageObject(`${className}Page`);
        const pageObjectImport = existingPageObject ? 
            `import ${className}Page from '../../pages/${className}Page';` :
            `import ${className}Page from '../../pages/generated/${className}Page';`;

        // Extraer steps únicos del feature
        const featureSteps = featureContent.match(/(?<=\n\s+(?:Given|When|Then|And) ).+/g) || [];
        const uniqueSteps = [...new Set(featureSteps)];
        
        // Generar solo steps que no existen
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
                
                const methodName = step.toLowerCase().replace(/[^a-z0-9]+/g, '_');
                
                return `${stepType}('${step}', () => {
    cy.log('🔍 Ejecutando: ${step}');
    ${className}Page.${methodName}();
});`;
            });

        // Incluir steps comunes solo si no existen
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
${pageObjectImport}

// Todos los steps necesarios ya existen en otros archivos
// Este archivo se mantiene para consistencia pero no define nuevos steps`;
        }

        return `import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
${pageObjectImport}

${allSteps.join('\n\n')}`;
    },

    pageObject: (seccion, stepIndexer) => {
        const className = seccion.replace(/[^a-zA-Z0-9]+/g, '');
        const existingPageObject = stepIndexer.getPageObjectMethods(`${className}Page`);
        
        if (existingPageObject.length > 0) {
            // Si ya existe un page object, no generar uno nuevo
            console.log(`⚠️ Page Object ${className}Page ya existe, saltando generación...`);
            return null;
        }

        return `/**
 * Page Object Model para la sección ${seccion}
 * @class ${className}Page
 */

class ${className}Page {
    // Locators
    elements = {
        // Locators comunes
        menuPrincipal: '#menu-item-50',
        contenedorPrincipal: '.page-content',
        mensajeError: '.woocommerce-error',
        mensajeExito: '.woocommerce-message',

        // Locators de My Account
        botonLogin: '.login button[name="login"]',
        campoUsuario: '#username',
        campoPassword: '#password',
        enlaceMyAccount: '.woocommerce-MyAccount-navigation-link--dashboard a',
        enlaceOrders: '.woocommerce-MyAccount-navigation-link--orders a',
        enlaceAddress: '.woocommerce-MyAccount-navigation-link--edit-address a',
        botonView: '.woocommerce-orders-table__cell-order-actions .button.view',
        botonLogout: '.woocommerce-MyAccount-navigation-link--customer-logout a',
        editarDireccionEnvio: '.woocommerce-MyAccount-navigation-link--edit-address .edit-shipping',
        detallesPedido: '.woocommerce-order-details',
        detallesCliente: '.woocommerce-customer-details',
        detallesFacturacion: '.woocommerce-billing-fields',
        numeroPedido: '.order-number',
        fechaPedido: '.order-date',
        estadoPedido: '.order-status',
        direccionFacturacion: '.woocommerce-address-fields',
        direccionEnvio: '.shipping_address',
        detallesCuenta: '.woocommerce-MyAccount-content',
        dashboard: '.woocommerce-MyAccount-content',

        // Locators de Shop
        menuShop: '#menu-item-shop',
        filtroPrecio: '.price_slider_wrapper',
        sliderPrecio: '.price_slider',
        botonFiltrar: '.price_slider_amount button',
        listaProductos: '.products',
        botonAgregarCarrito: '.add_to_cart_button',
        botonVerCarrito: '.cart-contents',
        botonRemover: '.remove',
        mensajeCarritoVacio: '.cart-empty',
        precioProducto: '.price',
        cantidadCarrito: '.cart-contents-count'
    };

    // Métodos comunes
    clickMenu(menu) {
        cy.contains(menu).click();
    }

    verificarMensajeExito(mensaje) {
        cy.get(this.elements.mensajeExito)
            .should('be.visible')
            .and('contain.text', mensaje);
    }

    // Métodos específicos según la sección
    ${seccion.toLowerCase().includes('shop') ? `
    // Métodos de Shop
    ingresoAlShop() {
        cy.get(this.elements.menuShop).click();
    }

    buscoRangoPrecioMedioAMayor() {
        cy.get(this.elements.filtroPrecio).should('be.visible');
        cy.get(this.elements.sliderPrecio).trigger('mousedown', { which: 1 });
        cy.get(this.elements.botonFiltrar).click();
    }

    ingresoAlRangoBusquedaMarcada() {
        cy.get(this.elements.listaProductos).should('be.visible');
    }

    verificoIngresoRangoBusquedaDeseada() {
        cy.get(this.elements.precioProducto).should('be.visible');
    }

    agregoProductosAlCarrito(cantidad) {
        for(let i = 0; i < cantidad; i++) {
            cy.get(this.elements.botonAgregarCarrito).first().click();
        }
    }

    verificoProductosAgregadosCarrito() {
        cy.get(this.elements.cantidadCarrito).should('be.visible');
    }

    eliminoProductosSeleccionados() {
        cy.get(this.elements.botonRemover).click();
    }

    verificoNoHayProductosAgregados() {
        cy.get(this.elements.mensajeCarritoVacio).should('be.visible');
    }` : `
    // Métodos de My Account
    hacerClickEnElMenuMyAccount() {
        cy.get(this.elements.menuPrincipal).click();
    }

    ingresoElUsuarioRegistradoEnElCampoUsername() {
        cy.get(this.elements.campoUsuario).type('usuario_registrado');
    }

    ingresoLaContrasenaEnElCampoPassword() {
        cy.get(this.elements.campoPassword).type('contraseña_segura');
    }

    hacerClickEnElBotonDeLogin() {
        cy.get(this.elements.botonLogin).click();
    }

    verificoQueInicioSesionExitosamente() {
        cy.get(this.elements.mensajeExito)
            .should('be.visible')
            .and('contain.text', 'Has iniciado sesión exitosamente');
    }

    hacerClickEnElEnlaceMyAccount() {
        cy.get(this.elements.enlaceMyAccount).click();
    }

    verificoQuePuedoVerElDashboard() {
        cy.get(this.elements.dashboard).should('be.visible');
    }

    verificoQuePuedoVerMisPedidos() {
        cy.get(this.elements.detallesPedido).should('be.visible');
    }

    verificoQuePuedoVerLosDetallesDelPedidoClienteYFacturacion() {
        cy.get(this.elements.detallesPedido).should('be.visible');
        cy.get(this.elements.detallesCliente).should('be.visible');
        cy.get(this.elements.detallesFacturacion).should('be.visible');
    }

    verificoQuePuedoVerElNumeroDePedidoFechaYEstado() {
        cy.get(this.elements.numeroPedido).should('be.visible');
        cy.get(this.elements.fechaPedido).should('be.visible');
        cy.get(this.elements.estadoPedido).should('be.visible');
    }

    verificoQuePuedoVerLasDireccionesDeFacturacionYEnvio() {
        cy.get(this.elements.direccionFacturacion).should('be.visible');
        cy.get(this.elements.direccionEnvio).should('be.visible');
    }

    hacerClickEnEditarDireccionDeEnvio() {
        cy.get(this.elements.editarDireccionEnvio).click();
    }

    verificoQuePuedoEditarLaDireccionDeEnvio() {
        cy.get(this.elements.direccionEnvio).should('be.visible');
    }

    verificoQuePuedoVerYCambiarLosDetallesDeLaCuenta() {
        cy.get(this.elements.detallesCuenta).should('be.visible');
    }

    hacerClickEnElBotonLogout() {
        cy.get(this.elements.botonLogout).click();
    }

    verificoQueSaliExitosamenteDelSitio() {
        cy.get(this.elements.mensajeExito)
            .should('be.visible')
            .and('contain.text', 'Has cerrado sesión exitosamente');
    }

    hacerClickEnElEnlaceOrders() {
        cy.get(this.elements.enlaceOrders).click();
    }

    hacerClickEnElBotonView() {
        cy.get(this.elements.botonView).first().click();
    }

    hacerClickEnElEnlaceAddress() {
        cy.get(this.elements.enlaceAddress).click();
    }

    hacerClickEnAccountDetails() {
        cy.get('.woocommerce-MyAccount-navigation-link--edit-account a').click();
    }`}
}

export default new ${className}Page();`;
    }
};

async function main() {
    try {
        const baseDir = path.join(__dirname, '..');
        
        // Inicializar el indexador de steps
        const stepIndexer = new StepIndexer();
        
        console.log('🔍 Escaneando archivos existentes...');
        await stepIndexer.scanExistingSteps(baseDir);
        await stepIndexer.scanExistingPageObjects(baseDir);
        
        console.log(`📊 Encontrados ${stepIndexer.existingSteps.size} steps existentes`);
        console.log(`📊 Encontrados ${stepIndexer.existingPageObjects.size} page objects existentes`);
        
        // Crear directorios si no existen
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

        // Leer el archivo JSON con los casos extraídos
        const casosJsonPath = path.join(baseDir, 'cypress/fixtures/casos_prueba.json');
        const casosJson = await fs.readFile(casosJsonPath, 'utf8');
        const casos = JSON.parse(casosJson);

        // Procesar cada sección
        for (const [seccion, casosPrueba] of Object.entries(casos)) {
            if (!seccion || seccion === '') continue;
            
            const nombreArchivo = seccion.toLowerCase()
                .replace(/[^a-z0-9]+/g, '_')
                .replace(/^_+|_+$/g, '')
                .replace(/_+/g, '_');
            
            if (!nombreArchivo || nombreArchivo === '') continue;
            
            console.log(`\n🔧 Procesando sección: ${seccion}`);
            
            // Generar y guardar el archivo .feature
            const featureContent = templates.feature(seccion, casosPrueba, stepIndexer);
            const featurePath = path.join(baseDir, 'cypress/e2e/features/generated', `${nombreArchivo}.feature`);
            await fs.writeFile(featurePath, featureContent);
            console.log(`✅ Generado feature: ${path.relative(baseDir, featurePath)}`);

            // Generar y guardar el archivo de steps (solo si hay steps nuevos)
            const stepsContent = templates.steps(seccion, featureContent, stepIndexer);
            const stepsPath = path.join(baseDir, 'cypress/e2e/step_definitions/generated', `${nombreArchivo}Steps.js`);
            await fs.writeFile(stepsPath, stepsContent);
            console.log(`✅ Generado steps: ${path.relative(baseDir, stepsPath)}`);

            // Generar y guardar el Page Object (solo si no existe)
            const pageObjectContent = templates.pageObject(seccion, stepIndexer);
            if (pageObjectContent) {
                const pagePath = path.join(baseDir, 'cypress/pages/generated', `${nombreArchivo}Page.js`);
                await fs.writeFile(pagePath, pageObjectContent);
                console.log(`✅ Generado page object: ${path.relative(baseDir, pagePath)}`);
            }
        }

        console.log('\n✅ Generación de archivos completada exitosamente');
        console.log('\n📋 Resumen de optimizaciones:');
        console.log(`   • Steps reutilizados: ${stepIndexer.existingSteps.size}`);
        console.log(`   • Page Objects existentes respetados: ${stepIndexer.existingPageObjects.size}`);
        console.log('   • Se evitaron duplicaciones de código');
        console.log('   • Se mantuvieron las implementaciones existentes');
        
    } catch (error) {
        console.error('❌ Error durante la generación:', error);
        console.error(error.stack);
        process.exit(1);
    }
}

main();