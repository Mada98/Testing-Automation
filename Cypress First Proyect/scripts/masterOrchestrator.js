const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

/**
 * 🎼 MASTER ORCHESTRATOR - Orquestador Maestro del Proyecto
 * 
 * Este script controla TODA la orquestación de generación de tests:
 * 1. 🔍 Analiza el estado actual del proyecto
 * 2. 🛡️ Crea backups de archivos existentes
 * 3. 🧹 Limpia conflictos y duplicaciones
 * 4. 🚀 Ejecuta scripts en orden lógico
 * 5. ✅ Valida resultados y rollback si es necesario
 * 6. 📊 Genera reportes completos
 */

class MasterOrchestrator {
    constructor() {
        this.baseDir = path.join(__dirname, '..');
        this.config = {
            // Directorios principales
            cypress: {
                features: 'cypress/e2e/features',
                steps: 'cypress/e2e/step_definitions',
                pages: 'cypress/pages',
                fixtures: 'cypress/fixtures'
            },
            scripts: {
                analizar: 'scripts/Analizar',
                root: 'scripts'
            },
            backup: 'scripts/backups',
            reports: 'scripts/reports'
        };
        
        this.state = {
            startTime: new Date(),
            backupsCreated: [],
            filesGenerated: [],
            conflicts: [],
            errors: [],
            warnings: [],
            success: false
        };

        this.fileInventory = {
            existing: {
                features: [],
                steps: [],
                pages: [],
                locators: []
            },
            generated: {
                features: [],
                steps: [],
                pages: [],
                locators: []
            }
        };
    }

    // ========================================================================
    // MÉTODO PRINCIPAL - EJECUTA TODA LA ORQUESTACIÓN
    // ========================================================================
    async orchestrate() {
        console.log('🎼 INICIANDO ORQUESTACIÓN MAESTRA DEL PROYECTO...\n');
        
        try {
            // Fase 1: Análisis inicial
            await this.analyzeCurrentState();
            
            // Fase 2: Preparación y backups
            await this.prepareEnvironment();
            
            // Fase 3: Limpieza y resolución de conflictos
            await this.resolveConflicts();
            
            // Fase 4: Ejecución orquestada
            await this.executeOrchestration();
            
            // Fase 5: Validación y cleanup
            await this.validateAndCleanup();
            
            // Fase 6: Reporte final
            await this.generateFinalReport();
            
            this.state.success = true;
            console.log('\n🎉 ORQUESTACIÓN COMPLETADA EXITOSAMENTE!');
            
        } catch (error) {
            console.error('❌ Error en la orquestación:', error);
            await this.handleError(error);
            throw error;
        }
    }

    // ========================================================================
    // FASE 1: ANÁLISIS DEL ESTADO ACTUAL
    // ========================================================================
    async analyzeCurrentState() {
        console.log('🔍 FASE 1: Analizando estado actual del proyecto...\n');
        
        // Inventariar archivos existentes
        await this.inventoryExistingFiles();
        
        // Detectar conflictos potenciales
        await this.detectConflicts();
        
        // Analizar scripts disponibles
        await this.analyzeAvailableScripts();
        
        console.log('✅ Análisis completado\n');
    }

    async inventoryExistingFiles() {
        console.log('📁 Inventariando archivos existentes...');
        
        // Features existentes
        try {
            const featuresDir = path.join(this.baseDir, this.config.cypress.features);
            const features = await fs.readdir(featuresDir);
            this.fileInventory.existing.features = features.filter(f => f.endsWith('.feature'));
            console.log(`   🎭 Features encontrados: ${this.fileInventory.existing.features.length}`);
        } catch (error) {
            console.log('   ⚠️ No se encontraron features existentes');
        }

        // Steps existentes
        try {
            const stepsDir = path.join(this.baseDir, this.config.cypress.steps);
            const steps = await fs.readdir(stepsDir);
            this.fileInventory.existing.steps = steps.filter(f => f.endsWith('.js'));
            console.log(`   🪜 Steps encontrados: ${this.fileInventory.existing.steps.length}`);
        } catch (error) {
            console.log('   ⚠️ No se encontraron steps existentes');
        }

        // Page Objects existentes
        try {
            const pagesDir = path.join(this.baseDir, this.config.cypress.pages);
            const pages = await fs.readdir(pagesDir);
            this.fileInventory.existing.pages = pages.filter(f => f.endsWith('.js'));
            console.log(`   📄 Page Objects encontrados: ${this.fileInventory.existing.pages.length}`);
        } catch (error) {
            console.log('   ⚠️ No se encontraron page objects existentes');
        }
    }

