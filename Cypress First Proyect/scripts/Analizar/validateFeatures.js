const fs = require('fs').promises;
const path = require('path');

// Función para validar un archivo .feature
async function validateFeatureFile(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf8');
        const lines = content.split('\n');
        const issues = [];
        
        let hasFeature = false;
        let hasBackground = false;
        let hasScenarios = false;
        let inScenario = false;
        let scenarioStepCount = 0;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const lineNumber = i + 1;
            
            // Verificar Feature
            if (line.startsWith('Feature:')) {
                hasFeature = true;
            }
            
            // Verificar Background
            if (line.startsWith('Background:')) {
                hasBackground = true;
            }
            
            // Verificar Scenarios
            if (line.startsWith('Scenario') || line.startsWith('@')) {
                if (line.startsWith('Scenario')) {
                    hasScenarios = true;
                    inScenario = true;
                    scenarioStepCount = 0;
                }
            }
            
            // Verificar pasos de Gherkin
            if (line.match(/^\s*(Given|When|Then|And)\s+/)) {
                if (inScenario) {
                    scenarioStepCount++;
                }
                
                // Verificar que el paso no esté vacío después de la palabra clave
                const stepContent = line.replace(/^\s*(Given|When|Then|And)\s+/, '').trim();
                if (!stepContent) {
                    issues.push(`Línea ${lineNumber}: Paso vacío después de palabra clave Gherkin`);
                }
                
                // Verificar que no haya pasos en inglés mezclados
                if (stepContent.match(/\b(click|enter|verify|must|should|can|view|user|button|page)\b/i) && 
                    !stepContent.match(/\b(hago|ingreso|verifico|puedo|usuario|botón|página)\b/i)) {
                    issues.push(`Línea ${lineNumber}: Posible paso en inglés sin traducir: "${stepContent}"`);
                }
            }
            
            // Verificar líneas sin palabras clave Gherkin en escenarios
            if (inScenario && line && !line.startsWith('@') && !line.startsWith('Scenario') && 
                !line.startsWith('Examples:') && !line.startsWith('|') && 
                !line.match(/^\s*(Given|When|Then|And)\s+/) && 
                !line.match(/^\s*$/) && !line.includes('Examples:')) {
                issues.push(`Línea ${lineNumber}: Línea sin palabra clave Gherkin en escenario: "${line}"`);
            }
            
            if (line.startsWith('Examples:')) {
                inScenario = false;
            }
        }
        
        // Verificaciones generales
        if (!hasFeature) {
            issues.push('Archivo sin declaración Feature');
        }
        
        if (!hasScenarios) {
            issues.push('Archivo sin escenarios');
        }
        
        return {
            valid: issues.length === 0,
            issues: issues,
            stats: {
                hasFeature,
                hasBackground,
                hasScenarios,
                lineCount: lines.length
            }
        };
        
    } catch (error) {
        return {
            valid: false,
            issues: [`Error leyendo archivo: ${error.message}`],
            stats: {}
        };
    }
}

// Función principal
async function main() {
    try {
        const baseDir = path.join(__dirname, '..');
        const featuresDir = path.join(baseDir, 'cypress/e2e/features/generated');
        
        console.log('🔍 Validando archivos .feature generados...\n');
        
        const files = await fs.readdir(featuresDir);
        const featureFiles = files.filter(file => file.endsWith('.feature'));
        
        let totalFiles = 0;
        let validFiles = 0;
        let totalIssues = 0;
        
        for (const file of featureFiles) {
            const filePath = path.join(featuresDir, file);
            const validation = await validateFeatureFile(filePath);
            
            totalFiles++;
            
            console.log(`📄 ${file}:`);
            
            if (validation.valid) {
                console.log('   ✅ Válido');
                validFiles++;
            } else {
                console.log('   ❌ Problemas encontrados:');
                validation.issues.forEach(issue => {
                    console.log(`      • ${issue}`);
                    totalIssues++;
                });
            }
            
            if (validation.stats.lineCount) {
                console.log(`   📊 ${validation.stats.lineCount} líneas`);
            }
            
            console.log('');
        }
        
        console.log('📋 Resumen de validación:');
        console.log(`   • Archivos procesados: ${totalFiles}`);
        console.log(`   • Archivos válidos: ${validFiles}`);
        console.log(`   • Archivos con problemas: ${totalFiles - validFiles}`);
        console.log(`   • Total de problemas: ${totalIssues}`);
        
        if (validFiles === totalFiles) {
            console.log('\n🎉 ¡Todos los archivos .feature tienen formato Gherkin válido!');
        } else {
            console.log('\n⚠️ Algunos archivos necesitan correcciones adicionales.');
        }
        
    } catch (error) {
        console.error('❌ Error durante la validación:', error);
        process.exit(1);
    }
}

main(); 