#!/usr/bin/env node

const { MasterOrchestrator } = require('./masterOrchestrator');
const { IntelligentStepManager } = require('./intelligentStepManager');
const { execSync } = require('child_process');
const path = require('path');

/**
 * 🎯 RUN ORCHESTRATION - Script Ejecutor de Comandos
 * 
 * Proporciona comandos simples para ejecutar la orquestación:
 * - npm run orchestrate:full - Orquestación completa
 * - npm run orchestrate:steps - Solo gestión de steps
 * - npm run orchestrate:scraper - Solo procesamiento de scraper
 * - npm run orchestrate:clean - Limpieza y backup
 */

class OrchestrationRunner {
    constructor() {
        this.baseDir = path.join(__dirname, '..');
        this.commands = {
            'full': this.runFullOrchestration.bind(this),
            'complete': this.runFullOrchestration.bind(this),
            'all': this.runFullOrchestration.bind(this),
            
            'steps': this.runStepsManagement.bind(this),
            'step-manager': this.runStepsManagement.bind(this),
            'fix-steps': this.runStepsManagement.bind(this),
            
            'scraper': this.runScraperProcessing.bind(this),
            'unified': this.runScraperProcessing.bind(this),
            'process': this.runScraperProcessing.bind(this),
            
            'clean': this.runCleanupAndBackup.bind(this),
            'backup': this.runCleanupAndBackup.bind(this),
            'prepare': this.runCleanupAndBackup.bind(this),
            
            'help': this.showHelp.bind(this),
            '--help': this.showHelp.bind(this),
            '-h': this.showHelp.bind(this)
        };
    }

    // ========================================================================
    // MÉTODO PRINCIPAL - EJECUTAR COMANDO
    // ========================================================================
    async run() {
        const args = process.argv.slice(2);
        const command = args[0] || 'help';
        const options = this.parseOptions(args.slice(1));

        console.log('🎯 EJECUTOR DE ORQUESTACIÓN DE CYPRESS\n');
        console.log(`📋 Comando: ${command}`);
        if (Object.keys(options).length > 0) {
            console.log(`⚙️  Opciones: ${JSON.stringify(options)}`);
        }
        console.log('');

        if (this.commands[command]) {
            try {
                await this.commands[command](options);
            } catch (error) {
                console.error(`❌ Error ejecutando comando '${command}':`, error.message);
                process.exit(1);
            }
        } else {
            console.log(`❌ Comando desconocido: '${command}'`);
            console.log('💡 Usa "help" para ver comandos disponibles\n');
            this.showHelp();
            process.exit(1);
        }
    }

    parseOptions(args) {
        const options = {};
        for (let i = 0; i < args.length; i += 2) {
            if (args[i].startsWith('--')) {
                const key = args[i].substring(2);
                const value = args[i + 1] || true;
                options[key] = value;
            }
        }
        return options;
    }

    // ========================================================================
    // COMANDOS DISPONIBLES
    // ========================================================================

    async runFullOrchestration(options = {}) {
        console.log('🎼 EJECUTANDO ORQUESTACIÓN COMPLETA...\n');
        
        const orchestrator = new MasterOrchestrator();
        
        if (options.verbose) {
            console.log('🔍 Modo verbose activado');
        }
        
        if (options.skipBackup) {
            console.log('⚠️ Saltando creación de backups');
        }
        
        await orchestrator.orchestrate();
        
        console.log('\n🎉 ¡ORQUESTACIÓN COMPLETA FINALIZADA!');
        console.log('📊 Revisa los reportes en scripts/reports/');
        console.log('💾 Backups disponibles en scripts/backups/');
    }

    async runStepsManagement(options = {}) {
        console.log('🧠 EJECUTANDO GESTIÓN DE STEPS...\n');
        
        const stepManager = new IntelligentStepManager();
        
        await stepManager.manageSteps();
        
        console.log('\n🎉 ¡GESTIÓN DE STEPS FINALIZADA!');
        console.log('📊 Revisa el reporte en scripts/reports/');
    }

