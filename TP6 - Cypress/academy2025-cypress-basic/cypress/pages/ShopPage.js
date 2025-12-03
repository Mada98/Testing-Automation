/**
 * Page Object Model para la página de la tienda
 * Implementa métodos para:
 * - Navegación y login
 * - Filtrado de productos
 * - Gestión del carrito
 * - Verificaciones
 */

// Manejo global de excepciones no capturadas para evitar fallos en las pruebas
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
});
/// <reference types="cypress" />
import ShopLocators from './locators/ShopLocators.json';

/**
 * Clase que implementa el patrón Page Object Model para la página de la tienda
 * Contiene todos los métodos necesarios para interactuar con la página y realizar validaciones
 */
class ShopPage {
  // Elementos base de la página
  elements = {
    btnGoToShop : () => cy.get(ShopLocators.btnGoToShop),
  };

  // Métodos de navegación básica
  clickShop() {
    this.elements.btnGoToShop().click();
  }

  visitarPaginaShop = () => {
    cy.visit('/shop/');
  }
  
  // Método para realizar el login con datos parametrizados
  doLoginScenarioOutlineShop = (user, pass) => {
    cy.get(ShopLocators.inpUsernameLogin).type(user);
    cy.get(ShopLocators.inpPassLogin).type(pass);
    cy.get(ShopLocators.btnIniciarSesionLogin).click();
  } 

  // Navegación a la tienda
  clickBotonStoreShop = () => {
    cy.get(ShopLocators.btnGoToShop).click({force: true});
  }

  // Verificación de la página de la tienda
  verificarPaginaShop = () => {
    cy.get(ShopLocators.shopBradcrum).should('be.visible');
  };
  
  // Métodos para el manejo del filtro de precios
  slidePrecio = () => {
    cy.get(ShopLocators.priceSlider)
      .invoke("val", 23000)
      .trigger("change")
      .click({ force: true })
  };

  slidePrecioMayor = () => {
    const currentValue  = 20000;
    const targetValue = 35000;
    const increment = 500;
    const steps = (targetValue - currentValue) / increment;
    const arrows = '{rightarrow}'.repeat(steps); 

    cy.get(ShopLocators.priceMax)
      .should('have.attr', 'left: 0%', 20000)
      .type(arrows)

    cy.get(ShopLocators.priceMin)
      .should('have.attr', 'left: 100%', 35000)
  };
  
  // Métodos de interacción con productos
  clickFiltrarBusqueda = () => {
    cy.get(ShopLocators.btnFiltrarPrecio)
      .click({ force: true })
  };

  clickProductosSeleccionados = () => {
    cy.get(ShopLocators.btnProducto1)
      .click({ force: true })
    cy.get(ShopLocators.btnProducto2)
      .click({ force: true })
    cy.get(ShopLocators.btnProducto3)
      .click({ force: true })
  };
  
  // Métodos de verificación de búsqueda y carrito
  verificarRangoBusquedaShop = () => { 
    cy.get(ShopLocators.rangoBuscar).should('be.visible');
    cy.get(ShopLocators.rangoDesde).should('text', '₹324');
    cy.get(ShopLocators.rangoHasta).should('text', '₹500');
  };

  validarBasketShop = () => { 
    cy.get(ShopLocators.basketContent).should('be.visible');
  };

  // Métodos utilitarios para el manejo de texto
  normalizeText(text) {
    return text.replace(/\s/g, "").toLowerCase();
  }

  getMaxLength(text) {
    const uppercaseRatio = text.replace(/[^A-Z]/g, "").length / text.length;
    if (uppercaseRatio >= 0.7) return 8;
    if (uppercaseRatio >= 0.6) return 9;
    return 10;
  }

  // Métodos para el manejo de texto largo
  splitText(text, maxLength) {
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    for (const word of words) {
      if (word.length > maxLength) {
        if (currentLine) {
          lines.push(currentLine.trim());
          currentLine = "";
        }
        lines.push(word.slice(0, maxLength));
        currentLine = word.slice(maxLength);
      } else if ((currentLine + " " + word).trim().length > maxLength) {
        lines.push(currentLine.trim());
        currentLine = word;
      } else {
        currentLine += (currentLine ? " " : "") + word;
      }
    }
    if (currentLine) lines.push(currentLine.trim());
    return lines.slice(0, this.locators.MAX_LINES);
  }

  // Métodos para el manejo de etiquetas
  formatLabel(text) {
    if (/^\d+$/.test(text))
      return text.length > 10 ? [text.slice(0, 10), text.slice(10)] : [text];
    return this.splitText(text, this.getMaxLength(text));
  }

