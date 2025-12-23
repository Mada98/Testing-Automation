@Cart @Regression
Feature: Cart

  Background:
    Given el usuario se encuentra en la pagina de login de Swag Labs

  @Cart @Checkout @Smoke
  Scenario Outline: Compra exitosa de productos en el carrito
    And el usuario se encuentra logueado y con productos en el carrito
    When el usuario hace click en el boton "Carrito"
    And el usuario hace click en el boton "Checkout"
    And el usuario ingresa los datos "<nombre>", "<apellido>", "<codigoPostal>"
    And el usuario hace click en el boton "Continue"
    And el usuario finaliza la compra
    Then se muestra el mensaje "Thank you for your order!"

    Examples:
      | nombre | apellido | codigoPostal |
      | Ramiro | Gabeiras | 8000         |
      | David  | Gilmour  | 9000         |

