const fs = require('fs').promises;
const path = require('path');

// Mapeo de steps problemáticos a implementaciones correctas
const stepMappings = {
    // Steps de Home Page
    'Hago click en el botón del menú Home': 'cy.get(\'#menu-item-40\').click();',
    'Verifico que la página Home tiene solo tres sliders': 'cy.get(\'.slider\').should(\'have.length\', 3);',
    'Verifico que la página Home tiene solo tres llegadas': 'cy.get(\'.arrivals\').should(\'have.length\', 3);',
    'Hago click en la imagen de las llegadas': 'cy.get(\'.arrivals img\').first().click();',
    'Hago click en la pestaña Description del libro seleccionado': 'cy.get(\'[data-tab="description"]\').click();',
    'Hago click en el botón Add To Basket para agregar el libro al carrito': 'cy.get(\'.add_to_cart_button\').click();',
    'Hago click en el botón add to basket': 'cy.get(\'.add_to_cart_button\').click();',
    
    // Steps de Shop
    'Ingreso al shop': 'cy.get(\'#menu-item-shop\').click();',
    'Busco por rango de precio, de medio a mayor': 'cy.get(\'.price_slider\').trigger(\'mousedown\');',
    'Hago click en el botón Filter': 'cy.get(\'.price_slider_amount button\').click();',
    'Agrego {int} productos al carrito': 'cy.get(\'.add_to_cart_button\').click();',
    
    // Steps comunes
    'Navego al sitio automationtesting': 'cy.visit(\'/\');',
    'Espero que la página esté cargada': 'cy.get(\'body\').should(\'be.visible\'); cy.get(\'#menu-item-50\').should(\'be.visible\');'
};

// Función para corregir archivos .feature
async function fixFeatureFile(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf8');
        let fixedContent = content;
        
        // Correcciones específicas para archivos .feature
        const featureCorrections = [
            // Eliminar "Verifico que" duplicados
            {
                old: /Then Verifico que Verifico que/g,
                new: 'Then Verifico que'
            },
            // Corregir steps en inglés mezclados
            {
                old: /When Now click on Home menu button/g,
                new: 'When Hago click en el botón del menú Home'
            },
            {
                old: /When Test whether the Home page has Three Sliders only/g,
                new: 'When Verifico que la página Home tiene solo tres sliders'
            },
            {
                old: /When Test whether the Home page has Three Arrivals only/g,
                new: 'When Verifico que la página Home tiene solo tres llegadas'
            },
            {
                old: /When Now click the image in the Arrivals/g,
                new: 'When Hago click en la imagen de las llegadas'
            },
            {
                old: /When Click on Description tab for the book you clicked on\./g,
                new: 'When Hago click en la pestaña Description del libro seleccionado'
            },
            {
                old: /When Click on the Add To Basket button which adds that book to your basket/g,
                new: 'When Hago click en el botón Add To Basket para agregar el libro al carrito'
            },
            {
                old: /When Click the add to basket button/g,
                new: 'When Hago click en el botón add to basket'
            },
            // Corregir Then statements problemáticos
            {
                old: /Then Verifico que the home page must contains only three sliders/g,
                new: 'Then Verifico que la página contiene solo tres sliders'
            },
            {
                old: /Then Verifico que the home page must contains only three arrivals/g,
                new: 'Then Verifico que la página contiene solo tres llegadas'
            },
            {
                old: /Then Verifico que test whether it is navigating to next page where the user can add that book into his basket\./g,
                new: 'Then Verifico que navega a la página donde puedo agregar el libro al carrito'
            },
            {
                old: /Then Verifico que image should be clickable and shoul navigate to next page where user can add that book to his basket/g,
                new: 'Then Verifico que la imagen es clickeable y navega a la siguiente página'
            },
            {
                old: /Then Verifico que there should be a description regarding that book the user clicked on/g,
                new: 'Then Verifico que hay una descripción del libro seleccionado'
            },
            {
                old: /Then Verifico que there should be a reviews regarding that book the user clicked on/g,
                new: 'Then Verifico que hay reseñas del libro seleccionado'
            },
            {
                old: /Then Verifico que user can add a book by clicking on add to basket button which adds that book in to his basket/g,
                new: 'Then Verifico que puedo agregar un libro haciendo click en Add To Basket'
            },
            {
                old: /Then Verifico que now it throws an error prompt like you must enter a value between 1 and 20/g,
                new: 'Then Verifico que muestra un error indicando que debo ingresar un valor entre 1 y 20'
            },
            {
                old: /Then Verifico que user can click on the item link in menu item after adding the book in to the basket which leads to the check out page/g,
                new: 'Then Verifico que puedo hacer click en el enlace Item después de agregar el libro al carrito'
            }
        ];
        
        // Aplicar correcciones
        featureCorrections.forEach(({ old, new: replacement }) => {
            fixedContent = fixedContent.replace(old, replacement);
        });
        
        await fs.writeFile(filePath, fixedContent);
        console.log(`✅ Feature corregido: ${path.basename(filePath)}`);
        return true;
    } catch (error) {
        console.error(`❌ Error corrigiendo feature ${filePath}:`, error.message);
        return false;
    }
}

