const fs = require('fs').promises;
const path = require('path');

// Diccionario de traducciones para mejorar los pasos
const translations = {
    'Click on read more button in home page': 'Hago click en el botón Read More en la página principal',
    'Click on Sale written product in home page': 'Hago click en el producto marcado como Sale en la página principal',
    'Click on the Add To Basket button which adds that book to your basket': 'Hago click en el botón Add To Basket para agregar el libro al carrito',
    'Now click on Proceed to Check out button which navigates to payment gateway page.': 'Hago click en el botón Proceed to Checkout para ir a la página de pago',
    'Now click on Item link which navigates to proceed to check out page.': 'Hago click en el enlace Item para ir a la página de checkout',
    'on clicking place order button user completes his process where the page navigates to order confirmation page with order details,bank details,customer details and billing details.': 'al hacer click en Place Order se completa el proceso y navega a la página de confirmación con todos los detalles',
    'on clicking place order button user completes his process where the page navigates to order confirmation pagewith order details,bank details,customer details and billing details': 'al hacer click en Place Order se completa el proceso y navega a la página de confirmación con todos los detalles',
    'the tax rate variers for india compared to other countries': 'la tasa de impuestos varía para India comparado con otros países',
    'tax rate for indian should be 2% and for abroad it should be 5%': 'la tasa de impuestos para India debe ser 2% y para el extranjero 5%'
};

// Función para limpiar y mejorar un archivo .feature
async function cleanupFeatureFile(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf8');
        let cleanedContent = content;

        // Aplicar traducciones
        Object.entries(translations).forEach(([english, spanish]) => {
            const regex = new RegExp(english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            cleanedContent = cleanedContent.replace(regex, spanish);
        });

        // Limpiar pasos duplicados o vacíos
        const lines = cleanedContent.split('\n');
        const cleanedLines = [];
        let inScenario = false;
        let scenarioSteps = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            if (line.trim().startsWith('Scenario Outline:')) {
                inScenario = true;
                scenarioSteps = [];
                cleanedLines.push(line);
            } else if (line.trim().startsWith('Examples:')) {
                inScenario = false;
                // Solo agregar pasos únicos
                const uniqueSteps = [...new Set(scenarioSteps)];
                cleanedLines.push(...uniqueSteps);
                cleanedLines.push('');
                cleanedLines.push(line);
            } else if (inScenario && line.trim().match(/^\s*(Given|When|Then|And)\s+/)) {
                // Es un paso de Gherkin
                if (!scenarioSteps.includes(line)) {
                    scenarioSteps.push(line);
                }
            } else {
                cleanedLines.push(line);
            }
        }

        // Eliminar líneas vacías excesivas
        const finalContent = cleanedLines
            .join('\n')
            .replace(/\n\s*\n\s*\n/g, '\n\n') // Máximo 2 líneas vacías consecutivas
            .replace(/^\s*\n/, '') // Eliminar líneas vacías al inicio
            .replace(/\s*$/, '\n'); // Asegurar una línea vacía al final

        await fs.writeFile(filePath, finalContent);
        console.log(`✅ Limpiado: ${path.basename(filePath)}`);
        
        return true;
    } catch (error) {
        console.error(`❌ Error limpiando ${filePath}:`, error.message);
        return false;
    }
}

// Función principal
async function main() {
    try {
        const baseDir = path.join(__dirname, '..');
        const featuresDir = path.join(baseDir, 'cypress/e2e/features/generated');
        
        console.log('🧹 Iniciando limpieza de archivos .feature generados...');
        
        const files = await fs.readdir(featuresDir);
        const featureFiles = files.filter(file => file.endsWith('.feature'));
        
        let successCount = 0;
        
        for (const file of featureFiles) {
            const filePath = path.join(featuresDir, file);
            const success = await cleanupFeatureFile(filePath);
            if (success) successCount++;
        }
        
        console.log(`\n🎉 Limpieza completada: ${successCount}/${featureFiles.length} archivos procesados exitosamente`);
        console.log('\n📋 Mejoras aplicadas:');
        console.log('   • Traducciones de pasos en inglés a español');
        console.log('   • Eliminación de pasos duplicados');
        console.log('   • Limpieza de líneas vacías excesivas');
        console.log('   • Formato consistente de archivos .feature');
        
    } catch (error) {
        console.error('❌ Error durante la limpieza:', error);
        process.exit(1);
    }
}

main(); 