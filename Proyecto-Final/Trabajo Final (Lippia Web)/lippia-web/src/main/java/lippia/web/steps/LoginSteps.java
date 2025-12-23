package lippia.web.steps;

import io.cucumber.java.en.*;
import lippia.web.services.LoginService;
import lippia.web.services.SauceDemoService;
import lippia.web.services.CommonService;

public class LoginSteps {

    @Given("el usuario se encuentra en la pagina de login de Swag Labs")
    public void home() {
        SauceDemoService.navegarWeb();
    }

    @When("el usuario ingresa el nombre de usuario {string}")
    public void ingresarUser(String usuario) {
        LoginService.ingresarUsuario(usuario);
    }

    @And("el usuario ingresa la contrasenia {string}")
    public void ingresarPass(String contrasena) {
        LoginService.ingresarContrasena(contrasena);
    }

    @Then("se muestra el titulo de la pagina de productos")
    public void verificarLogin() {
        LoginService.detectarLogin();
    }
}