// Función para corregir archivos de steps
async function fixStepsFile(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf8');
        let fixedContent = content;
        
        // Agregar steps faltantes al archivo
        const missingSteps = [
            `
When('Hago click en el botón del menú Home', () => {
    cy.log('🔍 Ejecutando: Hago click en el botón del menú Home');
    cy.get('#menu-item-40').click();
});`,
            `
When('Verifico que la página Home tiene solo tres sliders', () => {
    cy.log('🔍 Ejecutando: Verifico que la página Home tiene solo tres sliders');
    cy.get('.slider').should('have.length', 3);
});`,
            `
When('Verifico que la página Home tiene solo tres llegadas', () => {
    cy.log('🔍 Ejecutando: Verifico que la página Home tiene solo tres llegadas');
    cy.get('.arrivals').should('have.length', 3);
});`,
            `
When('Hago click en la imagen de las llegadas', () => {
    cy.log('🔍 Ejecutando: Hago click en la imagen de las llegadas');
    cy.get('.arrivals img').first().click();
});`,
            `
When('Hago click en la pestaña Description del libro seleccionado', () => {
    cy.log('🔍 Ejecutando: Hago click en la pestaña Description del libro seleccionado');
    cy.get('[data-tab="description"]').click();
});`,
            `
When('Hago click en el botón Add To Basket para agregar el libro al carrito', () => {
    cy.log('🔍 Ejecutando: Hago click en el botón Add To Basket para agregar el libro al carrito');
    cy.get('.add_to_cart_button').click();
});`,
            `
When('Hago click en el botón add to basket', () => {
    cy.log('🔍 Ejecutando: Hago click en el botón add to basket');
    cy.get('.add_to_cart_button').click();
});`,
            `
Then('Verifico que la página contiene solo tres sliders', () => {
    cy.log('🔍 Ejecutando: Verifico que la página contiene solo tres sliders');
    cy.get('.slider').should('have.length', 3);
});`,
            `
Then('Verifico que la página contiene solo tres llegadas', () => {
    cy.log('🔍 Ejecutando: Verifico que la página contiene solo tres llegadas');
    cy.get('.arrivals').should('have.length', 3);
});`,
            `
Then('Verifico que navega a la página donde puedo agregar el libro al carrito', () => {
    cy.log('🔍 Ejecutando: Verifico que navega a la página donde puedo agregar el libro al carrito');
    cy.url().should('contain', 'product');
    cy.get('.add_to_cart_button').should('be.visible');
});`,
            `
Then('Verifico que la imagen es clickeable y navega a la siguiente página', () => {
    cy.log('🔍 Ejecutando: Verifico que la imagen es clickeable y navega a la siguiente página');
    cy.url().should('contain', 'product');
});`,
            `
Then('Verifico que hay una descripción del libro seleccionado', () => {
    cy.log('🔍 Ejecutando: Verifico que hay una descripción del libro seleccionado');
    cy.get('.description').should('be.visible');
});`,
            `
Then('Verifico que hay reseñas del libro seleccionado', () => {
    cy.log('🔍 Ejecutando: Verifico que hay reseñas del libro seleccionado');
    cy.get('.reviews').should('be.visible');
});`,
            `
Then('Verifico que puedo agregar un libro haciendo click en Add To Basket', () => {
    cy.log('🔍 Ejecutando: Verifico que puedo agregar un libro haciendo click en Add To Basket');
    cy.get('.cart-contents-count').should('be.visible');
});`,
            `
Then('Verifico que muestra un error indicando que debo ingresar un valor entre 1 y 20', () => {
    cy.log('🔍 Ejecutando: Verifico que muestra un error indicando que debo ingresar un valor entre 1 y 20');
    cy.get('.woocommerce-error').should('contain.text', 'value between 1 and');
});`,
            `
Then('Verifico que puedo hacer click en el enlace Item después de agregar el libro al carrito', () => {
    cy.log('🔍 Ejecutando: Verifico que puedo hacer click en el enlace Item después de agregar el libro al carrito');
    cy.get('.cart-contents').should('be.visible');
    cy.url().should('contain', 'cart');
});`
        ];
        
        // Agregar steps faltantes al final del archivo
        const stepsToAdd = missingSteps.filter(step => {
            const stepName = step.match(/When\('([^']+)'/)?.[1] || step.match(/Then\('([^']+)'/)?.[1];
            return stepName && !fixedContent.includes(stepName);
        });
        
        if (stepsToAdd.length > 0) {
            fixedContent += '\n\n// Steps agregados automáticamente para corregir problemas\n';
            fixedContent += stepsToAdd.join('\n');
        }
        
        await fs.writeFile(filePath, fixedContent);
        console.log(`✅ Steps corregido: ${path.basename(filePath)} (${stepsToAdd.length} steps agregados)`);
        return true;
    } catch (error) {
        console.error(`❌ Error corrigiendo steps ${filePath}:`, error.message);
        return false;
    }
}