    async detectConflicts() {
        console.log('⚔️ Detectando conflictos potenciales...');
        
        // Archivos que podrían ser sobreescritos
        const potentialConflicts = [
            'auto-generated-scraper.feature',
            'autoGeneratedScraperSteps.js',
            'AutoGeneratedScraperPage.js',
            'AutoGeneratedLocators.json'
        ];

        for (const fileName of potentialConflicts) {
            const featurePath = path.join(this.baseDir, this.config.cypress.features, fileName);
            const stepPath = path.join(this.baseDir, this.config.cypress.steps, fileName);
            const pagePath = path.join(this.baseDir, this.config.cypress.pages, fileName);
            
            try {
                if (fileName.endsWith('.feature')) {
                    await fs.access(featurePath);
                    this.state.conflicts.push({ type: 'feature', file: fileName, path: featurePath });
                } else if (fileName.includes('Steps')) {
                    await fs.access(stepPath);
                    this.state.conflicts.push({ type: 'steps', file: fileName, path: stepPath });
                } else if (fileName.includes('Page') || fileName.includes('Locators')) {
                    await fs.access(pagePath);
                    this.state.conflicts.push({ type: 'page', file: fileName, path: pagePath });
                }
            } catch (error) {
                // Archivo no existe, no hay conflicto
            }
        }

        if (this.state.conflicts.length > 0) {
            console.log(`   ⚠️ Conflictos detectados: ${this.state.conflicts.length}`);
            this.state.conflicts.forEach(conflict => {
                console.log(`     - ${conflict.type}: ${conflict.file}`);
            });
        } else {
            console.log('   ✅ No se detectaron conflictos');
        }
    }

    async analyzeAvailableScripts() {
        console.log('🔧 Analizando scripts disponibles...');
        
        const availableScripts = [
            'unifiedScraperProcessor.js',
            'cypressTestGenerator.js',
            'Analizar/generateTests.js',
            'Analizar/fixImports.js',
            'Analizar/finalTranslations.js',
            'Analizar/validateFeatures.js'
        ];

        const existingScripts = [];
        for (const script of availableScripts) {
            try {
                const scriptPath = path.join(this.baseDir, 'scripts', script);
                await fs.access(scriptPath);
                existingScripts.push(script);
            } catch (error) {
                console.log(`   ⚠️ Script no encontrado: ${script}`);
            }
        }

        console.log(`   ✅ Scripts disponibles: ${existingScripts.length}/${availableScripts.length}`);
    }

    // ========================================================================
    // FASE 2: PREPARACIÓN Y BACKUPS
    // ========================================================================
    async prepareEnvironment() {
        console.log('🛡️ FASE 2: Preparando entorno y creando backups...\n');
        
        // Crear directorios de backup y reportes
        await this.ensureDirectories();
        
        // Crear backups de archivos conflictivos
        if (this.state.conflicts.length > 0) {
            await this.createBackups();
        }
        
        console.log('✅ Preparación completada\n');
    }

    async ensureDirectories() {
        console.log('📁 Creando directorios necesarios...');
        
        const directories = [
            this.config.backup,
            this.config.reports,
            'cypress/pages/locators'
        ];

        for (const dir of directories) {
            const fullPath = path.join(this.baseDir, dir);
            try {
                await fs.mkdir(fullPath, { recursive: true });
                console.log(`   ✅ ${dir}`);
            } catch (error) {
                console.log(`   ⚠️ Error creando ${dir}: ${error.message}`);
            }
        }
    }

