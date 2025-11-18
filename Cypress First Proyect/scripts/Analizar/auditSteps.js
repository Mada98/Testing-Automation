const fs = require('fs').promises;
const path = require('path');

/**
 * 🔍 AUDITOR DE STEPS Y ARCHIVOS
 * 
 * Este script analiza todo el proyecto para:
 * 1. 🔍 Identificar steps duplicados
 * 2. 🗑️ Encontrar archivos no utilizados
 * 3. 📊 Generar reporte de limpieza
 * 4. 💡 Sugerir qué se puede borrar sin afectar funcionalidad
 */

class ProjectAuditor {
    constructor() {
        this.baseDir = path.join(__dirname, '..');
        this.stepsDir = path.join(this.baseDir, 'cypress/e2e/step_definitions');
        this.featuresDir = path.join(this.baseDir, 'cypress/e2e/features');
        
        this.stepDefinitions = new Map(); // step text -> [files that define it]
        this.stepUsages = new Map(); // step text -> [features that use it]
        this.fileAnalysis = new Map(); // filename -> analysis data
        
        this.duplicatedSteps = [];
        this.unusedSteps = [];
        this.unnecessaryFiles = [];
        this.problematicFiles = [];
    }

    async performCompleteAudit() {
        console.log('🔍 INICIANDO AUDITORÍA COMPLETA DEL PROYECTO...\n');
        
        // 1. Escanear archivos de steps
        await this.scanStepDefinitions();
        
        // 2. Escanear features para ver qué steps se usan
        await this.scanFeatureFiles();
        
        // 3. Analizar duplicaciones
        this.findDuplicatedSteps();
        
        // 4. Encontrar steps no utilizados
        this.findUnusedSteps();
        
        // 5. Identificar archivos problemáticos
        await this.identifyProblematicFiles();
        
        // 6. Generar reporte
        this.generateReport();
        
        // 7. Generar recomendaciones
        this.generateCleanupRecommendations();
    }

