/**
 * 🎓 DEMO DE CLASE: cy.prompt() - Ejemplos en ESPAÑOL
 * 
 * Este archivo muestra cómo usar cy.prompt() con lenguaje natural en ESPAÑOL.
 * 
 * IMPORTANTE: 
 * - cy.prompt() oficial de Cypress está optimizado para inglés
 * - Este ejemplo usa nuestro fallback que SÍ soporta español
 * - Los ejemplos funcionan perfectamente con comandos en español
 */

// Helper para usar cy.prompt con fallback automático
function usePrompt(steps, options = {}) {
  return cy.promptWithFallback(steps, options);
}

describe('🎓 Demo: cy.prompt() - Ejemplos en ESPAÑOL', () => {
  
  /**
   * EJEMPLO 1: Login básico en español
   */
  it('Ejemplo 1: Login básico con lenguaje natural en español', () => {
    usePrompt([
      'visitar https://www.saucedemo.com',
      'escribir "standard_user" en el campo de usuario',
      'escribir "secret_sauce" en el campo de contraseña',
      'hacer clic en el botón de login',
      'verificar que somos redirigidos a la página de inventario',
    ])
  })

  /**
   * EJEMPLO 2: Login con placeholders en español
   */
  it('Ejemplo 2: Login con placeholders en español', () => {
    const contraseña = 'secret_sauce'
    
    usePrompt(
      [
        'visitar https://www.saucedemo.com',
        'escribir "standard_user" en el campo de usuario',
        'escribir {{contraseña}} en el campo de contraseña',
        'hacer clic en el botón de login',
        'verificar que el contenedor de inventario es visible',
      ],
      {
        placeholders: {
          contraseña: contraseña,
        },
      }
    )
  })

  /**
   * EJEMPLO 3: Estilo Gherkin/BDD en español
   */
  it('Ejemplo 3: Login estilo Gherkin/BDD en español', () => {
    usePrompt([
      'Dado que el usuario está en la página de login',
      'Cuando el usuario escribe "standard_user" en el campo de usuario',
      'Y el usuario escribe "secret_sauce" en el campo de contraseña',
      'Y el usuario hace clic en el botón de login',
      'Entonces el usuario debería ser redirigido a la página de inventario',
      'Y el contenedor de inventario debería ser visible',
    ])
  })

  /**
   * EJEMPLO 4: Validación de errores en español
   */
  it('Ejemplo 4: Validar error de usuario bloqueado en español', () => {
    usePrompt([
      'visitar https://www.saucedemo.com',
      'escribir "locked_out_user" en el campo de usuario',
      'escribir "secret_sauce" en el campo de contraseña',
      'hacer clic en el botón de login',
      'verificar que el mensaje de error contiene "locked out"',
      'verificar que todavía estamos en la página de login',
    ])
  })

  /**
   * EJEMPLO 5: Flujo completo en español
   */
  it('Ejemplo 5: Flujo completo - Login y agregar producto al carrito en español', () => {
    usePrompt([
      'visitar https://www.saucedemo.com',
      'escribir "standard_user" en el campo de usuario',
      'escribir "secret_sauce" en el campo de contraseña',
      'hacer clic en el botón de login',
      'verificar que la página de inventario carga',
      'hacer clic en el botón "Agregar al carrito" del primer producto',
      'verificar que el ícono del carrito muestra 1 artículo',
      'hacer clic en el ícono del carrito',
      'verificar que la página del carrito se muestra',
      'verificar que el producto está en el carrito',
    ])
  })
})

describe('🎓 Demo: cy.prompt() - Mejores prácticas en ESPAÑOL', () => {
  
  /**
   * BUENA PRÁCTICA 1: Pasos claros y descriptivos en español
   */
  it('Buena práctica 1: Pasos claros y descriptivos en español', () => {
    usePrompt([
      // ✅ OK: Específico y claro
      'visitar https://www.saucedemo.com',
      'escribir "standard_user" en el campo de usuario',
      'escribir "secret_sauce" en el campo de contraseña',
      'hacer clic en el botón "Login"',
      'verificar que el encabezado "Products" es visible',
      
      // Comparar con esto (❌ ERRONEO):
      // 'ir al sitio',
      // 'ingresar usuario',
      // 'clic en botón',
      // 'verificar página',
    ])
  })

  /**
   * BUENA PRÁCTICA 2: Un paso = una acción en español
   */
  it('Buena práctica 2: Un paso = una acción en español', () => {
    usePrompt([
      // ✅ OK: Una acción por paso
      'visitar https://www.saucedemo.com',
      'escribir "standard_user" en el campo de usuario',
      'escribir "secret_sauce" en el campo de contraseña',
      'hacer clic en el botón de login',
      
      // Comparar con esto (❌ ERRONEO):
      // 'visitar sitio e iniciar sesión con standard_user y secret_sauce',
    ])
  })

  /**
   * BUENA PRÁCTICA 3: Usar comillas para valores específicos en español
   */
  it('Buena práctica 3: Usar comillas para valores específicos en español', () => {
    usePrompt([
      // ✅ OK: Valores específicos entre comillas
      'visitar https://www.saucedemo.com',
      'escribir "standard_user" en el campo de usuario',
      'escribir "secret_sauce" en el campo de contraseña',
      'hacer clic en el botón "Login"',
      'verificar que el encabezado "Products" es visible',
      
      // Comparar con esto (❌ ERRONEO):
      // 'hacer clic en botón Login',
      // 'verificar encabezado Products',
    ])
  })

  /**
   * BUENA PRÁCTICA 4: Usar placeholders en español
   */
  it('Buena práctica 4: Usar placeholders para datos dinámicos en español', () => {
    const usuarios = ['standard_user', 'problem_user', 'performance_glitch_user']
    
    usuarios.forEach((usuario) => {
      usePrompt(
        [
          'visitar https://www.saucedemo.com',
          `escribir "{{usuario}}" en el campo de usuario`,
          `escribir "secret_sauce" en el campo de contraseña`,
          'hacer clic en el botón de login',
          'verificar que la página de inventario carga',
        ],
        {
          placeholders: {
            usuario: usuario,
          },
        }
      )
    })
  })
})