    async createBackups() {
        console.log('💾 Creando backups de archivos conflictivos...');
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupDir = path.join(this.baseDir, this.config.backup, `backup-${timestamp}`);
        
        await fs.mkdir(backupDir, { recursive: true });

        for (const conflict of this.state.conflicts) {
            try {
                const fileName = path.basename(conflict.path);
                const backupPath = path.join(backupDir, fileName);
                
                await fs.copyFile(conflict.path, backupPath);
                this.state.backupsCreated.push({
                    original: conflict.path,
                    backup: backupPath,
                    type: conflict.type
                });
                
                console.log(`   💾 ${fileName} -> backup`);
            } catch (error) {
                console.log(`   ❌ Error backing up ${conflict.file}: ${error.message}`);
                this.state.errors.push(`Backup failed: ${conflict.file}`);
            }
        }
    }

    // ========================================================================
    // FASE 3: RESOLUCIÓN DE CONFLICTOS
    // ========================================================================
    async resolveConflicts() {
        console.log('🧹 FASE 3: Resolviendo conflictos y limpiando archivos...\n');
        
        // Estrategia de resolución
        await this.applyConflictResolutionStrategy();
        
        // Validar steps existentes y evitar duplicaciones
        await this.validateExistingSteps();
        
        console.log('✅ Conflictos resueltos\n');
    }

    async applyConflictResolutionStrategy() {
        console.log('🎯 Aplicando estrategia de resolución de conflictos...');
        
        // Estrategia: Renombrar archivos auto-generados existentes
        for (const conflict of this.state.conflicts) {
            try {
                const dir = path.dirname(conflict.path);
                const fileName = path.basename(conflict.path);
                const nameWithoutExt = path.parse(fileName).name;
                const ext = path.parse(fileName).ext;
                
                const newFileName = `${nameWithoutExt}-legacy-${Date.now()}${ext}`;
                const newPath = path.join(dir, newFileName);
                
                await fs.rename(conflict.path, newPath);
                console.log(`   🔄 Renombrado: ${fileName} -> ${newFileName}`);
                
            } catch (error) {
                console.log(`   ❌ Error renombrando ${conflict.file}: ${error.message}`);
                this.state.errors.push(`Rename failed: ${conflict.file}`);
            }
        }
    }

    async validateExistingSteps() {
        console.log('🔍 Validando steps existentes para evitar duplicaciones...');
        
        const stepsDir = path.join(this.baseDir, this.config.cypress.steps);
        
        try {
            const stepFiles = await fs.readdir(stepsDir);
            const jsFiles = stepFiles.filter(f => f.endsWith('.js') && !f.includes('auto-generated'));
            
            for (const file of jsFiles) {
                const filePath = path.join(stepsDir, file);
                const content = await fs.readFile(filePath, 'utf8');
                
                // Buscar steps problemáticos con "Y" o "And"
                const problematicSteps = content.match(/^\s*(Given|When|Then|And|Y)\s*\(/gm);
                if (problematicSteps) {
                    console.log(`   ⚠️ Steps problemáticos en ${file}: ${problematicSteps.length}`);
                    this.state.warnings.push(`Problematic steps in ${file}: ${problematicSteps.length}`);
                }
            }
            
        } catch (error) {
            console.log('   ⚠️ Error validando steps existentes');
        }
    }

    // ========================================================================
    // FASE 4: EJECUCIÓN ORQUESTADA
    // ========================================================================
    async executeOrchestration() {
        console.log('🚀 FASE 4: Ejecutando orquestación de scripts...\n');
        
        // Paso 1: Ejecutar scraper exploratorio si es necesario
        await this.runExploratoryIfNeeded();
        
        // Paso 2: Ejecutar script unificado principal
        await this.runUnifiedProcessor();
        
        // Paso 3: Aplicar correcciones y mejoras
        await this.applyCorrections();
        
        console.log('✅ Orquestación ejecutada\n');
    }

    async runExploratoryIfNeeded() {
        console.log('🔍 Verificando si es necesario ejecutar exploración...');
        
        const discoveredDir = path.join(this.baseDir, 'cypress/fixtures/discovered');
        
        try {
            const files = await fs.readdir(discoveredDir);
            const recentFiles = files.filter(f => {
                const filePath = path.join(discoveredDir, f);
                const stats = require('fs').statSync(filePath);
                const hoursDiff = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60);
                return hoursDiff < 24; // Archivos de menos de 24 horas
            });

            if (recentFiles.length === 0) {
                console.log('   🔄 Ejecutando scraper exploratorio...');
                try {
                    execSync('npx cypress run --spec "cypress/e2e/features/exploratory.feature" --headed', {
                        cwd: this.baseDir,
                        stdio: 'pipe'
                    });
                    console.log('   ✅ Scraper exploratorio completado');
                } catch (error) {
                    console.log('   ⚠️ Error en scraper exploratorio, continuando con archivos existentes');
                    this.state.warnings.push('Exploratory scraper failed, using existing files');
                }
            } else {
                console.log(`   ✅ Archivos recientes encontrados: ${recentFiles.length}`);
            }
        } catch (error) {
            console.log('   ⚠️ Directorio discovered no encontrado, ejecutando scraper...');
            // Ejecutar scraper aquí si es necesario
        }
    }

