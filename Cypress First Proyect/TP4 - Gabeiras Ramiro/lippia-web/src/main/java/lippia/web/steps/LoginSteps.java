package lippia.web.steps;

import lippia.web.services.LoginService;
import lippia.web.services.SaucedemoService;
import cucumber.api.PendingException;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class LoginSteps {
    @Given("el usuario se encuentra en la pagina de login de Swag Labs")
    public void home() {
        SaucedemoService.navegarWeb();
    }

    @When("el usuario ingresa {string} en el campo de texto {string}")
    public void search(String valor, String campo) {
        switch (campo) {
            case "Username":
                LoginService.ingresarUsuario(valor);
                break;
            case "Password":
                LoginService.ingresarContrasena(valor);
                break;
        }
    }

    @And("el usuario hace click en el boton {string}")
    public void loginButton(String nombreBoton) {
        switch(nombreBoton) {
            case "Login":
                LoginService.clickBotonLogin();
                break;
        }
    }

    @Then("Se muestra el titulo de la pagina de productos")
    public void detectTitle() {
        LoginService.detectarLogin();
    }

    @Then("Se muestra el mensaje de error {string}") 
        public void mensajeError(String error) {
            switch(error) {
                case "Epic sadface: Sorry, this user has been locked out.":
                    LoginService.detectarErrorLogin();
            }
        }

}
