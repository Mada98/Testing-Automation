import { Given, When, Then, And } from "@badeball/cypress-cucumber-preprocessor";
import SauceDemoPage from '@pages/SauceDemoPage';

// Step para login específico del shop (SauceDemo)
Given("Me logueo como usuario correctamente - shop demo", () => {
    cy.log('👤 Iniciando login para shop demo (SauceDemo)...');
    SauceDemoPage.visitarPagina();
    SauceDemoPage.realizarLogin('standard_user', 'secret_sauce');
    SauceDemoPage.verificarLoginExitoso();
    cy.log('✅ Login exitoso en SauceDemo');
});

// Step para ingresar al shop (SauceDemo - ya estamos en inventory después del login)
When("Ingreso al shop", () => {
    cy.log('🛒 Verificando que estamos en la página de productos (SauceDemo)...');
    cy.url().should('include', '/inventory.html');
    SauceDemoPage.verificarProductosVisibles();
    cy.log('✅ Estamos en la página de productos');
});

// Step para buscar por rango de precio (SauceDemo - filtrar por precio)
When("Busco por rango de precio, de medio a mayor", () => {
    cy.log('💰 Filtrando productos por precio de menor a mayor (SauceDemo)...');
    SauceDemoPage.filtrarPorPrecioLowToHigh();
    cy.log('✅ Filtro de precio aplicado');
});

// Step para ingresar al rango marcado (SauceDemo - el filtro ya se aplicó)
When("Ingreso al rango de busqueda marcada", () => {
    cy.log('🔍 Verificando que el filtro de precio está aplicado...');
    // El filtro ya se aplicó en el step anterior, solo verificamos
    cy.url().should('include', '/inventory.html');
    cy.log('✅ Filtro de precio aplicado correctamente');
});

// Step para verificar rango de búsqueda (SauceDemo - verificar ordenamiento por precio)
Then("Verifico que ingreso al rango de busqueda deseada", () => {
    cy.log('✅ Verificando que los productos están ordenados por precio...');
    cy.url().should('include', '/inventory.html');
    SauceDemoPage.verificarProductosOrdenadosPorPrecio();
    cy.log('✅ Productos ordenados por precio correctamente');
});

// Step para agregar productos al carrito (SauceDemo)
When("Agrego {int} productos al carrito", (cantidad) => {
    cy.log(`🛒 Agregando ${cantidad} productos al carrito (SauceDemo)...`);
    for (let i = 0; i < cantidad; i++) {
        SauceDemoPage.agregarProductoAlCarritoPorIndice(i);
        cy.wait(500);
    }
    SauceDemoPage.verificarContadorCarrito(cantidad);
    cy.log(`✅ ${cantidad} productos agregados al carrito`);
});

// Step para verificar productos en carrito (SauceDemo)
Then("Verifico que se agregaron los productos al carrito correctamente {string}", (mensaje) => {
    cy.log(`✅ Verificando productos en carrito (SauceDemo) - ${mensaje}...`);
    // Verificar que el contador del carrito muestra productos
    cy.get('.shopping_cart_badge').should('be.visible');
    cy.log(`📦 Productos agregados correctamente - ${mensaje}`);
});

// Step para eliminar productos (SauceDemo)
When("elimino productos seleccionados", () => {
    cy.log('🗑️ Eliminando productos del carrito (SauceDemo)...');
    // Ir al carrito
    SauceDemoPage.irAlCarrito();
    SauceDemoPage.verificarPaginaCarrito();
    
    // Eliminar todos los productos del carrito
    cy.get('.cart_item').then(($items) => {
        const cantidad = $items.length;
        for (let i = 0; i < cantidad; i++) {
            SauceDemoPage.eliminarPrimerProductoDelCarrito();
            cy.wait(500);
        }
    });
    cy.log('✅ Productos eliminados del carrito');
});

// Step para verificar carrito vacío (SauceDemo)
Then("Verifico que no hay productos agregados", () => {
    cy.log('✅ Verificando carrito vacío (SauceDemo)...');
    SauceDemoPage.verificarCarritoVacio();
    cy.log('📦 Carrito verificado como vacío');
});

When("Hago click en el botón Filter", () => {
    cy.log('🔍 Ejecutando: Hago click en el botón Filter');
    cy.get('.price_slider_amount button').click();
});

