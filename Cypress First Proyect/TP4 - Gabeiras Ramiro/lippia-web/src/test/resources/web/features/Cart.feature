@Cart @Regression
Feature: Cart

  Background:
    Given el usuario se encuentra en la pagina de login de Swag Labs

  @Smoke @AgregarProductoCarrito  @
  Scenario: el usuario agrega y elimina un producto del carrito exitosamente
    When el usuario ingresa "standard_user" en el campo de texto "Username"
    And el usuario ingresa "secret_sauce" en el campo de texto "Password"
    And el usuario hace click en el boton "Login"
    And el usuario hace click en el boton Add to cart del producto "Sauce Labs Backpack"
    And el contador del carrito muestra el numero "1"
    And el usuario hace click en el boton Remove del producto "Sauce Labs Backpack"
    Then el contador del carrito desaparece