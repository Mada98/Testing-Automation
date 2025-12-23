package lippia.web.steps;
import io.cucumber.java.en.*;
import lippia.web.services.CommonService;

public class CommonSteps {
    @And ("el usuario hace click en el boton {string}")
    public void clickEnBotonGeneral(String nombreBoton) {
        CommonService.clickPorNombre(nombreBoton);
    }
    @Then ("se muestra el mensaje {string}")
        public void verificarError (String textoError) {
            CommonService.detectarMensaje(textoError);
    }
}
