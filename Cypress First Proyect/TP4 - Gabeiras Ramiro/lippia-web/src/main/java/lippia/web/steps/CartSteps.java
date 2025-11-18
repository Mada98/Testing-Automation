package lippia.web.steps;

import lippia.web.services.CartService;
import lippia.web.services.SaucedemoService;
import cucumber.api.PendingException;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class CartSteps {
    @And("el usuario hace click en el boton Add to cart del producto {string}")
    public void productoCarrito(String valor) {
        switch (valor) {
            case "Sauce Labs Backpack":
                CartService.clickBotonAddCartBackpack();
                break;
        }
    }

    @And("el contador del carrito muestra el numero {string}")
    public void elContadorDelCarritoMuestraElNumero(String numeroEsperado) {
        CartService.verificarNumeroProductos(numeroEsperado);
    }


    @And("el usuario hace click en el boton Remove del producto {string}")
    public void elUsuarioHaceClickEnElBotonRemoveDelProducto(String valor) {
        switch(valor) {
            case "Sauce Labs Backpack":
                CartService.clickBotonRemoveBackpack();
                break;
        }
    }

    @Then("el contador del carrito desaparece")
    public void elContadorDelCarritoDesaparece() {
        CartService.notificacionProductoNoVisible();
        }
}
