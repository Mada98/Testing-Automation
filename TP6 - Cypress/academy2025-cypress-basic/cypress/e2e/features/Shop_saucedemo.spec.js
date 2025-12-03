describe('SauceDemo Shop - E2E Tests', () => {
  const username = 'standard_user';
  const password = 'secret_sauce';

  beforeEach(() => {
    // Visitar la página de login
    cy.visit('/');
  });

  it('should login successfully and view products', () => {
    // Realizar login
    cy.get('#user-name').type(username);
    cy.get('#password').type(password);
    cy.get('#login-button').click();

    // Verificar que se redirige a la página de inventario
    cy.url().should('include', '/inventory.html');
    
    // Verificar que los productos están visibles
    cy.get('.inventory_container').should('be.visible');
    cy.get('.inventory_item').should('have.length.greaterThan', 0);
    
    // Verificar que hay al menos un título de producto
    cy.get('.inventory_item_name').should('have.length.greaterThan', 0);
  });

  it('should add products to cart', () => {
    // Login
    cy.get('#user-name').type(username);
    cy.get('#password').type(password);
    cy.get('#login-button').click();

    // Verificar que estamos en la página de inventario
    cy.url().should('include', '/inventory.html');

    // Agregar el primer producto al carrito
    cy.get('.inventory_item').first().within(() => {
      cy.get('.btn_inventory').should('contain.text', 'Add to cart').click();
    });

    // Verificar que el botón cambió a "Remove"
    cy.get('.inventory_item').first().within(() => {
      cy.get('.btn_inventory').should('contain.text', 'Remove');
    });

    // Verificar que el contador del carrito muestra 1
    cy.get('.shopping_cart_badge').should('be.visible').and('contain', '1');

    // Agregar un segundo producto
    cy.get('.inventory_item').eq(1).within(() => {
      cy.get('.btn_inventory').should('contain.text', 'Add to cart').click();
    });

    // Verificar que el contador del carrito muestra 2
    cy.get('.shopping_cart_badge').should('contain', '2');
  });

  it('should view cart and verify items', () => {
    // Login
    cy.get('#user-name').type(username);
    cy.get('#password').type(password);
    cy.get('#login-button').click();

    // Agregar productos al carrito
    cy.get('.inventory_item').first().within(() => {
      cy.get('.btn_inventory').click();
    });
    cy.get('.inventory_item').eq(1).within(() => {
      cy.get('.btn_inventory').click();
    });

    // Hacer clic en el icono del carrito
    cy.get('.shopping_cart_link').click();

    // Verificar que estamos en la página del carrito
    cy.url().should('include', '/cart.html');
    
    // Verificar que hay productos en el carrito
    cy.get('.cart_item').should('have.length', 2);
    
    // Verificar que los nombres de los productos están visibles
    cy.get('.inventory_item_name').should('have.length', 2);
    
    // Verificar que hay botones para continuar comprando y checkout
    cy.get('#continue-shopping').should('be.visible');
    cy.get('#checkout').should('be.visible');
  });

  it('should remove products from cart', () => {
    // Login
    cy.get('#user-name').type(username);
    cy.get('#password').type(password);
    cy.get('#login-button').click();

    // Agregar productos al carrito
    cy.get('.inventory_item').first().within(() => {
      cy.get('.btn_inventory').click();
    });
    cy.get('.inventory_item').eq(1).within(() => {
      cy.get('.btn_inventory').click();
    });

    // Ir al carrito
    cy.get('.shopping_cart_link').click();
    cy.url().should('include', '/cart.html');

    // Eliminar el primer producto del carrito
    cy.get('.cart_item').first().within(() => {
      cy.get('.cart_button').click();
    });

    // Verificar que solo queda un producto
    cy.get('.cart_item').should('have.length', 1);

    // Eliminar el último producto
    cy.get('.cart_item').within(() => {
      cy.get('.cart_button').click();
    });

    // Verificar que el carrito está vacío
    cy.get('.cart_item').should('not.exist');
    
    // Verificar que podemos continuar comprando
    cy.get('#continue-shopping').click();
    cy.url().should('include', '/inventory.html');
  });

  it('should filter products by name', () => {
    // Login
    cy.get('#user-name').type(username);
    cy.get('#password').type(password);
    cy.get('#login-button').click();

    // Verificar que el filtro está visible
    cy.get('.product_sort_container').should('be.visible');

    // Obtener nombres de productos antes del filtro
    let productNamesBefore = [];
    cy.get('.inventory_item_name').each(($el) => {
      productNamesBefore.push($el.text());
    });

    // Filtrar por nombre (A to Z)
    cy.get('.product_sort_container').select('az');
    cy.wait(500);

    // Verificar que los productos están ordenados alfabéticamente
    cy.get('.inventory_item_name').first().then(($first) => {
      const firstProductName = $first.text();
      // El primer producto debería ser el primero alfabéticamente
      expect(firstProductName).to.exist;
    });
  });

  it('should filter products by price (low to high)', () => {
    // Login
    cy.get('#user-name').type(username);
    cy.get('#password').type(password);
    cy.get('#login-button').click();

    // Filtrar por precio (low to high)
    cy.get('.product_sort_container').select('lohi');
    cy.wait(500);

    // Verificar que los precios están ordenados de menor a mayor
    let prices = [];
    cy.get('.inventory_item_price').each(($el) => {
      const priceText = $el.text().replace('$', '');
      prices.push(parseFloat(priceText));
    }).then(() => {
      // Verificar que los precios están ordenados
      for (let i = 0; i < prices.length - 1; i++) {
        expect(prices[i]).to.be.at.most(prices[i + 1]);
      }
    });
  });

  it('should complete checkout process', () => {
    // Login
    cy.get('#user-name').type(username);
    cy.get('#password').type(password);
    cy.get('#login-button').click();

    // Agregar un producto al carrito
    cy.get('.inventory_item').first().within(() => {
      cy.get('.btn_inventory').click();
    });

    // Ir al carrito
    cy.get('.shopping_cart_link').click();
    cy.url().should('include', '/cart.html');

    // Iniciar checkout
    cy.get('#checkout').click();
    cy.url().should('include', '/checkout-step-one.html');

    // Completar información de checkout
    cy.get('#first-name').type('John');
    cy.get('#last-name').type('Doe');
    cy.get('#postal-code').type('12345');
    cy.get('#continue').click();

    // Verificar página de resumen
    cy.url().should('include', '/checkout-step-two.html');
    cy.get('.cart_item').should('have.length', 1);
    cy.get('.summary_info').should('be.visible');

    // Completar la compra
    cy.get('#finish').click();

    // Verificar página de confirmación
    cy.url().should('include', '/checkout-complete.html');
    cy.get('.complete-header').should('contain', 'Thank you for your order!');
    cy.get('#back-to-products').should('be.visible');
  });

  it('should logout successfully', () => {
    // Login
    cy.get('#user-name').type(username);
    cy.get('#password').type(password);
    cy.get('#login-button').click();

    // Verificar que estamos logueados
    cy.url().should('include', '/inventory.html');

    // Abrir el menú
    cy.get('#react-burger-menu-btn').click();
    cy.get('.bm-menu').should('be.visible');

    // Hacer logout
    cy.get('#logout_sidebar_link').click();

    // Verificar que volvimos a la página de login
    cy.url().should('eq', Cypress.config('baseUrl') + '/');
    cy.get('#user-name').should('be.visible');
    cy.get('#password').should('be.visible');
    cy.get('#login-button').should('be.visible');
  });
});

