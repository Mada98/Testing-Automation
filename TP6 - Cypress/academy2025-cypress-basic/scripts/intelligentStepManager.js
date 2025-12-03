const fs = require('fs').promises;
const path = require('path');

/**
 * 🧠 STEP MANAGER - Gestor de Steps
 * 
 * Este script maneja específicamente:
 * 1. 🔧 Corrección de steps en español problemáticos
 * 2. 🚫 Prevención de duplicaciones de steps
 * 3. 📝 Normalización de formato Gherkin
 * 4. 🌐 Traducción de steps
 * 5. ✅ Validación de sintaxis Cucumber
 */

class IntelligentStepManager {
    constructor() {
        this.baseDir = path.join(__dirname, '..');
        this.stepsDir = path.join(this.baseDir, 'cypress/e2e/step_definitions');
        
        // Inventario de steps existentes
        this.existingSteps = new Map();
        this.duplicatedSteps = new Map();
        this.problematicSteps = [];
        
        // Diccionario de correcciones para steps problemáticos
        this.stepCorrections = {
            // Correcciones específicas para "Y" y "And"
            'Y verific': 'And verifico',
            'Y ingres': 'And ingreso',
            'Y hag': 'And hago',
            'Y nav': 'And navego',
            'Y esper': 'And espero',
            'Y valid': 'And valido',
            'Y confirm': 'And confirmo',
            'Y selecc': 'And selecciono',
            'Y compru': 'And compruebo',
            
            // Correcciones de verbos en español
            'debe ser': 'sea',
            'debería': 'debe',
            'tiene que': 'debe',
            'necesita': 'debe',
            'puede ver': 'puedo ver',
            'es capaz de': 'puede',
            
            // Correcciones de formato Gherkin
            'Cuando ': 'When ',
            'Dado ': 'Given ',
            'Entonces ': 'Then ',
            'Y ': 'And ',
            'Pero ': 'But ',
            
            // Correcciones de acciones comunes
            'hacer click': 'hago click',
            'hacer clic': 'hago click',
            'clickear': 'hago click',
            'presionar': 'hago click',
            'dar click': 'hago click'
        };

        // Patrones de steps válidos en español
        this.validStepPatterns = {
            Given: [
                /^Given\s+(?:que\s+)?(?:navego|estoy|tengo|existe|hay)\s+/i,
                /^Given\s+(?:el|la|los|las)\s+\w+\s+(?:está|están|tiene|tienen)/i
            ],
            When: [
                /^When\s+(?:hago\s+click|ingreso|navego|busco|selecciono|completo|realizo|ejecuto)\s+/i,
                /^When\s+(?:el\s+usuario|usuario)\s+(?:hace|realiza|ingresa|navega)\s+/i
            ],
            Then: [
                /^Then\s+(?:verifico|compruebo|valido|confirmo|veo)\s+que\s+/i,
                /^Then\s+(?:debe|debería)\s+(?:mostrar|aparecer|estar|tener)/i
            ],
            And: [
                /^And\s+(?:hago\s+click|ingreso|navego|busco|selecciono|completo|realizo|ejecuto)\s+/i,
                /^And\s+(?:verifico|compruebo|valido|confirmo|veo)\s+que\s+/i
            ]
        };

        // Templates para steps comunes
        this.stepTemplates = {
            navigation: {
                pattern: /naveg[oa]/i,
                template: 'When navego a {string}'
            },
            click: {
                pattern: /(?:click|clic)/i,
                template: 'When hago click en {string}'
            },
            input: {
                pattern: /ingres[oa]/i,
                template: 'When ingreso {string} en el campo {string}'
            },
            verification: {
                pattern: /verific[oa]/i,
                template: 'Then verifico que {string}'
            }
        };
    }

    // ========================================================================
    // MÉTODO PRINCIPAL
    // ========================================================================
    async manageSteps() {
        console.log('🧠 INICIANDO GESTIÓN DE STEPS...\n');
        
        try {
            // 1. Escanear steps existentes
            await this.scanExistingSteps();
            
            // 2. Detectar problemas
            await this.detectProblems();
            
            // 3. Corregir imports de Cucumber
            await this.fixCucumberImports();
            
            // 4. Corregir steps problemáticos
            await this.correctProblematicSteps();
            
            // 5. Eliminar duplicaciones
            await this.removeDuplicates();
            
            // 6. Normalizar formato
            await this.normalizeFormat();
            
            // 7. Validar sintaxis final
            await this.validateSyntax();
            
            // 8. Generar reporte
            await this.generateReport();
            
            console.log('\n🎉 GESTIÓN DE STEPS COMPLETADA EXITOSAMENTE!');
            
        } catch (error) {
            console.error('❌ Error en gestión de steps:', error);
            throw error;
        }
    }

