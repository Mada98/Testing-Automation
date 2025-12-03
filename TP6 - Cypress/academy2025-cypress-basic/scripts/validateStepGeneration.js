const fs = require('fs').promises;
const path = require('path');

/**
 * 🔍 VALIDADOR DE GENERACIÓN DE STEPS
 * 
 * Este script verifica que los generadores no produzcan steps problemáticos:
 * 1. ❌ NO usar "And" como default en step definitions (.js)
 * 2. ❌ NO usar "Y" en lugar de "And" 
 * 3. ✅ Usar solo Given/When/Then en step definitions
 * 4. ✅ Validar que "And" solo se use en archivos .feature
 */

class StepGenerationValidator {
    constructor() {
        this.baseDir = path.join(__dirname, '..');
        this.scriptsDir = path.join(__dirname);
        this.stepsDir = path.join(this.baseDir, 'cypress/e2e/step_definitions');
        
        this.errors = [];
        this.warnings = [];
        
        // Patrones problemáticos a detectar en generadores
        this.problematicPatterns = {
            // Asignaciones incorrectas de "And"
            andAsDefault: /return\s+['"`]And['"`]|stepType\s*=\s*['"`]And['"`]/g,
            
            // Uso de "Y" en lugar de "And"
            yInsteadOfAnd: /\bY\s*\(\s*['"`]/g,
            
            // Default problemático
            defaultAnd: /default.*And/gi,
            
            // Asignaciones directas problemáticas
            directAndAssignment: /['"`]Ingreso['"`]\s*\?\s*['"`]And['"`]/g
        };
        
        // Archivos generadores a verificar
        this.generatorFiles = [
            'intelligentStepGenerator.js',
            'cypressTestGenerator.js', 
            'Analizar/generateTests.js',
            'unifiedScraperProcessor.js',
            'masterOrchestrator.js'
        ];
    }

    async validateAllGenerators() {
        console.log('🔍 VALIDANDO GENERADORES DE STEPS...\n');
        
        let hasErrors = false;
        
        for (const file of this.generatorFiles) {
            const filePath = path.join(this.scriptsDir, file);
            
            try {
                const result = await this.validateGeneratorFile(filePath);
                if (result.errors.length > 0) {
                    hasErrors = true;
                }
            } catch (error) {
                console.log(`❌ Error validando ${file}: ${error.message}`);
                hasErrors = true;
            }
        }
        
        console.log('\n📊 RESUMEN DE VALIDACIÓN:');
        console.log(`   ✅ Archivos verificados: ${this.generatorFiles.length}`);
        console.log(`   ❌ Errores encontrados: ${this.errors.length}`);
        console.log(`   ⚠️ Advertencias: ${this.warnings.length}`);
        
        if (hasErrors) {
            console.log('\n🚨 SE ENCONTRARON PROBLEMAS EN LOS GENERADORES');
            this.errors.forEach(error => console.log(`   ❌ ${error}`));
            return false;
        } else {
            console.log('\n🎉 ¡TODOS LOS GENERADORES ESTÁN CORRECTOS!');
            return true;
        }
    }

    async validateGeneratorFile(filePath) {
        const fileName = path.basename(filePath);
        console.log(`🔍 Validando: ${fileName}`);
        
        const content = await fs.readFile(filePath, 'utf8');
        const fileErrors = [];
        const fileWarnings = [];
        
        // Verificar patrones problemáticos
        for (const [patternName, regex] of Object.entries(this.problematicPatterns)) {
            const matches = content.match(regex);
            if (matches) {
                const error = `${fileName}: Patrón problemático "${patternName}" encontrado: ${matches.length} ocurrencias`;
                fileErrors.push(error);
                this.errors.push(error);
            }
        }
        
        // Verificaciones específicas por archivo
        await this.performSpecificValidations(filePath, content, fileErrors, fileWarnings);
        
        if (fileErrors.length === 0) {
            console.log(`   ✅ ${fileName} - Sin problemas`);
        } else {
            console.log(`   ❌ ${fileName} - ${fileErrors.length} problemas encontrados`);
            fileErrors.forEach(error => console.log(`      ${error}`));
        }
        
        return { errors: fileErrors, warnings: fileWarnings };
    }

    async performSpecificValidations(filePath, content, errors, warnings) {
        const fileName = path.basename(filePath);
        
        // Validación específica para intelligentStepGenerator.js
        if (fileName === 'intelligentStepGenerator.js') {
            if (content.includes('return \'And\';')) {
                errors.push(`${fileName}: Usa 'And' como default en determineStepType`);
            }
        }
        
        // Validación para generateTests.js
        if (fileName === 'generateTests.js') {
            if (content.includes('? \'And\'')) {
                errors.push(`${fileName}: Asigna 'And' a steps que empiezan con 'Ingreso'`);
            }
        }
        
        // Validación para cypressTestGenerator.js
        if (fileName === 'cypressTestGenerator.js') {
            if (content.includes('? \'And\'')) {
                errors.push(`${fileName}: Asigna 'And' incorrectamente en ternary operator`);
            }
        }
        
        // Verificar que no se use "And" como step type en generadores
        const andStepMatches = content.match(/stepType\s*=\s*['"`]And['"`]/g);
        if (andStepMatches) {
            errors.push(`${fileName}: Asigna stepType = 'And' directamente (${andStepMatches.length} veces)`);
        }
        
        // Verificar funciones de determinación de tipo
        if (content.includes('determineStepType') && content.includes('return \'And\'')) {
            errors.push(`${fileName}: función determineStepType retorna 'And' como default`);
        }
    }

    async validateExistingSteps() {
        console.log('\n🔍 Validando steps existentes...');
        
        try {
            const files = await fs.readdir(this.stepsDir);
            const jsFiles = files.filter(f => f.endsWith('.js'));
            
            let problemsFound = 0;
            
            for (const file of jsFiles) {
                const filePath = path.join(this.stepsDir, file);
                const content = await fs.readFile(filePath, 'utf8');
                
                // Verificar "Y(" en lugar de "And("
                const yMatches = content.match(/\bY\s*\(/g);
                if (yMatches) {
                    console.log(`   ⚠️ ${file}: ${yMatches.length} steps con "Y(" en lugar de "And("`);
                    problemsFound += yMatches.length;
                }
                
                // Verificar texto que empieza con "Y "
                const yTextMatches = content.match(/(Given|When|Then|And)\s*\(\s*['"`]Y\s+/g);
                if (yTextMatches) {
                    console.log(`   ⚠️ ${file}: ${yTextMatches.length} steps con texto que empieza con "Y "`);
                    problemsFound += yTextMatches.length;
                }
            }
            
            if (problemsFound === 0) {
                console.log('   ✅ No se encontraron problemas en steps existentes');
            } else {
                console.log(`   ⚠️ Total de problemas encontrados: ${problemsFound}`);
            }
            
            return problemsFound === 0;
        } catch (error) {
            console.log(`   ❌ Error validando steps: ${error.message}`);
            return false;
        }
    }
}

// ============================================================================
// FUNCIÓN PRINCIPAL
// ============================================================================
async function main() {
    const validator = new StepGenerationValidator();
    
    try {
        console.log('🚀 INICIANDO VALIDACIÓN COMPLETA DE GENERACIÓN DE STEPS\n');
        
        // Validar generadores
        const generatorsValid = await validator.validateAllGenerators();
        
        // Validar steps existentes
        const stepsValid = await validator.validateExistingSteps();
        
        console.log('\n' + '='.repeat(60));
        
        if (generatorsValid && stepsValid) {
            console.log('🎉 ¡VALIDACIÓN EXITOSA!');
            console.log('✅ Los generadores están configurados correctamente');
            console.log('✅ Los steps existentes no tienen problemas');
            console.log('\n🚀 Es seguro ejecutar la generación de tests');
            process.exit(0);
        } else {
            console.log('🚨 ¡VALIDACIÓN FALLIDA!');
            if (!generatorsValid) {
                console.log('❌ Los generadores tienen problemas que deben corregirse');
            }
            if (!stepsValid) {
                console.log('❌ Los steps existentes tienen problemas');
            }
            console.log('\n⚠️ NO ejecutar generación hasta corregir problemas');
            process.exit(1);
        }
        
    } catch (error) {
        console.error('❌ Error durante la validación:', error);
        process.exit(1);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    main();
}

module.exports = { StepGenerationValidator }; 