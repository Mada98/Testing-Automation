@Login @Regression
Feature: Login

  Background:
    Given el usuario se encuentra en la pagina de login de Swag Labs

  @Smoke @LoginExitosoEstandar
  Scenario: Inicio de sesion exitoso con usuario estandar
    When el usuario ingresa "standard_user" en el campo de texto "Username"
    And el usuario ingresa "secret_sauce" en el campo de texto "Password"
    And el usuario hace click en el boton "Login"
    Then Se muestra el titulo de la pagina de productos

  @Smoke @LoginFallido
  Scenario: Inicio de sesion fallido con usuario incorrecto
    When el usuario ingresa "locked_out_user" en el campo de texto "Username"
    And el usuario ingresa "secret_sauce" en el campo de texto "Password"
    And el usuario hace click en el boton "Login"
    Then Se muestra el mensaje de error "Epic sadface: Sorry, this user has been locked out."

