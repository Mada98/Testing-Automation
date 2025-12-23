package lippia.web.services;

import com.crowdar.core.actions.ActionManager;
import lippia.web.constants.LoginConstants;
import lippia.web.constants.CartConstants;
import org.testng.Assert;

public class CommonService extends ActionManager {
    public static void clickPorNombre(String nombreBoton){
        switch (nombreBoton) {
            case "Login":
                click(LoginConstants.BUTTON_LOGIN);
                break;
            case "Carrito":
                click(CartConstants.BUTTON_VIEW_CART);
                break;
            case "Checkout":
                click(CartConstants.BUTTON_CHECKOUT);
            case "Continue":
                click(CartConstants.BUTTON_CONTINUE);

        }
    }

    public static void detectarMensaje (String texto){
        switch (texto) {
            case "Epic sadface: Sorry, this user has been locked out.":
                Assert.assertEquals(getElement(LoginConstants.STRING_ERROR_XPATH).getText(), texto);
                break;
            case  "Epic sadface: Username and password do not match any user in this service":
                Assert.assertEquals(getElement(LoginConstants.STRING_ERROR_XPATH).getText(), texto);
                break;
            case "Thank you for your order!":
                Assert.assertEquals(getElement(CartConstants.STRING_MESSAGE_CHECKOUT_XPATH).getText(), texto);
        }
    }
}
