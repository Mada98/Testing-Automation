package org.example;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.AriaRole;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import java.nio.file.Paths;

public class Main {
    public static void main(String[] args) {
        try (Playwright playwright = Playwright.create()) {
            String username = "standard_user";
            String password = "secret_sauce";
            String wrongPassword = "sauce_secret";

            Browser browser = playwright.chromium().launch(new BrowserType.LaunchOptions()
                    .setHeadless(false).setSlowMo(150));

            BrowserContext context = browser.newContext();
            Page page = context.newPage();

            page.navigate("https://www.saucedemo.com/");

            //LogIn
            page.locator("[data-test=\"username\"]").click();
            page.locator("[data-test=\"username\"]").fill(username);
            page.locator("[data-test=\"password\"]").click();
            page.locator("[data-test=\"password\"]").fill(password);
            page.locator("[data-test=\"login-button\"]").click();
            //Verification
            assertThat(page.locator(".title")).isVisible();
            System.out.println("Login successful!");

            //AddToCart
            String firstProduct = page.textContent(".inventory_item_name");
            page.locator("[data-test=\"add-to-cart-sauce-labs-backpack\"]").click();
            page.locator("[data-test=\"shopping-cart-link\"]").click();
            //verification
            Locator cartItem = page.locator(".cart_list .inventory_item_name").first();
            assertThat(cartItem).hasText(firstProduct);
            page.screenshot(new Page.ScreenshotOptions().setPath(Paths.get("cart_screenshot.png")));
            System.out.println("Producto agregado correctamente!");

            //LogOut
            page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Open Menu")).click();
            page.locator("[data-test=\"logout-sidebar-link\"]").click();
            //verification
            assertThat(page.locator(".login_logo")).isVisible();
            System.out.println("Logout successful!");

            //login_error
            page.locator("[data-test=\"username\"]").click();
            page.locator("[data-test=\"username\"]").fill(username);
            page.locator("[data-test=\"password\"]").click();
            page.locator("[data-test=\"password\"]").fill(wrongPassword);
            page.locator("[data-test=\"login-button\"]").click();
            //verification
            assertThat(page.locator(".error-button")).isVisible();
            page.screenshot(new Page.ScreenshotOptions().setPath(Paths.get("login_error_screenshot.png")));
            System.out.println("Login error successful!");

            //login
            page.locator("[data-test=\"username\"]").click();
            page.locator("[data-test=\"username\"]").fill(username);
            page.locator("[data-test=\"password\"]").click();
            page.locator("[data-test=\"password\"]").fill(password);
            page.locator("[data-test=\"login-button\"]").click();

            //Ordenar productos
            page.locator("[data-test=\"product-sort-container\"]").selectOption("za");
            Locator firstProduct_za = page.locator(".inventory_item_name").first();
            assertThat(firstProduct_za).hasText("Test.allTheThings() T-Shirt (Red)");
            System.out.println("Los productos se ordenaron de manera exitosa!");
        }
    }
}