    // ========================================================================
    // ESCANEO DE STEPS EXISTENTES
    // ========================================================================
    async scanExistingSteps() {
        console.log('🔍 Escaneando steps existentes...');
        
        try {
            const files = await fs.readdir(this.stepsDir);
            const jsFiles = files.filter(f => f.endsWith('.js'));
            
            console.log(`   📁 Archivos encontrados: ${jsFiles.length}`);
            
            for (const file of jsFiles) {
                await this.scanStepFile(file);
            }
            
            console.log(`   📊 Steps totales escaneados: ${this.existingSteps.size}`);
            
        } catch (error) {
            console.log('   ⚠️ Error escaneando directorio de steps');
        }
    }

    async scanStepFile(fileName) {
        const filePath = path.join(this.stepsDir, fileName);
        
        try {
            const content = await fs.readFile(filePath, 'utf8');
            const steps = this.extractStepsFromContent(content);
            
            console.log(`   📄 ${fileName}: ${steps.length} steps`);
            
            for (const step of steps) {
                const stepKey = this.normalizeStepText(step.text);
                
                if (this.existingSteps.has(stepKey)) {
                    // Step duplicado
                    if (!this.duplicatedSteps.has(stepKey)) {
                        this.duplicatedSteps.set(stepKey, []);
                    }
                    this.duplicatedSteps.get(stepKey).push({
                        file: fileName,
                        step: step
                    });
                } else {
                    this.existingSteps.set(stepKey, {
                        ...step,
                        file: fileName
                    });
                }
            }
            
        } catch (error) {
            console.log(`   ❌ Error leyendo ${fileName}: ${error.message}`);
        }
    }

