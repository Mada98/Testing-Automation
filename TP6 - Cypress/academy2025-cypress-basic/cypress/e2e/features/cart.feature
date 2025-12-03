@Cart @Regression
Feature: Cart

  Background:
    Given Me logueo como usuario correctamente - shop demo

  @Smoke @AgregarProductoCarrito  
  Scenario: el usuario agrega y elimina un producto del carrito exitosamente
    When Agrego 1 productos al carrito
    And Verifico que se agregaron los productos al carrito correctamente "Sauce Labs Backpack"
    And elimino productos seleccionados
    Then Verifico que no hay productos agregados