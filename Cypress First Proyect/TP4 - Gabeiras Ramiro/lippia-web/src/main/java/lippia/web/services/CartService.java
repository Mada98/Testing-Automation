package lippia.web.services;


import com.crowdar.core.actions.ActionManager;
import lippia.web.constants.CartConstants;
import org.openqa.selenium.WebElement;
import org.testng.Assert;

public class CartService extends ActionManager {
    public static void clickBotonAddCartBackpack () {click(CartConstants.BUTTON_CART_BACKPACK_XPATH);}

    public static void verificarNumeroProductos (String numeroEsperado) {
        Assert.assertTrue(isVisible(CartConstants.INT_CART_BADGE_XPATH));
        String numeroCarrito = getText(CartConstants.INT_CART_BADGE_XPATH);
        Assert.assertEquals(numeroCarrito, numeroEsperado);
        ;}

    public static void notificacionProductoNoVisible () {
        Assert.assertTrue(getElements(CartConstants.INT_CART_BADGE_XPATH).isEmpty());
    }

    public static void clickBotonRemoveBackpack () {click(CartConstants.BUTTON_REMOVE_CART_BACKPACK_XPATH);}
}