  // Método para seleccionar datos por nombre
  selectDataByName(data) {
    const self = this; 
    const normalizedExpected = self.normalizeText(data);

    cy.intercept("GET", "**/basket*").as("getDataBasket");
    cy.log("Esperando la solicitud a /basket...");

    cy.wait("@getDataBasket", { timeout: 20000 })
      .then((interception) => {
        cy.log("Solicitud interceptada:", interception);
        const productos = interception.response.body.productosVinculados;
        const matchingProduct = productos.find(
          (product) =>
            product.alias &&
            self.normalizeText(product.alias) === normalizedExpected
        );
        expect(
          matchingProduct,
          `No se encontró data con el texto: "${data}"`
        ).to.exist;
      })
      .then(() => {
        self.getLineLabel().each(($label) => {
          const reconstructedText = $label
            .find("span")
            .toArray()
            .map((span) => Cypress.$(span).text().trim())
            .join(" ");
          const normalizedText = self.normalizeText(reconstructedText);
          if (normalizedText === normalizedExpected) {
            cy.wrap($label).closest(self.locators.lineButton).click();
            return false;
          }
        });
      });
  }

  // Método para eliminar productos del carrito
  eliminarProductosShop = () => {
    cy.log('🗑️ Iniciando proceso de vaciado del carrito...');
    cy.intercept('POST', '**/basket/**').as('updateCart');
    cy.intercept('POST', '**/basket/?wc-ajax=get_refreshed_fragments').as('refreshCart');
    cy.intercept('GET', '**/basket/').as('getBasket');

    cy.get(ShopLocators.inputCantidadProducto).each(($input, index) => {
        cy.wrap($input)
          .clear()
          .type('0', { force: true })
          .then(() => cy.log(`✅ Producto ${index + 1} establecido a 0`));
    });

    cy.log('🔄 Actualizando carrito...');
    cy.get(ShopLocators.btnActualizarCarrito)
      .click()
      .then(() => {
        cy.wait(['@updateCart', '@refreshCart', '@getBasket'], { timeout: 10000 })
          .then((interceptions) => {
            cy.log('✅ Carrito actualizado correctamente');
            interceptions.forEach(interception => {
                cy.log(`📡 Respuesta ${interception.request.url}: ${interception.response.statusCode}`);
            });
          });
      });
  }

  // Método para verificar que el carrito está vacío
  verificarBasketVacia = () => {
    cy.log('🔍 Verificando que el carrito está vacío...');
    // Verificar mensaje de actualización exitosa y sus estilos
    cy.get(ShopLocators.mensajeWoocommerce)
      .should('be.visible')
      .and('contain.text', 'Basket updated.')
      .and('have.css', 'border-top-color', 'rgb(237, 30, 36)')
      .and('have.css', 'background-color', 'rgb(244, 244, 244)')
      .and('have.css', 'border-top-width')
      .should('be.oneOf', ['4.66667px', '5px'])
      .then(() => {
        cy.get(ShopLocators.mensajeWoocommerce)
          .should('have.css', 'box-shadow', 'none')
          .and('have.css', 'border-radius', '0px')
          .and('have.css', 'padding', '16px 32px 16px 56px')
          .and('have.css', 'margin', '0px 0px 32px')
          .and('have.css', 'position', 'relative')
          .should($el => {
            const styles = window.getComputedStyle($el[0], ':before');
            expect(styles.position).to.equal('absolute');
            expect(styles.top).to.equal('16px');
            expect(styles.left).to.equal('24px');
            expect(styles.display).to.not.equal('none');
          });
      });

    // Verificar contenido y estructura del carrito vacío
    cy.get(ShopLocators.contenidoPagina)
      .should('exist')
      .within(() => {
        cy.get(ShopLocators.mensajeCarritoVacio)
          .should('be.visible')
          .and('contain.text', 'Your basket is currently empty.')
          .and('have.css', 'margin', '0px 0px 32px')
          .and('have.css', 'padding', '0px')
          .and('have.css', 'color', 'rgb(102, 102, 102)')
          .then(() => cy.log('✅ Carrito confirmado como vacío'));

        cy.get(ShopLocators.btnVolverTienda)
          .should('be.visible')
          .and('contain.text', 'Return To Shop')
          .and('have.class', 'wc-backward')
          .and('have.css', 'display', 'inline-block')
          .then($button => {
            expect($button.attr('href')).to.match(/\/shop\/?$/);
          });
      });

    // Verificar contenedores principales
    cy.get(ShopLocators.contenedorWoocommerce)
      .should('exist')
      .and('have.css', 'display', 'block')
      .and('have.css', 'word-wrap', 'break-word');

    cy.get(ShopLocators.contenedorThemify)
      .should('exist')
      .and('have.attr', 'data-postid', '34')
      .and('have.class', 'themify_builder_content')
      .and('have.class', 'themify_builder_front');
  } 

