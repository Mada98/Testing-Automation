@Login @Regression
Feature: Login

  Background:
    Given el usuario se encuentra en la pagina de login de Swag Labs

  @Smoke @LoginExitoso
  Scenario Outline: Inicio de sesion exitoso con multiples usuarios
    When el usuario ingresa el nombre de usuario "<username>"
    And el usuario ingresa la contrasenia "<password>"
    And el usuario hace click en el boton "Login"
    Then se muestra el titulo de la pagina de productos

    Examples:
      | username                | password     |
      | standard_user           | secret_sauce |
      | problem_user            | secret_sauce |
      | performance_glitch_user | secret_sauce |
      | error_user              | secret_sauce |
      | visual_user             | secret_sauce |

  @LoginFallido
  Scenario Outline: Inicio de secion fallido con multiples usuarios
    When el usuario ingresa el nombre de usuario "<username>"
    And el usuario ingresa la contrasenia "<password>"
    And el usuario hace click en el boton "Login"
    Then se muestra el mensaje "<error>"

    Examples:
      | username        | password     | error                                                                     |
      | locked_out_user | secret_sauce | Epic sadface: Sorry, this user has been locked out.                       |
      | pepe            | pepe         | Epic sadface: Username and password do not match any user in this service |


