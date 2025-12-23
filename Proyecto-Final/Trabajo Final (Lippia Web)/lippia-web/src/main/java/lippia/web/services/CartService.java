package lippia.web.services;

import com.crowdar.core.actions.ActionManager;
import lippia.web.constants.CartConstants;
import lippia.web.constants.LoginConstants;
import org.testng.Assert;

public class CartService extends ActionManager {
    public static void prepararEscenarioCompra(){
        LoginService.ingresarUsuario("standard_user");
        LoginService.ingresarContrasena("secret_sauce");
        click(LoginConstants.BUTTON_LOGIN);
        click(CartConstants.BUTTON_ADD_BACKPACK);
        click(CartConstants.BUTTON_ADD_BIKE_LIGHT);
    }
    public static void completarDatosPersonales (String nombre, String apellido, String codigoPostal) {
        setInput(CartConstants.INPUT_FIRSTNAME, nombre);
        setInput(CartConstants.INPUT_LASTNAME, apellido);
        setInput(CartConstants.INPUT_POSTALCODE, codigoPostal);
    }

    public static void finalizarCompra(){
        String infoPago = getElement(CartConstants.LABEL_PAYMENT_XPATH).getText();
        System.out.println(infoPago);
        click(CartConstants.BUTTON_FINISH_CHECKOUT);
    }
}
