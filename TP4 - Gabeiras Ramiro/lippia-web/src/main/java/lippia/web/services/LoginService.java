package lippia.web.services;

import com.crowdar.core.actions.ActionManager;
import lippia.web.constants.LoginConstants;
import org.openqa.selenium.WebElement;
import org.testng.Assert;


public class LoginService extends ActionManager {

    public static void ingresarUsuario(String text){
        setInput(LoginConstants.INPUT_USERNAME, text);
    }
    public static void ingresarContrasena(String text){
        setInput(LoginConstants.INPUT_PASSWORD, text);
    }
    public static void clickBotonLogin(){
        click(LoginConstants.BUTTON_LOGIN);
    }
    public static void detectarLogin() { Assert.assertTrue(isVisible(LoginConstants.STRING_TITLE_XPATH));}
    public static void detectarErrorLogin() {Assert.assertTrue(isVisible(LoginConstants.STRING_ERROR_LOGIN_XPATH));}
}

