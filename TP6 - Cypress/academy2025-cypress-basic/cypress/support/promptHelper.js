/**
 * 🎓 Helper para cy.prompt() - Fallback cuando cy.prompt oficial no está disponible
 * 
 * Este helper detecta si cy.prompt() oficial está disponible.
 * Si no lo está, ejecuta comandos tradicionales de Cypress equivalentes.
 */

/**
 * Verifica si cy.prompt() oficial está disponible
 */
function isPromptAvailable() {
  try {
    // Intentar verificar si el comando existe
    // En Cypress v15.4.0+ con experimentalPromptCommand: true, debería existir
    return typeof Cypress.Commands._commands.prompt === 'function' ||
           Cypress.version && parseInt(Cypress.version.split('.')[0]) >= 15 &&
           parseInt(Cypress.version.split('.')[1]) >= 4;
  } catch (e) {
    return false;
  }
}

/**
 * Convierte pasos de lenguaje natural a comandos tradicionales de Cypress
 * Esta es una implementación básica para demostración
 * Usa encadenamiento de comandos de Cypress para ejecutar secuencialmente
 */
function executeTraditionalCommands(steps, placeholders = {}) {
  cy.log('⚠️ cy.prompt() oficial no disponible. Usando comandos tradicionales como fallback.');
  
  // Verificar si necesitamos visitar la página primero
  // Soporta inglés y español
  // IMPORTANTE: Solo visitar si hay un paso explícito de "visit" o "visitar"
  // No visitar automáticamente para mantener el estado entre step definitions
  let needsInitialVisit = false;
  const firstStep = steps[0]?.toLowerCase() || '';
  const hasExplicitVisit = steps.some(step => {
    const stepLower = step.toLowerCase();
    return stepLower.startsWith('visit ') || 
           stepLower.startsWith('visitar ') ||
           stepLower.includes('given the user is on') ||
           stepLower.includes('dado que el usuario está') ||
           stepLower.includes('dado que el usuario esta');
  });
  
  // Solo visitar inicialmente si hay un paso explícito de visita
  if (hasExplicitVisit) {
    if (firstStep.includes('visit ') || 
        firstStep.includes('visitar ') ||
        firstStep.includes('given the user is on') ||
        firstStep.includes('dado que el usuario está') ||
        firstStep.includes('dado que el usuario esta')) {
      needsInitialVisit = false; // Se procesará en el bucle
    }
  }
  
  // Procesar el primer paso y encadenar los siguientes
  let chain = needsInitialVisit ? cy.visit('https://www.saucedemo.com') : cy.wrap(null);
  
  steps.forEach((step, index) => {
    // Guardar el paso original para buscar placeholders
    const originalStep = step;
    
    // Reemplazar placeholders ANTES de procesar
    // Mejorado para soportar caracteres especiales en las claves (ñ, á, é, etc.)
    let processedStep = step;
    Object.keys(placeholders).forEach(key => {
      // Buscar y reemplazar placeholders directamente sin regex complejo
      // Esto maneja mejor caracteres especiales como ñ
      const placeholderPattern = `{{${key}}}`;
      if (processedStep.includes(placeholderPattern)) {
        processedStep = processedStep.replace(new RegExp(placeholderPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), placeholders[key]);
      }
    });
    
    const stepLower = processedStep.toLowerCase().trim();
    
    chain = chain.then(() => {
      // Visit - maneja múltiples variaciones (inglés y español)
      if (stepLower.startsWith('visit ') || 
          stepLower.startsWith('visitar ') ||
          stepLower.includes('given the user is on') || 
          stepLower.includes('dado que el usuario está') ||
          stepLower.includes('dado que el usuario esta') ||
          stepLower.includes('on the login page') ||
          stepLower.includes('en la página de login') ||
          stepLower.includes('en la pagina de login')) {
        const urlMatch = processedStep.match(/(?:visit|visitar)\s+(.+?)(?:\s|$)/i);
        if (urlMatch) {
          const url = urlMatch[1].replace(/['"]/g, '').trim();
          return cy.visit(url);
        } else {
          return cy.visit('https://www.saucedemo.com');
        }
      }
      // Type in field - maneja inglés y español
      // Inglés: "type", "enters", "And the user enters"
      // Español: "escribir", "escribe", "Y el usuario escribe", "Cuando el usuario escribe"
      // También maneja placeholders {{variable}}
      // Mejorado para reconocer pasos estilo Gherkin que empiezan con "Cuando", "Y", etc.
      // Simplificado: si contiene acción de escribir Y referencia a campo/usuario/contraseña, procesar
      else if ((stepLower.includes('type') || 
                stepLower.includes('enters') || 
                stepLower.includes('escribir') ||
                stepLower.includes('escribe') ||
                stepLower.includes('el usuario escribe') ||
                stepLower.includes('cuando el usuario escribe') ||
                stepLower.includes('y el usuario escribe')) && 
               (stepLower.includes('field') || 
                stepLower.includes('campo') ||
                stepLower.includes('username') || 
                stepLower.includes('user-name') ||
                stepLower.includes('usuario') ||
                stepLower.includes('password') ||
                stepLower.includes('contraseña'))) {
        let value = null;
        
        // Primero buscar si hay un placeholder {{variable}} en el paso original
        // Mejorado para soportar caracteres especiales como ñ, á, é, etc.
        const placeholderMatch = originalStep.match(/\{\{([^}]+)\}\}/);
        if (placeholderMatch && placeholders[placeholderMatch[1]]) {
          // Usar el valor del placeholder
          value = placeholders[placeholderMatch[1]];
        } else {
          // Buscar valor entre comillas en el paso procesado (ya con placeholders reemplazados)
          // Soporta inglés y español, incluyendo pasos estilo Gherkin
          // Busca el patrón: [acción] ["valor"] o [acción] "valor"
          // Ejemplos: "escribir "standard_user"", "el usuario escribe "standard_user"", "Cuando el usuario escribe "standard_user""
          // Primero intentar con el patrón completo
          let match = processedStep.match(/(?:type|enters|escribir|escribe|el usuario escribe|cuando el usuario escribe|y el usuario escribe)\s+["'](.+?)["']/i);
          if (!match) {
            // Si no funciona, buscar cualquier texto seguido de comillas después de "escribe"
            match = processedStep.match(/escribe\s+["'](.+?)["']/i);
          }
          if (!match) {
            // Fallback: buscar cualquier valor entre comillas (último recurso)
            match = processedStep.match(/["'](.+?)["']/);
          }
          if (match) {
            value = match[1];
          }
        }
        
        if (value) {
          // IMPORTANTE: Verificar contraseña PRIMERO porque el paso puede contener "usuario" en "el usuario escribe"
          // pero si menciona "contraseña" o "campo de contraseña", debe ser el campo de contraseña
          if (stepLower.includes('password') ||
              stepLower.includes('contraseña') ||
              stepLower.includes('campo de contraseña')) {
            // Asegurarse de que el campo de contraseña esté habilitado antes de escribir
            return cy.get('#password').should('not.be.disabled').type(value);
          } else if (stepLower.includes('username') || 
                     stepLower.includes('user-name') ||
                     stepLower.includes('usuario') ||
                     stepLower.includes('campo de usuario')) {
            // Asegurarse de que el campo de usuario esté habilitado antes de escribir
            return cy.get('#user-name').should('not.be.disabled').type(value);
          }
        }
        // Si no se encuentra valor, continuar sin hacer nada
        return cy.wrap(null);
      }
      // Click button - maneja múltiples variaciones (inglés y español)
      // Incluye pasos estilo Gherkin: "Y el usuario hace clic", "Cuando el usuario hace clic"
      else if ((stepLower.includes('click') || 
                stepLower.includes('clicks') ||
                stepLower.includes('clic') ||
                stepLower.includes('hacer clic') ||
                stepLower.includes('el usuario hace clic') ||
                stepLower.includes('cuando el usuario hace clic') ||
                stepLower.includes('y el usuario hace clic')) && 
               (stepLower.includes('button') || 
                stepLower.includes('botón') ||
                stepLower.includes('boton') ||
                stepLower.includes('login') || 
                stepLower.includes('cart') ||
                stepLower.includes('carrito'))) {
        // Verificar que estamos en la página correcta antes de hacer click
        if (stepLower.includes('login')) {
          // Si estamos haciendo click en login pero no hemos visitado, visitar primero
          return cy.url().then((url) => {
            if (!url.includes('saucedemo.com')) {
              return cy.visit('https://www.saucedemo.com').then(() => {
                return cy.get('#login-button').click();
              });
            }
            return cy.get('#login-button').click();
          });
        } else if (stepLower.includes('add to cart') ||
                   stepLower.includes('agregar al carrito') ||
                   stepLower.includes('añadir al carrito') ||
                   stepLower.includes('agregar al carrito del primer producto')) {
          return cy.get('.btn_inventory').first().click();
        } else if ((stepLower.includes('cart icon') || 
                    stepLower.includes('ícono del carrito') ||
                    stepLower.includes('icono del carrito') ||
                    stepLower.includes('cart')) && !stepLower.includes('page') && !stepLower.includes('página')) {
          return cy.get('.shopping_cart_link').click();
        }
      }
      // Verify/Assert/Then - maneja múltiples variaciones (inglés y español)
      // Inglés: "verify", "assert", "then", "and"
      // Español: "verificar", "verifica", "entonces", "y", "cuando"
      // IMPORTANTE: Solo verificar si NO es un paso de acción (escribir, click, etc.)
      // Los pasos que empiezan con "cuando" o "y" pero contienen acciones se procesan arriba
      else if ((stepLower.startsWith('verify') || 
               stepLower.startsWith('assert') || 
               stepLower.startsWith('then') ||
               stepLower.startsWith('verificar') || 
               stepLower.startsWith('verifica') ||
               stepLower.startsWith('entonces')) ||
               // Solo procesar "y" o "cuando" como verificación si NO contienen acciones
               ((stepLower.startsWith('and') || stepLower.startsWith('y ') || stepLower.startsWith('cuando')) &&
                !stepLower.includes('escribe') &&
                !stepLower.includes('hace clic') &&
                !stepLower.includes('click'))) {
        // Redirección / Página de inventario (inglés y español)
        // Mejorado para reconocer pasos completos estilo Gherkin
        if (stepLower.includes('redirected') || 
            stepLower.includes('redirigidos') ||
            stepLower.includes('redirigido') ||
            stepLower.includes('redirigida') ||
            stepLower.includes('inventory page') ||
            stepLower.includes('página de inventario') ||
            stepLower.includes('pagina de inventario') ||
            stepLower.includes('should be redirected') ||
            stepLower.includes('debería ser redirigido') ||
            stepLower.includes('deberia ser redirigido') ||
            stepLower.includes('debería ser redirigida') ||
            stepLower.includes('deberia ser redirigida') ||
            stepLower.includes('el usuario debería ser redirigido') ||
            stepLower.includes('el usuario deberia ser redirigido') ||
            stepLower.includes('el usuario debería ser redirigida') ||
            stepLower.includes('el usuario deberia ser redirigida')) {
          return cy.url().should('include', '/inventory.html');
        } 
        // Contenedor de inventario (inglés y español)
        else if (stepLower.includes('inventory container') || 
                 stepLower.includes('contenedor de inventario') ||
                 stepLower.includes('contenedor de inventario debería') ||
                 stepLower.includes('contenedor de inventario deberia') ||
                 stepLower.includes('inventory page loads') ||
                 stepLower.includes('página de inventario carga') ||
                 stepLower.includes('pagina de inventario carga') ||
                 stepLower.includes('should be visible') ||
                 stepLower.includes('es visible') ||
                 stepLower.includes('debería ser visible') ||
                 stepLower.includes('deberia ser visible')) {
          return cy.get('.inventory_container').should('be.visible');
        } 
        // Mensaje de error (inglés y español)
        else if ((stepLower.includes('error message') || 
                  stepLower.includes('mensaje de error')) && 
                 stepLower.includes('locked out')) {
          return cy.get('h3[data-test="error"]').should('contain.text', 'locked out');
        } 
        // Ícono del carrito con 1 artículo (inglés y español)
        else if ((stepLower.includes('cart icon') || 
                  stepLower.includes('ícono del carrito') ||
                  stepLower.includes('icono del carrito') ||
                  stepLower.includes('carrito muestra')) && 
                 (stepLower.includes('1 item') || 
                  stepLower.includes('1 artículo') ||
                  stepLower.includes('1 articulo'))) {
          return cy.get('.shopping_cart_badge').should('contain.text', '1');
        } 
        // Página del carrito (inglés y español)
        else if (stepLower.includes('cart page') ||
                 stepLower.includes('página del carrito') ||
                 stepLower.includes('página del carrito se muestra')) {
          return cy.url().should('include', '/cart.html');
        } 
        // Producto en el carrito (inglés y español)
        else if ((stepLower.includes('product') || 
                  stepLower.includes('producto')) && 
                 (stepLower.includes('cart') || 
                  stepLower.includes('carrito'))) {
          return cy.get('.cart_item').should('exist');
        } 
        // Encabezado Products (inglés y español)
        else if ((stepLower.includes('products') || 
                  stepLower.includes('products')) && 
                 (stepLower.includes('heading') || 
                  stepLower.includes('encabezado'))) {
          // Buscar el texto "Products" en la página después del login
          // Esperar a que la página de inventario cargue completamente
          return cy.url().should('include', '/inventory.html').then(() => {
            return cy.contains('Products').should('be.visible');
          });
        }
        // Formulario de login (inglés y español)
        else if ((stepLower.includes('login form') || 
                  stepLower.includes('formulario de login')) && 
                 (stepLower.includes('visible') || 
                  stepLower.includes('is visible'))) {
          return cy.get('#login-button').should('be.visible');
        }
      }
      // Still on login page (inglés y español)
      else if ((stepLower.includes('still on') || 
                stepLower.includes('todavía estamos') ||
                stepLower.includes('todavía está')) && 
               (stepLower.includes('login page') || 
                stepLower.includes('página de login'))) {
        return cy.url().should('eq', Cypress.config('baseUrl') + '/');
      }
      
      // Si no coincide con ningún patrón, continuar sin hacer nada
      return cy.wrap(null);
    });
  });
  
  return chain;
}

/**
 * Wrapper para cy.prompt() con fallback automático
 */
Cypress.Commands.add('promptWithFallback', (steps, options = {}) => {
  const { placeholders = {} } = options;
  
  // Verificar si cy.prompt oficial está disponible
  if (isPromptAvailable() && typeof cy.prompt === 'function') {
    cy.log('✅ Usando cy.prompt() oficial de Cypress');
    return cy.prompt(steps, options);
  } else {
    // Usar fallback con comandos tradicionales
    cy.log('⚠️ cy.prompt() oficial no disponible. Usando comandos tradicionales.');
    return executeTraditionalCommands(steps, placeholders);
  }
});

export { isPromptAvailable, executeTraditionalCommands };