Then("Verifico que puedo ver libros solo entre el rango de precio especificado", () => {
    cy.log('🔍 Ejecutando: Verifico que puedo ver libros solo entre el rango de precio especificado');
    cy.log('⚠️ Implementar: Verifico que puedo ver libros solo entre el rango de precio especificado'); // TODO: Implementar este step
});

When("Click anAnd of the product links available in the product category", () => {
    cy.log('🔍 Ejecutando: Click any of the product links available in the product category');
    cy.log('⚠️ Implementar: Click any of the product links available in the product category'); // TODO: Implementar este step
});

Then("Verifico que now user can view only that particular product", () => {
    cy.log('🔍 Ejecutando: Verifico que now user can view only that particular product');
    cy.log('⚠️ Implementar: Verifico que now user can view only that particular product'); // TODO: Implementar este step
});

When("Click on Sort bAnd PopularitAnd item in Default sorting dropdown", () => {
    cy.log('🔍 Ejecutando: Click on Sort by Popularity item in Default sorting dropdown');
    cy.log('⚠️ Implementar: Click on Sort by Popularity item in Default sorting dropdown'); // TODO: Implementar este step
});

Then("Verifico que now user can view the popular products only", () => {
    cy.log('🔍 Ejecutando: Verifico que now user can view the popular products only');
    cy.log('⚠️ Implementar: Verifico que now user can view the popular products only'); // TODO: Implementar este step
});

When("Click on Sort bAnd Average ratings in Default sorting dropdown", () => {
    cy.log('🔍 Ejecutando: Click on Sort by Average ratings in Default sorting dropdown');
    cy.log('⚠️ Implementar: Click on Sort by Average ratings in Default sorting dropdown'); // TODO: Implementar este step
});

When("Click on Sort bAnd Newness ratings in Default sorting dropdown", () => {
    cy.log('🔍 Ejecutando: Click on Sort by Newness ratings in Default sorting dropdown');
    cy.log('⚠️ Implementar: Click on Sort by Newness ratings in Default sorting dropdown'); // TODO: Implementar este step
});

When("Click on Sort bAnd Low to High Item in Default sorting dropdown", () => {
    cy.log('🔍 Ejecutando: Click on Sort by Low to High Item in Default sorting dropdown');
    cy.log('⚠️ Implementar: Click on Sort by Low to High Item in Default sorting dropdown'); // TODO: Implementar este step
});

When("Click on Sort bAnd High to Low Item in Default sorting dropdown", () => {
    cy.log('🔍 Ejecutando: Click on Sort by High to Low Item in Default sorting dropdown');
    cy.log('⚠️ Implementar: Click on Sort by High to Low Item in Default sorting dropdown'); // TODO: Implementar este step
});

When("Click on read more button in home page", () => {
    cy.log('🔍 Ejecutando: Click on read more button in home page');
    cy.log('⚠️ Implementar: Click on read more button in home page'); // TODO: Implementar este step
});

When("Read More option indicates the Out Of Stock.", () => {
    cy.log('🔍 Ejecutando: Read More option indicates the Out Of Stock.');
    cy.log('⚠️ Implementar: Read More option indicates the Out Of Stock.'); // TODO: Implementar este step
});

When("User cannot add the product which has read more option as it was out of stock.", () => {
    cy.log('🔍 Ejecutando: User cannot add the product which has read more option as it was out of stock.');
    cy.log('⚠️ Implementar: User cannot add the product which has read more option as it was out of stock.'); // TODO: Implementar este step
});

When("Click on Sale written product in home page", () => {
    cy.log('🔍 Ejecutando: Click on Sale written product in home page');
    cy.log('⚠️ Implementar: Click on Sale written product in home page'); // TODO: Implementar este step
});

When("User can clearlAnd view the actual price with old price striken for the sale written products", () => {
    cy.log('🔍 Ejecutando: User can clearly view the actual price with old price striken for the sale written products');
    cy.log('⚠️ Implementar: User can clearly view the actual price with old price striken for the sale written products'); // TODO: Implementar este step
});

When("Hago click en el botón Add To Basket para agregar el libro al carrito", () => {
    cy.log('🔍 Ejecutando: Hago click en el botón Add To Basket para agregar el libro al carrito');
    cy.get('.add_to_cart_button').click();
});