    async scanStepDefinitions() {
        console.log('📁 Escaneando definiciones de steps...');
        
        try {
            const files = await fs.readdir(this.stepsDir);
            const jsFiles = files.filter(f => f.endsWith('.js'));
            
            for (const file of jsFiles) {
                const filePath = path.join(this.stepsDir, file);
                const content = await fs.readFile(filePath, 'utf8');
                
                const fileStats = {
                    size: content.length,
                    lines: content.split('\n').length,
                    steps: [],
                    hasProblems: false,
                    problems: []
                };
                
                // Extraer steps de este archivo
                const stepRegex = /(Given|When|Then|And)\s*\(\s*['"`]([^'"`]+)['"`]/g;
                let match;
                
                while ((match = stepRegex.exec(content)) !== null) {
                    const stepText = match[2];
                    const normalizedStep = this.normalizeStepText(stepText);
                    
                    // Registrar definición
                    if (!this.stepDefinitions.has(normalizedStep)) {
                        this.stepDefinitions.set(normalizedStep, []);
                    }
                    this.stepDefinitions.get(normalizedStep).push({
                        file,
                        originalText: stepText,
                        type: match[1]
                    });
                    
                    fileStats.steps.push(stepText);
                }
                
                // Detectar problemas en el archivo
                if (content.includes('Y(')) {
                    fileStats.hasProblems = true;
                    fileStats.problems.push('Contiene "Y(" en lugar de "And("');
                }
                
                if (content.match(/And\s*\(\s*['"`]Y\s+/)) {
                    fileStats.hasProblems = true;
                    fileStats.problems.push('Contiene steps que empiezan con "Y "');
                }
                
                if (content.includes('TODO') || content.includes('Pendiente de implementación')) {
                    fileStats.hasProblems = true;
                    fileStats.problems.push('Contiene implementaciones pendientes');
                }
                
                this.fileAnalysis.set(file, fileStats);
            }
            
            console.log(`   ✅ ${jsFiles.length} archivos de steps escaneados`);
        } catch (error) {
            console.log(`   ❌ Error escaneando steps: ${error.message}`);
        }
    }

    async scanFeatureFiles() {
        console.log('🎯 Escaneando archivos de features...');
        
        try {
            const files = await fs.readdir(this.featuresDir);
            const featureFiles = files.filter(f => f.endsWith('.feature'));
            
            for (const file of featureFiles) {
                const filePath = path.join(this.featuresDir, file);
                const content = await fs.readFile(filePath, 'utf8');
                
                // Extraer steps usados en features
                const stepRegex = /^\s*(Given|When|Then|And)\s+(.+)$/gm;
                let match;
                
                while ((match = stepRegex.exec(content)) !== null) {
                    const stepText = match[2].trim();
                    const normalizedStep = this.normalizeStepText(stepText);
                    
                    if (!this.stepUsages.has(normalizedStep)) {
                        this.stepUsages.set(normalizedStep, []);
                    }
                    this.stepUsages.get(normalizedStep).push({
                        feature: file,
                        originalText: stepText
                    });
                }
            }
            
            console.log(`   ✅ ${featureFiles.length} archivos de features escaneados`);
        } catch (error) {
            console.log(`   ❌ Error escaneando features: ${error.message}`);
        }
    }

    findDuplicatedSteps() {
        console.log('🔍 Buscando steps duplicados...');
        
        for (const [stepText, definitions] of this.stepDefinitions) {
            if (definitions.length > 1) {
                this.duplicatedSteps.push({
                    step: stepText,
                    definitions,
                    count: definitions.length
                });
            }
        }
        
        console.log(`   🔄 ${this.duplicatedSteps.length} steps duplicados encontrados`);
    }

    findUnusedSteps() {
        console.log('🗑️ Buscando steps no utilizados...');
        
        for (const [stepText, definitions] of this.stepDefinitions) {
            if (!this.stepUsages.has(stepText)) {
                this.unusedSteps.push({
                    step: stepText,
                    definitions
                });
            }
        }
        
        console.log(`   🗑️ ${this.unusedSteps.length} steps no utilizados encontrados`);
    }

    async identifyProblematicFiles() {
        console.log('⚠️ Identificando archivos problemáticos...');
        
        for (const [fileName, stats] of this.fileAnalysis) {
            const filePath = path.join(this.stepsDir, fileName);
            
            // Archivos con muchos TODOs
            if (stats.problems.length > 0) {
                this.problematicFiles.push({
                    file: fileName,
                    reason: 'Contiene problemas técnicos',
                    problems: stats.problems,
                    canDelete: stats.steps.length === 0 || stats.problems.includes('Contiene implementaciones pendientes')
                });
            }
            
            // Archivos con solo steps no utilizados
            const unusedInFile = stats.steps.filter(step => {
                const normalized = this.normalizeStepText(step);
                return !this.stepUsages.has(normalized);
            });
            
            if (unusedInFile.length === stats.steps.length && stats.steps.length > 0) {
                this.unnecessaryFiles.push({
                    file: fileName,
                    reason: 'Todos los steps están sin usar',
                    unusedSteps: unusedInFile.length,
                    canDelete: true
                });
            }
            
            // Archivos muy pequeños o vacíos
            if (stats.lines < 20 && stats.steps.length === 0) {
                this.unnecessaryFiles.push({
                    file: fileName,
                    reason: 'Archivo prácticamente vacío',
                    lines: stats.lines,
                    canDelete: true
                });
            }
        }
        
        console.log(`   ⚠️ ${this.problematicFiles.length} archivos problemáticos`);
        console.log(`   🗑️ ${this.unnecessaryFiles.length} archivos innecesarios`);
    }

    generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 REPORTE DE AUDITORÍA COMPLETA');
        console.log('='.repeat(60));
        
        console.log('\n🔄 STEPS DUPLICADOS:');
        if (this.duplicatedSteps.length === 0) {
            console.log('   ✅ No se encontraron steps duplicados');
        } else {
            this.duplicatedSteps.forEach(dup => {
                console.log(`\n   📝 "${dup.step}"`);
                console.log(`      Definido en ${dup.count} archivos:`);
                dup.definitions.forEach(def => {
                    console.log(`      - ${def.file} (${def.type})`);
                });
            });
        }
        
        console.log('\n🗑️ STEPS NO UTILIZADOS:');
        if (this.unusedSteps.length === 0) {
            console.log('   ✅ Todos los steps están siendo utilizados');
        } else {
            console.log(`   Total: ${this.unusedSteps.length} steps sin usar`);
            this.unusedSteps.slice(0, 10).forEach(unused => {
                console.log(`   - "${unused.step}" en ${unused.definitions.map(d => d.file).join(', ')}`);
            });
            if (this.unusedSteps.length > 10) {
                console.log(`   ... y ${this.unusedSteps.length - 10} más`);
            }
        }
        
        console.log('\n⚠️ ARCHIVOS PROBLEMÁTICOS:');
        if (this.problematicFiles.length === 0) {
            console.log('   ✅ No se encontraron archivos problemáticos');
        } else {
            this.problematicFiles.forEach(prob => {
                console.log(`\n   📁 ${prob.file}`);
                console.log(`      Razón: ${prob.reason}`);
                prob.problems.forEach(p => console.log(`      - ${p}`));
                console.log(`      ¿Se puede borrar? ${prob.canDelete ? '✅ SÍ' : '❌ NO'}`);
            });
        }
        
        console.log('\n🗑️ ARCHIVOS INNECESARIOS:');
        if (this.unnecessaryFiles.length === 0) {
            console.log('   ✅ No se encontraron archivos innecesarios');
        } else {
            this.unnecessaryFiles.forEach(unnecessary => {
                console.log(`\n   📁 ${unnecessary.file}`);
                console.log(`      Razón: ${unnecessary.reason}`);
                if (unnecessary.unusedSteps) {
                    console.log(`      Steps sin usar: ${unnecessary.unusedSteps}`);
                }
                if (unnecessary.lines) {
                    console.log(`      Líneas: ${unnecessary.lines}`);
                }
                console.log(`      ¿Se puede borrar? ${unnecessary.canDelete ? '✅ SÍ' : '❌ NO'}`);
            });
        }
    }

    generateCleanupRecommendations() {
        console.log('\n' + '='.repeat(60));
        console.log('💡 RECOMENDACIONES DE LIMPIEZA');
        console.log('='.repeat(60));
        
        const safeToDelete = [
            ...this.unnecessaryFiles.filter(f => f.canDelete),
            ...this.problematicFiles.filter(f => f.canDelete)
        ];
        
        if (safeToDelete.length > 0) {
            console.log('\n🗑️ ARCHIVOS SEGUROS PARA BORRAR:');
            safeToDelete.forEach(file => {
                console.log(`   ❌ ${file.file} - ${file.reason}`);
            });
            
            console.log('\n🚀 COMANDO PARA EJECUTAR:');
            const deleteCommands = safeToDelete.map(f => 
                `del "cypress\\e2e\\step_definitions\\${f.file}"`
            ).join(' && ');
            console.log(`   ${deleteCommands}`);
        } else {
            console.log('\n✅ ¡EL PROYECTO ESTÁ LIMPIO!');
            console.log('   No se encontraron archivos seguros para borrar');
        }
        
        if (this.duplicatedSteps.length > 0) {
            console.log('\n⚠️ ACCIÓN REQUERIDA - STEPS DUPLICADOS:');
            console.log('   Revisar manualmente y conservar solo una implementación de cada step');
        }
        
        console.log('\n📊 RESUMEN:');
        console.log(`   📁 Total archivos de steps: ${this.fileAnalysis.size}`);
        console.log(`   🔄 Steps duplicados: ${this.duplicatedSteps.length}`);
        console.log(`   🗑️ Steps sin usar: ${this.unusedSteps.length}`);
        console.log(`   ❌ Archivos para borrar: ${safeToDelete.length}`);
        console.log(`   ✅ Archivos funcionales: ${this.fileAnalysis.size - safeToDelete.length}`);
    }

    normalizeStepText(text) {
        return text
            .toLowerCase()
            .replace(/\{[^}]+\}/g, '{param}') // Reemplazar parámetros
            .replace(/[^\w\s]/g, '') // Remover puntuación
            .replace(/\s+/g, ' ') // Normalizar espacios
            .trim();
    }
}

// ============================================================================
// FUNCIÓN PRINCIPAL
// ============================================================================
async function main() {
    const auditor = new ProjectAuditor();
    
    try {
        await auditor.performCompleteAudit();
        
        console.log('\n✅ AUDITORÍA COMPLETADA EXITOSAMENTE');
        console.log('💡 Revisa las recomendaciones arriba para optimizar el proyecto');
        
    } catch (error) {
        console.error('❌ Error durante la auditoría:', error);
        process.exit(1);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    main();
}

module.exports = { ProjectAuditor }; 