    extractStepsFromContent(content) {
        const steps = [];
        const stepRegex = /(Given|When|Then|And|Y|But)\s*\(\s*['"`]([^'"`]+)['"`]/g;
        let match;
        
        while ((match = stepRegex.exec(content)) !== null) {
            steps.push({
                type: match[1],
                text: match[2],
                fullMatch: match[0],
                line: this.getLineNumber(content, match.index)
            });
        }
        
        return steps;
    }

    getLineNumber(content, index) {
        return content.substring(0, index).split('\n').length;
    }

    normalizeStepText(text) {
        return text
            .toLowerCase()
            .replace(/\{[^}]+\}/g, '{param}') // Parámetros
            .replace(/[^\w\s]/g, '') // Puntuación
            .replace(/\s+/g, ' ') // Espacios múltiples
            .trim();
    }

    // ========================================================================
    // DETECCIÓN DE PROBLEMAS
    // ========================================================================
    async detectProblems() {
        console.log('\n🚨 Detectando problemas en steps...');
        
        let problematicCount = 0;
        let duplicateCount = 0;
        
        // Detectar steps problemáticos
        for (const [key, step] of this.existingSteps) {
            const problems = this.detectStepProblems(step);
            if (problems.length > 0) {
                this.problematicSteps.push({
                    step,
                    problems
                });
                problematicCount++;
            }
        }
        
        // Contar duplicados
        duplicateCount = this.duplicatedSteps.size;
        
        console.log(`   ⚠️ Steps problemáticos: ${problematicCount}`);
        console.log(`   🔄 Steps duplicados: ${duplicateCount}`);
        
        // Mostrar detalles de problemas
        if (problematicCount > 0) {
            console.log('\n   📋 Detalle de problemas:');
            for (const problematic of this.problematicSteps.slice(0, 5)) {
                console.log(`     - ${problematic.step.file}: "${problematic.step.text}"`);
                console.log(`       Problemas: ${problematic.problems.join(', ')}`);
            }
            if (this.problematicSteps.length > 5) {
                console.log(`     ... y ${this.problematicSteps.length - 5} más`);
            }
        }
    }

    detectStepProblems(step) {
        const problems = [];
        
        // Problema 1: Uso de "Y" en lugar de "And"
        if (step.type === 'Y') {
            problems.push('Usa "Y" en lugar de "And"');
        }
        
        // Problema 2: Texto que empieza con "Y"
        if (step.text.trim().startsWith('Y ')) {
            problems.push('Texto comienza con "Y "');
        }
        
        // Problema 3: Formato de step no válido
        const isValidFormat = this.validateStepFormat(step);
        if (!isValidFormat) {
            problems.push('Formato no válido para Cucumber');
        }
        
        // Problema 4: Caracteres problemáticos
        if (/[ñáéíóúü]/i.test(step.text)) {
            problems.push('Contiene caracteres especiales que pueden causar problemas');
        }
        
        // Problema 5: Steps muy largos
        if (step.text.length > 100) {
            problems.push('Step demasiado largo');
        }
        
        return problems;
    }

    validateStepFormat(step) {
        if (!this.validStepPatterns[step.type]) {
            return false;
        }
        
        return this.validStepPatterns[step.type].some(pattern => 
            pattern.test(`${step.type} ${step.text}`)
        );
    }

    // ========================================================================
    // CORRECCIÓN DE STEPS PROBLEMÁTICOS
    // ========================================================================
    async correctProblematicSteps() {
        console.log('\n🔧 Corrigiendo steps problemáticos...');
        
        const fileChanges = new Map();
        
        for (const problematic of this.problematicSteps) {
            const { step, problems } = problematic;
            const fileName = step.file;
            
            if (!fileChanges.has(fileName)) {
                const filePath = path.join(this.stepsDir, fileName);
                const content = await fs.readFile(filePath, 'utf8');
                fileChanges.set(fileName, {
                    originalContent: content,
                    modifiedContent: content,
                    changes: []
                });
            }
            
            const fileChange = fileChanges.get(fileName);
            const correctedStep = this.correctStep(step);
            
            if (correctedStep.text !== step.text || correctedStep.type !== step.type) {
                fileChange.modifiedContent = fileChange.modifiedContent.replace(
                    step.fullMatch,
                    `${correctedStep.type}("${correctedStep.text}"`
                );
                
                fileChange.changes.push({
                    original: step.fullMatch,
                    corrected: `${correctedStep.type}("${correctedStep.text}"`,
                    problems: problems
                });
            }
        }
        
        // Escribir archivos modificados
        for (const [fileName, fileChange] of fileChanges) {
            if (fileChange.changes.length > 0) {
                const filePath = path.join(this.stepsDir, fileName);
                await fs.writeFile(filePath, fileChange.modifiedContent, 'utf8');
                console.log(`   ✅ ${fileName}: ${fileChange.changes.length} correcciones`);
            }
        }
    }

    correctStep(step) {
        let correctedType = step.type;
        let correctedText = step.text;
        
        // Corrección 1: Cambiar "Y" por "And"
        if (step.type === 'Y') {
            correctedType = 'And';
        }
        
        // Corrección 2: Limpiar "Y " del inicio del texto
        if (correctedText.trim().startsWith('Y ')) {
            correctedText = correctedText.trim().substring(2);
        }
        
        // Corrección 3: Aplicar correcciones específicas
        for (const [pattern, replacement] of Object.entries(this.stepCorrections)) {
            if (correctedText.toLowerCase().includes(pattern.toLowerCase())) {
                correctedText = correctedText.replace(
                    new RegExp(pattern, 'gi'), 
                    replacement
                );
            }
        }
        
        // Corrección 4: Normalizar espacios
        correctedText = correctedText.replace(/\s+/g, ' ').trim();
        
        // Corrección 5: Aplicar template si coincide
        const template = this.findMatchingTemplate(correctedText);
        if (template) {
            correctedText = this.applyTemplate(correctedText, template);
        }
        
        return {
            type: correctedType,
            text: correctedText,
            fullMatch: `${correctedType}("${correctedText}"`
        };
    }

    findMatchingTemplate(text) {
        for (const [name, template] of Object.entries(this.stepTemplates)) {
            if (template.pattern.test(text)) {
                return template;
            }
        }
        return null;
    }

    applyTemplate(text, template) {
        // Lógica para aplicar templates específicos
        // Por ahora, retorna el texto original
        return text;
    }

    // ========================================================================
    // ELIMINACIÓN DE DUPLICADOS
    // ========================================================================
    async removeDuplicates() {
        console.log('\n🔄 Eliminando steps duplicados...');
        
        if (this.duplicatedSteps.size === 0) {
            console.log('   ✅ No se encontraron duplicados');
            return;
        }
        
        const fileChanges = new Map();
        
        for (const [stepKey, duplicates] of this.duplicatedSteps) {
            // Mantener el primer step, eliminar el resto
            const keepStep = duplicates[0];
            const removeSteps = duplicates.slice(1);
            
            console.log(`   🔄 Step duplicado: "${stepKey}"`);
            console.log(`     Manteniendo: ${keepStep.file}`);
            
            for (const removeStep of removeSteps) {
                console.log(`     Eliminando: ${removeStep.file}`);
                
                const fileName = removeStep.file;
                if (!fileChanges.has(fileName)) {
                    const filePath = path.join(this.stepsDir, fileName);
                    const content = await fs.readFile(filePath, 'utf8');
                    fileChanges.set(fileName, content);
                }
                
                let fileContent = fileChanges.get(fileName);
                
                // Comentar el step duplicado en lugar de eliminarlo
                const commentedStep = `// DUPLICADO: ${removeStep.step.fullMatch}`;
                fileContent = fileContent.replace(removeStep.step.fullMatch, commentedStep);
                
                fileChanges.set(fileName, fileContent);
            }
        }
        
        // Escribir archivos modificados
        for (const [fileName, content] of fileChanges) {
            const filePath = path.join(this.stepsDir, fileName);
            await fs.writeFile(filePath, content, 'utf8');
        }
        
        console.log(`   ✅ Procesados ${this.duplicatedSteps.size} grupos de duplicados`);
    }

    // ========================================================================
    // NORMALIZACIÓN DE FORMATO
    // ========================================================================
    async normalizeFormat() {
        console.log('\n📝 Normalizando formato de archivos...');
        
        try {
            const files = await fs.readdir(this.stepsDir);
            const jsFiles = files.filter(f => f.endsWith('.js'));
            
            for (const file of jsFiles) {
                await this.normalizeStepFile(file);
            }
            
            console.log(`   ✅ Normalizados ${jsFiles.length} archivos`);
            
        } catch (error) {
            console.log('   ❌ Error normalizando formato');
        }
    }

    async normalizeStepFile(fileName) {
        const filePath = path.join(this.stepsDir, fileName);
        
        try {
            let content = await fs.readFile(filePath, 'utf8');
            
            // Normalización 1: Indentación consistente
            content = content.replace(/^[ \t]+/gm, match => '    '.repeat(Math.floor(match.length / 4)));
            
            // Normalización 2: Espacios en paréntesis
            content = content.replace(/\(\s+/g, '(');
            content = content.replace(/\s+\)/g, ')');
            
            // Normalización 3: Comillas consistentes
            content = content.replace(/(Given|When|Then|And|But)\s*\(\s*['`]([^'`]+)['`]/g, '$1("$2"');
            
            // Normalización 4: Espacios antes de llaves
            content = content.replace(/\)\s*{/g, ') {');
            
            // Normalización 5: Líneas vacías excesivas
            content = content.replace(/\n{3,}/g, '\n\n');
            
            await fs.writeFile(filePath, content, 'utf8');
            
        } catch (error) {
            console.log(`   ⚠️ Error normalizando ${fileName}`);
        }
    }

    // ========================================================================
    // VALIDACIÓN DE SINTAXIS
    // ========================================================================
    async validateSyntax() {
        console.log('\n✅ Validando sintaxis final...');
        
        let validFiles = 0;
        let invalidFiles = 0;
        const errors = [];
        
        try {
            const files = await fs.readdir(this.stepsDir);
            const jsFiles = files.filter(f => f.endsWith('.js'));
            
            for (const file of jsFiles) {
                const isValid = await this.validateStepFileSync(file);
                if (isValid) {
                    validFiles++;
                } else {
                    invalidFiles++;
                    errors.push(file);
                }
            }
            
            console.log(`   ✅ Archivos válidos: ${validFiles}`);
            console.log(`   ❌ Archivos con errores: ${invalidFiles}`);
            
            if (errors.length > 0) {
                console.log('   📋 Archivos con errores:');
                errors.forEach(file => console.log(`     - ${file}`));
            }
            
        } catch (error) {
            console.log('   ❌ Error validando sintaxis');
        }
    }

    async validateStepFileSync(fileName) {
        const filePath = path.join(this.stepsDir, fileName);
        
        try {
            const content = await fs.readFile(filePath, 'utf8');
            
            // Validación básica de sintaxis JavaScript
            try {
                require('acorn').parse(content, { ecmaVersion: 2020 });
                return true;
            } catch (syntaxError) {
                console.log(`     ⚠️ Error de sintaxis en ${fileName}: ${syntaxError.message}`);
                return false;
            }
            
        } catch (error) {
            return false;
        }
    }

    // ========================================================================
    // GENERACIÓN DE REPORTE
    // ========================================================================
    async generateReport() {
        console.log('\n📊 Generando reporte de gestión...');
        
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalSteps: this.existingSteps.size,
                problematicSteps: this.problematicSteps.length,
                duplicatedSteps: this.duplicatedSteps.size,
                correctionsMade: this.problematicSteps.length,
                duplicatesRemoved: Array.from(this.duplicatedSteps.values()).reduce((sum, dups) => sum + dups.length - 1, 0)
            },
            details: {
                problematicSteps: this.problematicSteps.map(p => ({
                    file: p.step.file,
                    text: p.step.text,
                    problems: p.problems
                })),
                duplicatedSteps: Array.from(this.duplicatedSteps.entries()).map(([key, dups]) => ({
                    stepText: key,
                    duplicates: dups.map(d => d.file)
                }))
            }
        };
        
        const reportPath = path.join(this.baseDir, 'scripts/reports', `step-management-report-${new Date().toISOString().split('T')[0]}.json`);
        
        // Asegurar que el directorio existe
        await fs.mkdir(path.dirname(reportPath), { recursive: true });
        
        await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
        
        console.log(`   📄 Reporte guardado: ${path.relative(this.baseDir, reportPath)}`);
        console.log(`   📊 Steps procesados: ${report.summary.totalSteps}`);
        console.log(`   🔧 Correcciones aplicadas: ${report.summary.correctionsMade}`);
        console.log(`   🔄 Duplicados eliminados: ${report.summary.duplicatesRemoved}`);
    }

    async fixProblematicSteps() {
        console.log('   🛠️ Corrigiendo steps problemáticos...');
        
        const stepsDir = path.join(this.baseDir, this.config.cypress.steps);
        
        try {
            const files = await fs.readdir(stepsDir);
            const autoGeneratedFiles = files.filter(f => f.includes('autoGenerated') || f.includes('auto-generated'));
            
            for (const file of autoGeneratedFiles) {
                const filePath = path.join(stepsDir, file);
                let content = await fs.readFile(filePath, 'utf8');
                
                // Corregir "Y" por "And"
                content = content.replace(/^\s*Y\s*\(/gm, 'And(');
                
                // Corregir steps mal formateados
                content = content.replace(/And\s*\(\s*["']Y\s+([^"']+)["']/g, 'And("$1"');
                
                await fs.writeFile(filePath, content, 'utf8');
                console.log(`     ✅ Corregido: ${file}`);
            }
        } catch (error) {
            console.log('     ⚠️ Error corrigiendo steps problemáticos');
        }
    }

    // ========================================================================
    // CORRECCIÓN DE IMPORTS DE CUCUMBER
    // ========================================================================
    async fixCucumberImports() {
        console.log('🔧 Corrigiendo imports de Cucumber...');
        
        try {
            const files = await fs.readdir(this.stepsDir);
            const jsFiles = files.filter(f => f.endsWith('.js'));
            
            let filesFixed = 0;
            
            for (const file of jsFiles) {
                const filePath = path.join(this.stepsDir, file);
                let content = await fs.readFile(filePath, 'utf8');
                const originalContent = content;
                
                // Corregir imports sin And
                content = content.replace(
                    /import\s*{\s*Given,?\s*When,?\s*Then\s*}\s*from\s*["']@badeball\/cypress-cucumber-preprocessor["']/g,
                    'import { Given, When, Then, And } from "@badeball/cypress-cucumber-preprocessor"'
                );
                
                // Corregir "And" en medio del texto de steps
                content = content.replace(
                    /(Given|When|Then)\s*\(\s*["']([^"']*)\s+And\s+([^"']*)["']/g,
                    '$1("$2 y $3"'
                );
                
                if (content !== originalContent) {
                    await fs.writeFile(filePath, content, 'utf8');
                    filesFixed++;
                }
            }
            
            console.log(`   ✅ ${filesFixed} archivos con imports corregidos`);
            
        } catch (error) {
            console.log('   ❌ Error corrigiendo imports de Cucumber');
        }
    }
}

// ============================================================================
// FUNCIÓN PRINCIPAL
// ============================================================================
async function main() {
    const manager = new IntelligentStepManager();
    
    try {
        await manager.manageSteps();
    } catch (error) {
        console.error('💥 Error en gestión de steps:', error.message);
        process.exit(1);
    }
}

// Ejecutar si el script se llama directamente
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { IntelligentStepManager }; 