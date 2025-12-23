package lippia.web.steps;
import io.cucumber.java.en.*;
import lippia.web.services.CartService;

public class CartSteps {
    @Given ("el usuario se encuentra logueado y con productos en el carrito")
    public void precondicionCheckout (){
        CartService.prepararEscenarioCompra();
    }

    @And ("el usuario ingresa los datos {string}, {string}, {string}")
    public void ingresarDatos (String nombre, String apellido, String codigoPostal) {
        CartService.completarDatosPersonales(nombre, apellido, codigoPostal);
    }

    @And ("el usuario finaliza la compra")
    public void finalizar(){
        CartService.finalizarCompra();
    }
}
