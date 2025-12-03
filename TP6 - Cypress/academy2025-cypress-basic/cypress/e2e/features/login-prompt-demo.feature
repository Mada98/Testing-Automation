Feature: 🎓 Demo de cy.prompt() - Login con lenguaje natural
  Como instructor de Cypress
  Quiero mostrar ejemplos de cy.prompt() a mis alumnos
  Para que aprendan a escribir tests con lenguaje natural

  @demo @prompt
  Scenario: Login básico usando cy.prompt
    Given Estoy en la página de login usando cy.prompt
    When Ingreso credenciales usando cy.prompt
    Then Valido login exitoso usando cy.prompt

  @demo @prompt
  Scenario Outline: Login con múltiples usuarios usando cy.prompt
    Given Estoy en la página de login usando cy.prompt
    When Me logueo usando cy.prompt con usuario "<username>" y contraseña "<password>"
    Then Valido login exitoso usando cy.prompt

    Examples:
      | username                  | password      |
      | standard_user             | secret_sauce  |
      | problem_user              | secret_sauce  |
      | performance_glitch_user   | secret_sauce  |

  @demo @prompt @error
  Scenario: Validar error de usuario bloqueado usando cy.prompt
    Given Estoy en la página de login usando cy.prompt
    When Intento loguearme con usuario bloqueado usando cy.prompt
    Then Valido mensaje de error usando cy.prompt

  @demo @prompt @ecommerce
  Scenario: Flujo completo - Login y agregar producto usando cy.prompt
    Given Estoy en la página de login usando cy.prompt
    When Ingreso credenciales usando cy.prompt
    And Agrego producto al carrito usando cy.prompt
    Then Valido producto en carrito usando cy.prompt