// Función para mover archivos de generated/ al directorio principal
async function moveGeneratedFiles(baseDir) {
    try {
        const generatedStepsDir = path.join(baseDir, 'cypress/e2e/step_definitions/generated');
        const mainStepsDir = path.join(baseDir, 'cypress/e2e/step_definitions');
        
        const files = await fs.readdir(generatedStepsDir);
        const jsFiles = files.filter(file => file.endsWith('.js'));
        
        for (const file of jsFiles) {
            const sourcePath = path.join(generatedStepsDir, file);
            const destPath = path.join(mainStepsDir, `generated_${file}`);
            
            // Leer, corregir y escribir en nueva ubicación
            const content = await fs.readFile(sourcePath, 'utf8');
            await fs.writeFile(destPath, content);
            console.log(`📁 Movido: ${file} → generated_${file}`);
        }
        
        return true;
    } catch (error) {
        console.error('❌ Error moviendo archivos:', error.message);
        return false;
    }
}

// Función principal
async function main() {
    try {
        const baseDir = path.join(__dirname, '..');
        
        console.log('🔧 Iniciando corrección integral de archivos generados...\n');
        
        // 1. Corregir archivos .feature
        console.log('📝 Corrigiendo archivos .feature...');
        const featuresDir = path.join(baseDir, 'cypress/e2e/features/generated');
        const featureFiles = await fs.readdir(featuresDir);
        const featureFilesToFix = featureFiles.filter(file => file.endsWith('.feature'));
        
        let featureSuccessCount = 0;
        for (const file of featureFilesToFix) {
            const filePath = path.join(featuresDir, file);
            const success = await fixFeatureFile(filePath);
            if (success) featureSuccessCount++;
        }
        
        // 2. Corregir archivos de steps
        console.log('\n🔧 Corrigiendo archivos de steps...');
        const stepsDir = path.join(baseDir, 'cypress/e2e/step_definitions/generated');
        const stepFiles = await fs.readdir(stepsDir);
        const stepFilesToFix = stepFiles.filter(file => file.endsWith('.js'));
        
        let stepsSuccessCount = 0;
        for (const file of stepFilesToFix) {
            const filePath = path.join(stepsDir, file);
            const success = await fixStepsFile(filePath);
            if (success) stepsSuccessCount++;
        }
        
        // 3. Mover archivos para que Cypress los detecte
        console.log('\n📁 Moviendo archivos para detección de Cypress...');
        await moveGeneratedFiles(baseDir);
        
        console.log('\n🎉 Corrección completada exitosamente!');
        console.log(`📊 Resumen:`);
        console.log(`   • Features corregidos: ${featureSuccessCount}/${featureFilesToFix.length}`);
        console.log(`   • Steps corregidos: ${stepsSuccessCount}/${stepFilesToFix.length}`);
        console.log(`   • Archivos movidos para detección de Cypress`);
        console.log('\n💡 Recomendaciones:');
        console.log('   1. Ejecutar las pruebas para verificar funcionamiento');
        console.log('   2. Revisar logs de Cypress para steps faltantes');
        console.log('   3. Ajustar selectores CSS según la aplicación real');
        
    } catch (error) {
        console.error('❌ Error durante la corrección:', error);
        process.exit(1);
    }
}

main(); 