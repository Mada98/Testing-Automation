import { Given, When, Then, And } from "@badeball/cypress-cucumber-preprocessor";
import SauceDemoPage from '@pages/SauceDemoPage';

// ============================================================================
// STEPS DE LOGIN
// ============================================================================

Given("Me logueo en SauceDemo con usuario {string} y contraseña {string}", (username, password) => {
    SauceDemoPage.visitarPagina();
    SauceDemoPage.realizarLogin(username, password);
});

Given("Me logueo en SauceDemo correctamente", () => {
    SauceDemoPage.visitarPagina();
    SauceDemoPage.realizarLogin('standard_user', 'secret_sauce');
});

Then("Verifico que el login fue exitoso en SauceDemo", () => {
    SauceDemoPage.verificarLoginExitoso();
});

// ============================================================================
// STEPS DE PRODUCTOS
// ============================================================================

Then("Verifico que los productos están visibles", () => {
    SauceDemoPage.verificarProductosVisibles();
});

When("Agrego el primer producto al carrito", () => {
    SauceDemoPage.agregarPrimerProductoAlCarrito();
});

When("Agrego el segundo producto al carrito", () => {
    SauceDemoPage.agregarSegundoProductoAlCarrito();
});

When("Agrego {int} productos al carrito de SauceDemo", (cantidad) => {
    for (let i = 0; i < cantidad; i++) {
        SauceDemoPage.agregarProductoAlCarritoPorIndice(i);
    }
});

Then("Verifico que el botón cambió a Remove", () => {
    SauceDemoPage.verificarBotonCambioARemove(0);
});

Then("Verifico que el contador del carrito muestra {int}", (cantidad) => {
    SauceDemoPage.verificarContadorCarrito(cantidad);
});

// ============================================================================
// STEPS DE FILTRADO
// ============================================================================

When("Filtro productos por nombre de A a Z", () => {
    SauceDemoPage.filtrarPorNombreAZ();
});

When("Filtro productos por precio de menor a mayor", () => {
    SauceDemoPage.filtrarPorPrecioLowToHigh();
});

Then("Verifico que los productos están ordenados por precio", () => {
    SauceDemoPage.verificarProductosOrdenadosPorPrecio();
});

// ============================================================================
// STEPS DEL CARRITO
// ============================================================================

When("Ingreso al carrito de SauceDemo", () => {
    SauceDemoPage.irAlCarrito();
});

Then("Verifico que estoy en la página del carrito", () => {
    SauceDemoPage.verificarPaginaCarrito();
});

Then("Verifico que hay {int} productos en el carrito", (cantidad) => {
    SauceDemoPage.verificarProductosEnCarrito(cantidad);
});

Then("Verifico que los botones del carrito están visibles", () => {
    SauceDemoPage.verificarBotonesCarrito();
});

When("Elimino el primer producto del carrito", () => {
    SauceDemoPage.eliminarPrimerProductoDelCarrito();
});

When("Elimino todos los productos del carrito", () => {
    cy.get('.cart_item').then(($items) => {
        const cantidad = $items.length;
        for (let i = 0; i < cantidad; i++) {
            SauceDemoPage.eliminarPrimerProductoDelCarrito();
            cy.wait(500);
        }
    });
});

Then("Verifico que el carrito está vacío", () => {
    SauceDemoPage.verificarCarritoVacio();
});

When("Continuo comprando", () => {
    SauceDemoPage.continuarComprando();
});

// ============================================================================
// STEPS DE CHECKOUT
// ============================================================================

When("Inicio el proceso de checkout", () => {
    SauceDemoPage.iniciarCheckout();
});

When("Completo la información de checkout con nombre {string}, apellido {string} y código postal {string}", (firstName, lastName, postalCode) => {
    SauceDemoPage.completarInformacionCheckout(firstName, lastName, postalCode);
});

Then("Verifico que estoy en la página de resumen del checkout", () => {
    SauceDemoPage.verificarPaginaResumen();
});

When("Completo la compra", () => {
    SauceDemoPage.completarCompra();
});

Then("Verifico que la compra fue completada exitosamente", () => {
    SauceDemoPage.verificarConfirmacionCompra();
});

When("Vuelvo a la página de productos", () => {
    SauceDemoPage.volverAProductos();
});

// ============================================================================
// STEPS DE LOGOUT
// ============================================================================

When("Abro el menú de SauceDemo", () => {
    SauceDemoPage.abrirMenu();
});

When("Realizo logout en SauceDemo", () => {
    SauceDemoPage.realizarLogout();
});

Then("Verifico que el logout fue exitoso", () => {
    SauceDemoPage.verificarLogoutExitoso();
});

// ============================================================================
// STEPS CON DATA-TEST (para mayor robustez)
// ============================================================================

Given("Me logueo en SauceDemo usando data-test con usuario {string} y contraseña {string}", (username, password) => {
    SauceDemoPage.visitarPagina();
    SauceDemoPage.realizarLoginConDataTest(username, password);
});

When("Agrego todos los productos disponibles al carrito", () => {
    SauceDemoPage.agregarTodosLosProductosAlCarrito();
});

When("Ingreso al carrito usando data-test", () => {
    SauceDemoPage.irAlCarritoConDataTest();
});

When("Inicio el checkout usando data-test", () => {
    SauceDemoPage.iniciarCheckoutConDataTest();
});

When("Completo la información de checkout usando data-test con nombre {string}, apellido {string} y código postal {string}", (firstName, lastName, postalCode) => {
    SauceDemoPage.completarInformacionCheckoutConDataTest(firstName, lastName, postalCode);
});

Then("Verifico la información de pago y envío", () => {
    SauceDemoPage.verificarInformacionPago();
});

When("Completo la compra usando data-test", () => {
    SauceDemoPage.completarCompraConDataTest();
});

Then("Verifico la confirmación de compra usando data-test", () => {
    SauceDemoPage.verificarConfirmacionCompraConDataTest();
});

When("Vuelvo a productos usando data-test", () => {
    SauceDemoPage.volverAProductosConDataTest();
});

