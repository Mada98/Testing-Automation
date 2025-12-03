const fs = require('fs').promises;
const path = require('path');

// Función para corregir imports problemáticos
async function fixImportsInFile(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf8');
        let fixedContent = content;
        
        // Reemplazar imports problemáticos
        const problematicImports = [
            {
                old: /import\s+MyAccountPage\s+from\s+['"].*MyAccountPage['"];?/g,
                new: '// import MyAccountPage from \'../../pages/generated/my_account_loginPage\'; // Corregido automáticamente'
            },
            {
                old: /import\s+SHOPPage\s+from\s+['"].*SHOPPage['"];?/g,
                new: 'import ShopPage from \'../../pages/ShopPage\'; // Corregido automáticamente'
            },
            {
                old: /import\s+HOMEPAGEPage\s+from\s+['"].*HOMEPAGEPage['"];?/g,
                new: 'import HomePage from \'../../pages/HomePage\'; // Corregido automáticamente'
            }
        ];
        
        // Aplicar correcciones de imports
        problematicImports.forEach(({ old, new: replacement }) => {
            fixedContent = fixedContent.replace(old, replacement);
        });
        
        // Reemplazar llamadas a page objects inexistentes con implementaciones directas
        const methodReplacements = [
            {
                old: /MyAccountPage\.hacerClickEnElMenuMyAccount\(\);?/g,
                new: 'cy.get(\'#menu-item-50\').click();'
            },
            {
                old: /MyAccountPage\.ingresoElUsuarioRegistradoEnElCampoUsername\(\);?/g,
                new: 'cy.get(\'#username\').type(\'usuario_registrado\');'
            },
            {
                old: /MyAccountPage\.ingresoLaContrasenaEnElCampoPassword\(\);?/g,
                new: 'cy.get(\'#password\').type(\'contraseña_segura\');'
            },
            {
                old: /MyAccountPage\.hacerClickEnElBotonDeLogin\(\);?/g,
                new: 'cy.get(\'button[name="login"]\').click();'
            },
            {
                old: /MyAccountPage\.hacerClickEnElEnlaceMyAccount\(\);?/g,
                new: 'cy.get(\'.woocommerce-MyAccount-navigation-link--dashboard a\').click();'
            },
            {
                old: /MyAccountPage\.verificoQuePuedoVerElDashboard\(\);?/g,
                new: 'cy.get(\'.woocommerce-MyAccount-content\').should(\'be.visible\');'
            },
            {
                old: /MyAccountPage\.hacerClickEnElEnlaceOrders\(\);?/g,
                new: 'cy.get(\'.woocommerce-MyAccount-navigation-link--orders a\').click();'
            },
            {
                old: /MyAccountPage\.verificoQuePuedoVerMisPedidos\(\);?/g,
                new: 'cy.get(\'.woocommerce-order-details\').should(\'be.visible\');'
            },
            {
                old: /MyAccountPage\.hacerClickEnElBotonView\(\);?/g,
                new: 'cy.get(\'.woocommerce-orders-table__cell-order-actions .button.view\').first().click();'
            },
            {
                old: /MyAccountPage\.verificoQuePuedoVerLosDetallesDelPedidoClienteYFacturacion\(\);?/g,
                new: 'cy.get(\'.woocommerce-order-details\').should(\'be.visible\'); cy.get(\'.woocommerce-customer-details\').should(\'be.visible\');'
            },
            {
                old: /MyAccountPage\.verificoQuePuedoVerElNumeroDePedidoFechaYEstado\(\);?/g,
                new: 'cy.get(\'.order-number\').should(\'be.visible\'); cy.get(\'.order-date\').should(\'be.visible\');'
            },
            {
                old: /MyAccountPage\.hacerClickEnElEnlaceAddress\(\);?/g,
                new: 'cy.get(\'.woocommerce-MyAccount-navigation-link--edit-address a\').click();'
            },
            {
                old: /MyAccountPage\.verificoQuePuedoVerLasDireccionesDeFacturacionYEnvio\(\);?/g,
                new: 'cy.get(\'.woocommerce-address-fields\').should(\'be.visible\');'
            },
            {
                old: /MyAccountPage\.hacerClickEnEditarDireccionDeEnvio\(\);?/g,
                new: 'cy.get(\'.edit-shipping\').click();'
            },
            {
                old: /MyAccountPage\.verificoQuePuedoEditarLaDireccionDeEnvio\(\);?/g,
                new: 'cy.get(\'.shipping_address\').should(\'be.visible\');'
            },
            {
                old: /MyAccountPage\.hacerClickEnAccountDetails\(\);?/g,
                new: 'cy.get(\'.woocommerce-MyAccount-navigation-link--edit-account a\').click();'
            },
            {
                old: /MyAccountPage\.verificoQuePuedoVerYCambiarLosDetallesDeLaCuenta\(\);?/g,
                new: 'cy.get(\'.woocommerce-MyAccount-content\').should(\'be.visible\');'
            },
            {
                old: /MyAccountPage\.hacerClickEnElBotonLogout\(\);?/g,
                new: 'cy.get(\'.woocommerce-MyAccount-navigation-link--customer-logout a\').click();'
            },
            {
                old: /MyAccountPage\.verificoQueSaliExitosamenteDelSitio\(\);?/g,
                new: 'cy.url().should(\'not.contain\', \'my-account\');'
            },
            // Correcciones para SHOPPage
            {
                old: /SHOPPage\./g,
                new: 'ShopPage.'
            },
            // Correcciones para HOMEPAGEPage
            {
                old: /HOMEPAGEPage\./g,
                new: 'HomePage.'
            }
        ];
        
        // Aplicar reemplazos de métodos
        methodReplacements.forEach(({ old, new: replacement }) => {
            fixedContent = fixedContent.replace(old, replacement);
        });
        
        await fs.writeFile(filePath, fixedContent);
        console.log(`✅ Corregido: ${path.basename(filePath)}`);
        
        return true;
    } catch (error) {
        console.error(`❌ Error corrigiendo ${filePath}:`, error.message);
        return false;
    }
}

// Función principal
async function main() {
    try {
        const baseDir = path.join(__dirname, '..');
        const stepsDir = path.join(baseDir, 'cypress/e2e/step_definitions');
        
        console.log('🔧 Corrigiendo imports problemáticos en archivos de steps...\n');
        
        // Obtener todos los archivos .js en step_definitions
        const files = await fs.readdir(stepsDir);
        const jsFiles = files.filter(file => file.endsWith('.js'));
        
        // También revisar archivos en generated
        const generatedDir = path.join(stepsDir, 'generated');
        try {
            const generatedFiles = await fs.readdir(generatedDir);
            const generatedJsFiles = generatedFiles
                .filter(file => file.endsWith('.js'))
                .map(file => path.join('generated', file));
            jsFiles.push(...generatedJsFiles);
        } catch (error) {
            console.log('⚠️ No se encontró directorio generated o está vacío');
        }
        
        let successCount = 0;
        
        for (const file of jsFiles) {
            const filePath = path.join(stepsDir, file);
            const success = await fixImportsInFile(filePath);
            if (success) successCount++;
        }
        
        console.log(`\n🎉 Corrección completada: ${successCount}/${jsFiles.length} archivos procesados`);
        console.log('\n📋 Correcciones aplicadas:');
        console.log('   • Imports problemáticos corregidos');
        console.log('   • Llamadas a page objects inexistentes reemplazadas');
        console.log('   • Implementaciones directas con Cypress commands');
        console.log('\n💡 Recomendación: Ejecutar las pruebas para verificar funcionamiento');
        
    } catch (error) {
        console.error('❌ Error durante la corrección:', error);
        process.exit(1);
    }
}

main(); 