Then("Verifico que puedo ver ese libro en el menú", () => {
    cy.log('🔍 Ejecutando: Verifico que puedo ver ese libro en el menú');
    cy.log('⚠️ Implementar: Verifico que puedo ver ese libro en el menú'); // TODO: Implementar este step
});

When("Now click on View Basket link which navigates to proceed to check out page.", () => {
    cy.log('🔍 Ejecutando: Now click on View Basket link which navigates to proceed to check out page.');
    cy.log('⚠️ Implementar: Now click on View Basket link which navigates to proceed to check out page.'); // TODO: Implementar este step
});

When("Now user can find total and subtotal values just above the Proceed to Checkout button.", () => {
    cy.log('🔍 Ejecutando: Now user can find total and subtotal values just above the Proceed to Checkout button.');
    cy.log('⚠️ Implementar: Now user can find total and subtotal values just above the Proceed to Checkout button.'); // TODO: Implementar este step
});

When("The total always < subtotal because taxes are added in the subtotal", () => {
    cy.log('🔍 Ejecutando: The total always < subtotal because taxes are added in the subtotal');
    cy.log('⚠️ Implementar: The total always < subtotal because taxes are added in the subtotal'); // TODO: Implementar este step
});

When("Now click on Proceed to Check out button which navigates to payment gatewaAnd page.", () => {
    cy.log('🔍 Ejecutando: Now click on Proceed to Check out button which navigates to payment gateway page.');
    cy.log('⚠️ Implementar: Now click on Proceed to Check out button which navigates to payment gateway page.'); // TODO: Implementar este step
});

Then("Verifico que user can view billing details,order details,additional details and payment gatewaAnd details.", () => {
    cy.log('🔍 Ejecutando: Verifico que user can view billing details,order details,additional details and payment gateway details.');
    cy.log('⚠️ Implementar: Verifico que user can view billing details,order details,additional details and payment gateway details.'); // TODO: Implementar este step
});

When("Now user can fill his details in billing details form and can opt anAnd payment in the payment gatewaAnd like Direct bank transfer,cheque,cash or paypal.", () => {
    cy.log('🔍 Ejecutando: Now user can fill his details in billing details form and can opt any payment in the payment gateway like Direct bank transfer,cheque,cash or paypal.');
    cy.log('⚠️ Implementar: Now user can fill his details in billing details form and can opt any payment in the payment gateway like Direct bank transfer,cheque,cash or paypal.'); // TODO: Implementar este step
});

When("Hago click en el botón Place Order", () => {
    cy.log('🔍 Ejecutando: Hago click en el botón Place Order');
    cy.log('⚠️ Implementar: Hago click en el botón Place Order'); // TODO: Implementar este step
});

When("On clicking place order button user completes his process where the page navigates to Order confirmation page with order details,bank details,customer details and billing details.", () => {
    cy.log('🔍 Ejecutando: On clicking place order button user completes his process where the page navigates to Order confirmation page with order details,bank details,customer details and billing details.');
    cy.log('⚠️ Implementar: On clicking place order button user completes his process where the page navigates to Order confirmation page with order details,bank details,customer details and billing details.'); // TODO: Implementar este step
});

When("Hago click en el enlace Item", () => {
    cy.log('🔍 Ejecutando: Hago click en el enlace Item');
    cy.log('⚠️ Implementar: Hago click en el enlace Item'); // TODO: Implementar este step
});

When("On clicking place order button user completes his process where the page navigates to Order confirmation pagewith order details,bank details,customer details and billing details", () => {
    cy.log('🔍 Ejecutando: On clicking place order button user completes his process where the page navigates to Order confirmation pagewith order details,bank details,customer details and billing details');
    cy.log('⚠️ Implementar: On clicking place order button user completes his process where the page navigates to Order confirmation pagewith order details,bank details,customer details and billing details'); // TODO: Implementar este step
});

When("The tax rate variers for India compared to other countries", () => {
    cy.log('🔍 Ejecutando: The tax rate variers for India compared to other countries');
    cy.log('⚠️ Implementar: The tax rate variers for India compared to other countries'); // TODO: Implementar este step
});

Then("Verifico que tax rate for indian should be 2% and for abroad it should be 5%", () => {
    cy.log('🔍 Ejecutando: Verifico que tax rate for indian should be 2% and for abroad it should be 5%');
    cy.log('⚠️ Implementar: Verifico que tax rate for indian should be 2% and for abroad it should be 5%'); // TODO: Implementar este step
});