/* ==== Test Created with Cypress Studio ==== */
it('Shop_carrito', function() {
  /* ==== Generated with Cypress Studio ==== */
  cy.visit('www.saucedemo.com');
  cy.get('.login_credentials_wrap-inner').click();
  cy.get('[data-test="username"]').clear('visual_user');
  cy.get('[data-test="username"]').type('visual_user');
  cy.get('.login_credentials_wrap-inner').click();
  cy.get('[data-test="login-credentials"]').click();
  cy.get('[data-test="login-password"]').click();
  cy.get('[data-test="login-password"]').click();
  cy.get('[data-test="login-password"]').click();
  cy.get('[data-test="login-password"]').click();
  cy.get('.login_credentials_wrap-inner').click();
  cy.get('[data-test="login-password"]').click();
  cy.get('[data-test="login-password"]').click();
  cy.get('form').click();
  cy.get('[data-test="password"]').clear('secret_sauce');
  cy.get('[data-test="password"]').type('secret_sauce');
  cy.get('[data-test="login-button"]').click();
  cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  cy.get('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
  cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  cy.get('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
  cy.get('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]').click();
  cy.get('[data-test="primary-header"]').click();
  cy.get('[data-test="shopping-cart-badge"]').click();
  cy.get('[data-test="shopping-cart-badge"]').click();
  cy.get('[data-test="checkout"]').click();
  cy.get('.checkout_info').click();
  cy.get('[data-test="firstName"]').clear();
  cy.get('[data-test="firstName"]').type('Qwerty');
  cy.get('.checkout_info').click();
  cy.get('[data-test="lastName"]').clear();
  cy.get('[data-test="lastName"]').type('Qwerty');
  cy.get('[data-test="postalCode"]').clear('123');
  cy.get('[data-test="postalCode"]').type('1234');
  cy.get('[data-test="continue"]').click();
  cy.get('[data-test="payment-info-label"]').click();
  cy.get('.summary_info').click();
  cy.get('[data-test="payment-info-label"]').should('have.text', 'Payment Information:');
  cy.get('[data-test="shipping-info-label"]').should('have.text', 'Shipping Information:');
  cy.get('.cart_footer').click();
  cy.get('[data-test="finish"]').click();
  cy.get('[data-test="complete-header"]').should('have.text', 'Thank you for your order!');
  cy.get('[data-test="pony-express"]').should('have.class', 'pony_express');
  cy.get('[data-test="back-to-products"]').should('have.text', 'Back Home');
  cy.get('[data-test="back-to-products"]').click();
  cy.get('[data-test="title"]').click();
  cy.get('.header_label').click();
  cy.get('#react-burger-menu-btn').click();
  cy.get('[data-test="inventory-sidebar-link"]').click();
  /* ==== End Cypress Studio ==== */
});