  // Método principal para verificar productos en el carrito
  verificarElementosCarrito = () => {
    cy.get(ShopLocators.tablaCarrito)
      .first()
      .within(() => {
        cy.get(ShopLocators.encabezadoNombreProducto).should('contain.text', 'Product');
        cy.get(ShopLocators.encabezadoPrecioProducto).should('contain.text', 'Price');
        cy.get(ShopLocators.encabezadoCantidadProducto).should('contain.text', 'Quantity');
        cy.get(ShopLocators.encabezadoTotalProducto).should('contain.text', 'Total');
      });

    cy.get(ShopLocators.itemCarrito)
      .should('have.length.at.least', 3)
      .each(($item) => {
        cy.wrap($item).within(() => {
          cy.get(ShopLocators.nombreProducto)
            .should('be.visible')
            .and('not.be.empty');
          
          cy.get(ShopLocators.precioProducto)
            .should('be.visible')
            .and('contain.text', '₹');
          
          cy.get(ShopLocators.cantidadProducto)
            .should('be.visible')
            .find('input.qty')
            .should('have.attr', 'type', 'number');
          
          cy.get(ShopLocators.totalProducto)
            .should('be.visible')
            .and('contain.text', '₹');
        });
      });

    cy.wait(1000);

    cy.get(ShopLocators.seccionTotales).should('exist').then($totals => {
      cy.log('Estructura de los totales:', $totals.html());

      cy.wrap($totals)
        .find('table')
        .should('have.class', 'shop_table_responsive')
        .within(() => {
          cy.get(ShopLocators.subtotalCarrito)
            .should('exist')
            .and('be.visible')
            .within(() => {
              cy.get('th').should('contain.text', 'Subtotal');
              cy.get('td').should('contain.text', '₹');
            });

          cy.get(ShopLocators.totalCarrito)
            .should('exist')
            .and('be.visible')
            .within(() => {
              cy.get('th').should('contain.text', 'Total');
              cy.get('td').should('contain.text', '₹');
            });
        });
    });
  }

  // Método para agregar productos al carrito y verificar el contador
  agregarProductosAlCarrito = () => {
    cy.log('🛒 Iniciando proceso de agregar productos al carrito...');
    
    // Configurar interceptores para las solicitudes de agregar al carrito
    cy.intercept('POST', '**/shop/?wc-ajax=add_to_cart').as('addToCart');
    
    // Agregar productos uno por uno y esperar la respuesta
    cy.get(ShopLocators.btnProducto1)
      .click({force: true})
      .then(() => {
        cy.wait('@addToCart');
        cy.log('✅ Producto 1 agregado');
      });

    cy.get(ShopLocators.btnProducto2)
      .click({force: true})
      .then(() => {
        cy.wait('@addToCart');
        cy.log('✅ Producto 2 agregado');
      });

    cy.get(ShopLocators.btnProducto3)
      .click({force: true})
      .then(() => {
        cy.wait('@addToCart');
        cy.log('✅ Producto 3 agregado');
      });

    // Esperar a que se actualice el contador y verificar
    cy.log('🔍 Verificando cantidad de items en el carrito...');
    cy.get(ShopLocators.contadorCarrito, { timeout: 10000 })
      .should('exist')
      .and('be.visible')
      .invoke('text')
      .then((text) => {
        cy.log(`📊 Texto del contador: ${text}`);
        const numItems = parseInt(text.match(/\d+/)[0]);
        cy.log(`📊 Número de items: ${numItems}`);
        
        // Verificar que el texto incluya "item" o "items"
        expect(text.toLowerCase()).to.match(/item(s)?/);
        expect(numItems).to.be.at.least(2, 'Debe haber al menos 2 items en el carrito');
      });

    // Esperar a que se complete la actualización del carrito
    cy.wait(2000);
  }

  // Método para configurar los interceptores de red
  configurarInterceptores = () => {
    cy.intercept('GET', '**/basket*').as('getBasketRequest');
    cy.intercept('POST', '**/shop/?wc-ajax=add_to_cart').as('addToCart');
    cy.intercept('POST', '**/basket/**').as('updateCart');
    cy.intercept('GET', '**/basket/').as('basketRedirect');
    cy.intercept('GET', 'https://practice.automationtesting.in/basket/').as('basketFinal');
  }

  // Método para verificar los productos en el carrito
  verificarProductosEnCarrito = () => {
    cy.log('🔄 Iniciando verificación del carrito...');
    cy.intercept('GET', '**/basket/').as('basketRedirect');
    cy.intercept('GET', 'https://practice.automationtesting.in/basket/').as('basketFinal');

    cy.visit('/basket/', {
      failOnStatusCode: true,
      retryOnStatusCodeFailure: true,
      timeout: 10000
    });

    cy.wait(['@basketRedirect', '@basketFinal'], { timeout: 10000 })
      .then(() => {
        cy.log('✅ Redirección al carrito completada');
        cy.get(ShopLocators.tablaCarrito, { timeout: 10000 })
          .should('exist')
          .then(() => {
            cy.log('🔍 Verificando elementos del carrito...');
            this.verificarElementosCarrito();
          });
      });
  }
}

export default new ShopPage();