    async runScraperProcessing(options = {}) {
        console.log('🚀 EJECUTANDO PROCESAMIENTO DE SCRAPER...\n');
        
        try {
            // Verificar si hay archivos discovered recientes
            const hasRecentDiscovered = await this.checkRecentDiscoveredFiles();
            
            if (!hasRecentDiscovered && !options.skipScraper) {
                console.log('🔄 Ejecutando scraper exploratorio primero...');
                await this.runExploratoryScraper();
            }
            
            // Ejecutar procesador unificado
            console.log('⚙️ Ejecutando procesador unificado...');
            const unifiedScript = path.join(__dirname, 'unifiedScraperProcessor.js');
            execSync(`node "${unifiedScript}"`, {
                cwd: this.baseDir,
                stdio: 'inherit'
            });
            
            console.log('\n🎉 ¡PROCESAMIENTO DE SCRAPER FINALIZADO!');
            
        } catch (error) {
            console.error('❌ Error en procesamiento de scraper:', error.message);
            throw error;
        }
    }

    async runCleanupAndBackup(options = {}) {
        console.log('🧹 EJECUTANDO LIMPIEZA Y BACKUP...\n');
        
        const orchestrator = new MasterOrchestrator();
        
        // Ejecutar solo las fases de preparación
        await orchestrator.analyzeCurrentState();
        await orchestrator.prepareEnvironment();
        await orchestrator.resolveConflicts();
        
        console.log('\n🎉 ¡LIMPIEZA Y BACKUP FINALIZADOS!');
        console.log('💾 Backups creados en scripts/backups/');
    }

    async runExploratoryScraper() {
        try {
            execSync('npx cypress run --spec "cypress/e2e/features/exploratory.feature" --headed', {
                cwd: this.baseDir,
                stdio: 'inherit',
                timeout: 300000 // 5 minutos timeout
            });
        } catch (error) {
            console.log('⚠️ Error en scraper exploratorio, continuando...');
        }
    }

    async checkRecentDiscoveredFiles() {
        const fs = require('fs').promises;
        const discoveredDir = path.join(this.baseDir, 'cypress/fixtures/discovered');
        
        try {
            const files = await fs.readdir(discoveredDir);
            const recentFiles = files.filter(f => {
                const filePath = path.join(discoveredDir, f);
                const stats = require('fs').statSync(filePath);
                const hoursDiff = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60);
                return hoursDiff < 24; // Archivos de menos de 24 horas
            });
            
            return recentFiles.length > 0;
        } catch (error) {
            return false;
        }
    }

    showHelp() {
        console.log('🎯 COMANDOS DISPONIBLES PARA ORQUESTACIÓN:\n');
        
        console.log('📋 COMANDOS PRINCIPALES:');
        console.log('  full, complete, all     - Ejecuta orquestación completa');
        console.log('  steps, fix-steps        - Solo gestión de steps problemáticos');
        console.log('  scraper, unified        - Solo procesamiento de scraper');
        console.log('  clean, backup, prepare  - Solo limpieza y backups');
        console.log('');
        
        console.log('⚙️ OPCIONES DISPONIBLES:');
        console.log('  --verbose              - Salida detallada');
        console.log('  --skipBackup           - Saltar creación de backups');
        console.log('  --skipScraper          - Saltar ejecución de scraper');
        console.log('');
        
        console.log('💡 EJEMPLOS DE USO:');
        console.log('  node scripts/runOrchestration.js full');
        console.log('  node scripts/runOrchestration.js steps');
        console.log('  node scripts/runOrchestration.js scraper --skipScraper');
        console.log('  node scripts/runOrchestration.js clean --verbose');
        console.log('');
        
        console.log('📊 FLUJO RECOMENDADO:');
        console.log('  1. npm run orchestrate:clean    - Preparar entorno');
        console.log('  2. npm run orchestrate:scraper  - Procesar discovered');
        console.log('  3. npm run orchestrate:steps    - Corregir steps');
        console.log('  4. npm run orchestrate:full     - Orquestación completa');
        console.log('');
        
        console.log('📁 SALIDAS:');
        console.log('  scripts/reports/    - Reportes de ejecución');
        console.log('  scripts/backups/    - Backups de archivos');
        console.log('  cypress/pages/locators/  - Locators generados');
        console.log('  cypress/e2e/features/    - Features generados');
    }
}

// ============================================================================
// EJECUCIÓN
// ============================================================================
if (require.main === module) {
    const runner = new OrchestrationRunner();
    runner.run().catch(error => {
        console.error('💥 Error fatal:', error.message);
        process.exit(1);
    });
}

module.exports = { OrchestrationRunner }; 