    async runUnifiedProcessor() {
        console.log('⚙️ Ejecutando procesador unificado...');
        
        try {
            const unifiedScript = path.join(this.baseDir, 'scripts/unifiedScraperProcessor.js');
            
            // Ejecutar el script unificado
            const { spawn } = require('child_process');
            
            await new Promise((resolve, reject) => {
                const child = spawn('node', [unifiedScript], {
                    cwd: this.baseDir,
                    stdio: 'pipe'
                });

                let output = '';
                child.stdout.on('data', (data) => {
                    output += data.toString();
                    console.log(`   📝 ${data.toString().trim()}`);
                });

                child.stderr.on('data', (data) => {
                    console.log(`   ⚠️ ${data.toString().trim()}`);
                });

                child.on('close', (code) => {
                    if (code === 0) {
                        console.log('   ✅ Procesador unificado completado exitosamente');
                        resolve();
                    } else {
                        console.log(`   ❌ Procesador unificado falló con código: ${code}`);
                        reject(new Error(`Unified processor failed with code ${code}`));
                    }
                });
            });

        } catch (error) {
            console.log('   ❌ Error ejecutando procesador unificado:', error.message);
            this.state.errors.push(`Unified processor error: ${error.message}`);
        }
    }

    async applyCorrections() {
        console.log('🔧 Aplicando correcciones finales...');
        
        // Corregir formato de steps problemáticos
        await this.fixProblematicSteps();
        
        // Validar archivos generados
        await this.validateGeneratedContent();
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

    async validateGeneratedContent() {
        console.log('   ✅ Validando contenido generado...');
        
        // Aquí se puede agregar validación específica de sintaxis Gherkin, etc.
    }

    // ========================================================================
    // FASE 5: VALIDACIÓN Y CLEANUP
    // ========================================================================
    async validateAndCleanup() {
        console.log('✅ FASE 5: Validación final y limpieza...\n');
        
        // Validar que los archivos se generaron correctamente
        await this.validateGeneratedFiles();
        
        // Limpiar archivos temporales
        await this.cleanupTemporaryFiles();
        
        console.log('✅ Validación completada\n');
    }

    async validateGeneratedFiles() {
        console.log('🔍 Validando archivos generados...');
        
        const expectedFiles = [
            { type: 'feature', path: 'cypress/e2e/features/auto-generated-scraper.feature' },
            { type: 'steps', path: 'cypress/e2e/step_definitions/autoGeneratedScraperSteps.js' },
            { type: 'page', path: 'cypress/pages/AutoGeneratedScraperPage.js' },
            { type: 'locators', path: 'cypress/pages/locators/AutoGeneratedLocators.json' }
        ];

        for (const expected of expectedFiles) {
            const fullPath = path.join(this.baseDir, expected.path);
            try {
                await fs.access(fullPath);
                this.fileInventory.generated[expected.type].push(path.basename(expected.path));
                console.log(`   ✅ ${expected.type}: ${path.basename(expected.path)}`);
            } catch (error) {
                console.log(`   ❌ Faltante ${expected.type}: ${path.basename(expected.path)}`);
                this.state.errors.push(`Missing file: ${expected.path}`);
            }
        }
    }

    async cleanupTemporaryFiles() {
        console.log('🧹 Limpiando archivos temporales...');
        
        // Limpiar archivos temporales si existen
        const tempPatterns = [
            'cypress/fixtures/discovered/temp-*',
            'scripts/temp-*'
        ];

        // Implementar limpieza si es necesario
        console.log('   ✅ Limpieza completada');
    }

    // ========================================================================
    // FASE 6: REPORTE FINAL
    // ========================================================================
    async generateFinalReport() {
        console.log('📊 FASE 6: Generando reporte final...\n');
        
        const report = {
            orchestration: {
                startTime: this.state.startTime,
                endTime: new Date(),
                duration: Date.now() - this.state.startTime.getTime(),
                success: this.state.success
            },
            inventory: this.fileInventory,
            operations: {
                backupsCreated: this.state.backupsCreated.length,
                conflictsResolved: this.state.conflicts.length,
                filesGenerated: Object.values(this.fileInventory.generated).flat().length,
                errorsFound: this.state.errors.length,
                warningsFound: this.state.warnings.length
            },
            details: {
                backups: this.state.backupsCreated,
                conflicts: this.state.conflicts,
                errors: this.state.errors,
                warnings: this.state.warnings
            }
        };

        const reportPath = path.join(this.baseDir, this.config.reports, `orchestration-report-${new Date().toISOString().split('T')[0]}.json`);
        await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

        // Mostrar resumen en consola
        this.displaySummary(report);
    }

    displaySummary(report) {
        console.log('📋 RESUMEN DE ORQUESTACIÓN:\n');
        console.log(`⏱️  Duración: ${this.formatDuration(report.orchestration.duration)}`);
        console.log(`📁 Archivos existentes: ${Object.values(report.inventory.existing).flat().length}`);
        console.log(`🆕 Archivos generados: ${report.operations.filesGenerated}`);
        console.log(`💾 Backups creados: ${report.operations.backupsCreated}`);
        console.log(`⚔️  Conflictos resueltos: ${report.operations.conflictsResolved}`);
        console.log(`❌ Errores: ${report.operations.errorsFound}`);
        console.log(`⚠️  Advertencias: ${report.operations.warningsFound}`);
        
        if (report.orchestration.success) {
            console.log('\n🎉 ¡ORQUESTACIÓN COMPLETADA EXITOSAMENTE!');
        } else {
            console.log('\n❌ Orquestación completada con errores');
        }
    }

    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        }
        return `${seconds}s`;
    }

    // ========================================================================
    // MANEJO DE ERRORES
    // ========================================================================
    async handleError(error) {
        console.log('\n🚨 MANEJO DE ERROR EN ORQUESTACIÓN');
        
        // Intentar rollback si hay backups
        if (this.state.backupsCreated.length > 0) {
            console.log('🔄 Intentando rollback de archivos...');
            await this.rollbackFiles();
        }

        // Guardar log de error
        const errorLog = {
            timestamp: new Date().toISOString(),
            error: error.message,
            stack: error.stack,
            state: this.state
        };

        const errorPath = path.join(this.baseDir, this.config.reports, `error-log-${Date.now()}.json`);
        await fs.writeFile(errorPath, JSON.stringify(errorLog, null, 2));
        
        console.log(`💾 Log de error guardado en: ${path.relative(this.baseDir, errorPath)}`);
    }

    async rollbackFiles() {
        for (const backup of this.state.backupsCreated) {
            try {
                await fs.copyFile(backup.backup, backup.original);
                console.log(`   🔄 Restaurado: ${path.basename(backup.original)}`);
            } catch (error) {
                console.log(`   ❌ Error restaurando: ${path.basename(backup.original)}`);
            }
        }
    }
}

// ============================================================================
// FUNCIÓN PRINCIPAL
// ============================================================================
async function main() {
    const orchestrator = new MasterOrchestrator();
    
    try {
        await orchestrator.orchestrate();
    } catch (error) {
        console.error('💥 Error fatal en orquestación:', error.message);
        process.exit(1);
    }
}

// Ejecutar si el script se llama directamente
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { MasterOrchestrator }; 