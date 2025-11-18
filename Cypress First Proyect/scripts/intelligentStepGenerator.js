const fs = require('fs').promises;
const path = require('path');

/**
 * 🧠 INTELLIGENT STEP GENERATOR - Generador de Steps
 * 
 * Este sistema PREVIENE problemas en lugar de corregirlos después:
 * 1. 🎯 Genera steps atómicos y válidos desde el origen
 * 2. 🔧 Aplica reglas de Gherkin automáticamente  
 * 3. 🚫 Previene "And" en lugares incorrectos
 * 4. 📝 Crea templates reutilizables
 * 5. ✅ Valida antes de escribir archivos
 */

class IntelligentStepGenerator {
    constructor() {
        this.gherkinRules = {
            // Palabras clave válidas en español e inglés
            validKeywords: {
                'Given': ['Dado', 'Dada', 'Dados', 'Dadas'],
                'When': ['Cuando'],
                'Then': ['Entonces'],
                'And': ['Y', 'E'],
                'But': ['Pero']
            },
            
            // Patrones para determinar tipo de step
            stepPatterns: {
                'Given': [
                    /^(navego|estoy|tengo|existe|hay|abro)\s+/i,
                    /^(que\s+)?(el|la|los|las)\s+\w+\s+(está|están|tiene|tienen)/i,
                    /^(se\s+)?(carga|muestra|visualiza)\s+/i
                ],
                'When': [
                    /^(hago\s+click|ingreso|escribo|selecciono|presiono|busco)\s+/i,
                    /^(completo|realizo|ejecuto|navego\s+a)\s+/i,
                    /^(el\s+usuario|usuario)\s+(hace|realiza|ingresa)\s+/i
                ],
                'Then': [
                    /^(verifico|compruebo|valido|confirmo|veo)\s+que\s+/i,
                    /^(debe|debería|tiene\s+que)\s+(mostrar|aparecer|estar|tener)/i,
                    /^(se\s+)?(muestra|visualiza|presenta)\s+/i
                ]
            },
            
            // Palabras prohibidas para evitar steps gigantes
            forbiddenPatterns: [
                /^\d+\)\s+/,  // Números con paréntesis como "1) 2) 3)"
                /http[s]?:\/\//,  // URLs directas en steps
                /.{150,}/,  // Steps demasiado largos (más de 150 caracteres)
                /\d+\)\s*[A-Z]/g  // Listas numeradas
            ]
        };
        
        // Templates pre-definidos para acciones comunes
        this.stepTemplates = {
            navigation: {
                pattern: /naveg[oa]r?\s+(a|al|hacia)\s+(.+)/i,
                template: (match) => `Given("navego a ${match[2]}", () => { /* navigation logic */ })`
            },
            click: {
                pattern: /(hago\s+)?click\s+(en|sobre)\s+(.+)/i,
                template: (match) => `When("hago click en ${match[3]}", () => { /* click logic */ })`
            },
            input: {
                pattern: /(ingreso|escribo)\s+(.+)\s+en\s+(.+)/i,
                template: (match) => `When("ingreso ${match[2]} en ${match[3]}", () => { /* input logic */ })`
            },
            verification: {
                pattern: /(verifico|valido)\s+que\s+(.+)/i,
                template: (match) => `Then("verifico que ${match[2]}", () => { /* verification logic */ })`
            }
        };
        
        this.generatedSteps = new Set();
        this.validationErrors = [];
    }
    
    // ========================================================================
    // MÉTODO PRINCIPAL - GENERADOR DE STEPS 
    // ========================================================================
    async generateValidSteps(inputData) {
        console.log('🧠 INICIANDO GENERACIÓN DE STEPS...\n');
        
        const validSteps = [];
        const errors = [];
        
        try {
            for (const item of inputData) {
                const processedSteps = await this.processStepItem(item);
                validSteps.push(...processedSteps.valid);
                errors.push(...processedSteps.errors);
            }
            
            // Validación final
            const finalValidation = this.performFinalValidation(validSteps);
            
            console.log(`✅ Steps válidos generados: ${validSteps.length}`);
            console.log(`❌ Items rechazados: ${errors.length}`);
            
            return {
                steps: finalValidation.steps,
                errors: [...errors, ...finalValidation.errors],
                statistics: this.generateStatistics(validSteps, errors)
            };
            
        } catch (error) {
            console.error('❌ Error en generación:', error);
            throw error;
        }
    }
    
    // ========================================================================
    // PROCESAMIENTO DE ITEMS
    // ========================================================================
    async processStepItem(item) {
        const valid = [];
        const errors = [];
        
        // Si es un texto muy largo, fragmentarlo estrategicamente
        if (this.isComplexStep(item)) {
            const fragments = this.fragmentComplexStep(item);
            for (const fragment of fragments) {
                const processed = this.createAtomicStep(fragment);
                if (processed.isValid) {
                    valid.push(processed.step);
                } else {
                    errors.push({ item: fragment, reason: processed.reason });
                }
            }
        } else {
            // Procesar como step simple
            const processed = this.createAtomicStep(item);
            if (processed.isValid) {
                valid.push(processed.step);
            } else {
                errors.push({ item, reason: processed.reason });
            }
        }
        
        return { valid, errors };
    }
    
    // ========================================================================
    // VALIDACIÓN DE COMPLEJIDAD
    // ========================================================================
    isComplexStep(item) {
        const text = typeof item === 'string' ? item : item.text || '';
        
        // Verificar patrones prohibidos
        return this.gherkinRules.forbiddenPatterns.some(pattern => pattern.test(text));
    }
    
    // ========================================================================
    // FRAGMENTACIÓN OPTIMIZADA
    // ========================================================================
    fragmentComplexStep(item) {
        const text = typeof item === 'string' ? item : item.text || '';
        
        // Separar por números con paréntesis
        const fragments = text.split(/\d+\)\s*/).filter(fragment => fragment.trim().length > 0);
        
        // Limpiar cada fragmento
        return fragments.map(fragment => {
            return fragment
                .replace(/^[^\w]*/, '') // Limpiar inicio
                .replace(/[^\w\s]*$/, '') // Limpiar final
                .trim();
        }).filter(fragment => fragment.length > 10); // Solo fragmentos útiles
    }
    
    // ========================================================================
    // CREACIÓN DE STEPS ATÓMICOS
    // ========================================================================
    createAtomicStep(item) {
        const text = typeof item === 'string' ? item : item.text || '';
        
        // Validaciones iniciales
        if (!this.passesInitialValidation(text)) {
            return { 
                isValid: false, 
                reason: 'Falla validación inicial (muy corto, contiene URLs, etc.)' 
            };
        }
        
        // Limpiar y normalizar texto
        const cleanText = this.cleanStepText(text);
        
        // Determinar tipo de step
        const stepType = this.determineStepType(cleanText);
        
        // Verificar duplicados
        if (this.generatedSteps.has(cleanText.toLowerCase())) {
            return { 
                isValid: false, 
                reason: 'Step duplicado detectado' 
            };
        }
        
        // Aplicar template si existe
        const stepCode = this.applyStepTemplate(stepType, cleanText);
        
        // Marcar como generado
        this.generatedSteps.add(cleanText.toLowerCase());
        
        return {
            isValid: true,
            step: {
                type: stepType,
                text: cleanText,
                code: stepCode,
                category: this.categorizeStep(cleanText)
            }
        };
    }
    
    // ========================================================================
    // VALIDACIONES
    // ========================================================================
    passesInitialValidation(text) {
        // Muy corto
        if (text.length < 5) return false;
        
        // Contiene URL
        if (/http[s]?:\/\//.test(text)) return false;
        
        // Demasiado largo
        if (text.length > 150) return false;
        
        // Solo números o caracteres especiales
        if (!/[a-zA-ZáéíóúñÁÉÍÓÚÑ]/.test(text)) return false;
        
        return true;
    }
    
    cleanStepText(text) {
        return text
            .replace(/^\d+\)\s*/, '') // Quitar números del inicio
            .replace(/^[^\w]*/, '') // Limpiar caracteres especiales del inicio
            .replace(/[^\w\s.,;:(){}[\]"'áéíóúñÁÉÍÓÚÑ-]*$/, '') // Limpiar final
            .replace(/\s+/g, ' ') // Normalizar espacios
            .trim();
    }
    
    determineStepType(text) {
        const lowerText = text.toLowerCase();
        
        // Verificar patrones para cada tipo
        for (const [type, patterns] of Object.entries(this.gherkinRules.stepPatterns)) {
            if (patterns.some(pattern => pattern.test(lowerText))) {
                return type;
            }
        }
        
        // Lógica para casos ambiguos (NO usar And como default)
        // Given: Estados iniciales, navegación, configuración
        if (lowerText.includes('naveg') || lowerText.includes('visit') || 
            lowerText.includes('estoy') || lowerText.includes('cargo') ||
            lowerText.includes('abro') || lowerText.includes('inicio')) {
            return 'Given';
        }
        
        // When: Acciones del usuario, interacciones
        if (lowerText.includes('click') || lowerText.includes('ingres') ||
            lowerText.includes('seleccion') || lowerText.includes('presion') ||
            lowerText.includes('escribo') || lowerText.includes('completo') ||
            lowerText.includes('realizo') || lowerText.includes('ejecuto') ||
            lowerText.includes('busco') || lowerText.includes('lleno')) {
            return 'When';
        }
        
        // Then: Verificaciones, validaciones, comprobaciones
        if (lowerText.includes('verific') || lowerText.includes('valid') ||
            lowerText.includes('comprueb') || lowerText.includes('confirm') ||
            lowerText.includes('debe') || lowerText.includes('veo') ||
            lowerText.includes('muestra') || lowerText.includes('aparece') ||
            lowerText.includes('espero que') || lowerText.includes('puedo ver')) {
            return 'Then';
        }
        
        // Default basado en verbos de acción
        if (lowerText.match(/^(hago|realizo|ejecuto|busco|selecciono|ingreso|escribo)/)) {
            return 'When';
        }
        
        if (lowerText.match(/^(verifico|confirmo|valido|compruebo|veo|debe)/)) {
            return 'Then';
        }
        
        // Si todo falla, usar When como default más seguro
        return 'When';
    }
    
    categorizeStep(text) {
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('naveg') || lowerText.includes('visit')) return 'navigation';
        if (lowerText.includes('click') || lowerText.includes('presion')) return 'interaction';
        if (lowerText.includes('ingres') || lowerText.includes('escrib')) return 'input';
        if (lowerText.includes('verific') || lowerText.includes('valid')) return 'verification';
        if (lowerText.includes('espera') || lowerText.includes('wait')) return 'wait';
        
        return 'general';
    }
    
    // ========================================================================
    // TEMPLATES DE STEPS
    // ========================================================================
    applyStepTemplate(stepType, text) {
        // Buscar template específico
        for (const [name, template] of Object.entries(this.stepTemplates)) {
            const match = text.match(template.pattern);
            if (match) {
                return template.template(match);
            }
        }
        
        // Template genérico
        return this.generateGenericStep(stepType, text);
    }
    
    generateGenericStep(stepType, text) {
        const cleanText = text.replace(/"/g, '\\"'); // Escapar comillas
        
        return `${stepType}("${cleanText}", () => {
    cy.log('📝 Ejecutando: ${cleanText}');
    // TODO: Implementar lógica específica
    cy.log('⚠️ Pendiente de implementación');
});`;
    }
    
    // ========================================================================
    // VALIDACIÓN FINAL
    // ========================================================================
    performFinalValidation(steps) {
        const validSteps = [];
        const errors = [];
        
        for (const step of steps) {
            // Verificar sintaxis básica de JavaScript
            if (this.isValidJavaScript(step.code)) {
                validSteps.push(step);
            } else {
                errors.push({ 
                    step: step.text, 
                    reason: 'Sintaxis JavaScript inválida' 
                });
            }
        }
        
        return { steps: validSteps, errors };
    }
    
    isValidJavaScript(code) {
        try {
            // Verificación básica de sintaxis
            new Function(code);
            return true;
        } catch (error) {
            return false;
        }
    }
    
    // ========================================================================
    // GENERACIÓN DE ESTADÍSTICAS
    // ========================================================================
    generateStatistics(validSteps, errors) {
        const categories = {};
        const stepTypes = {};
        
        validSteps.forEach(step => {
            // Contar por categoría
            categories[step.category] = (categories[step.category] || 0) + 1;
            
            // Contar por tipo
            stepTypes[step.type] = (stepTypes[step.type] || 0) + 1;
        });
        
        return {
            total: validSteps.length,
            errors: errors.length,
            successRate: Math.round((validSteps.length / (validSteps.length + errors.length)) * 100),
            categories,
            stepTypes,
            duplicatesAvoided: this.generatedSteps.size - validSteps.length
        };
    }
    
    // ========================================================================
    // GENERAR ARCHIVO DE STEPS FINAL
    // ========================================================================
    async generateStepsFile(steps, fileName) {
        const imports = `import { Given, When, Then, And } from "@badeball/cypress-cucumber-preprocessor";

/**
 * 🧠 STEPS GENERADOS
 * Archivo: ${fileName}
 * Generado: ${new Date().toISOString()}
 * 
 * Total steps: ${steps.length}
 * Validación: ✅ Sintaxis verificada
 * Duplicados: ❌ Evitados automáticamente
 */

`;
        
        const stepsByCategory = this.groupByCategory(steps);
        
        let content = imports;
        
        for (const [category, categorySteps] of Object.entries(stepsByCategory)) {
            content += `// ========================================\n`;
            content += `// ${category.toUpperCase()} STEPS\n`;
            content += `// ========================================\n\n`;
            
            for (const step of categorySteps) {
                content += step.code + '\n\n';
            }
        }
        
        return content;
    }
    
    groupByCategory(steps) {
        const grouped = {};
        steps.forEach(step => {
            if (!grouped[step.category]) {
                grouped[step.category] = [];
            }
            grouped[step.category].push(step);
        });
        return grouped;
    }
}

// ============================================================================
// FUNCIÓN PRINCIPAL
// ============================================================================
async function generateIntelligentSteps(inputData, outputPath) {
    const generator = new IntelligentStepGenerator();
    
    try {
        const result = await generator.generateValidSteps(inputData);
        
        if (result.steps.length > 0) {
            const stepsContent = await generator.generateStepsFile(
                result.steps, 
                path.basename(outputPath)
            );
            
            await fs.writeFile(outputPath, stepsContent, 'utf8');
            
            console.log(`\n📊 ESTADÍSTICAS DE GENERACIÓN:`);
            console.log(`✅ Steps válidos: ${result.statistics.total}`);
            console.log(`❌ Items rechazados: ${result.statistics.errors}`);
            console.log(`📈 Tasa de éxito: ${result.statistics.successRate}%`);
            console.log(`🚫 Duplicados evitados: ${result.statistics.duplicatesAvoided}`);
            
            console.log(`\n📋 Por categoría:`);
            Object.entries(result.statistics.categories).forEach(([cat, count]) => {
                console.log(`   ${cat}: ${count}`);
            });
            
            return result;
        } else {
            throw new Error('No se pudieron generar steps válidos');
        }
        
    } catch (error) {
        console.error('❌ Error generando steps:', error);
        throw error;
    }
}

module.exports = {
    IntelligentStepGenerator,
    generateIntelligentSteps
}; 