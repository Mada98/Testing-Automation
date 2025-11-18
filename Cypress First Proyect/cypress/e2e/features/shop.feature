Feature: 02 - Crowdar Academy 2025 - Shop Store

    Background:
        Given Me logueo como usuario correctamente - shop demo
    @focus @shop @rangoPrecio @detalle
    Scenario: Buscar por rango de precio
        When Ingreso al shop
        And Busco por rango de precio, de medio a mayor
        * Ingreso al rango de busqueda marcada
        Then Verifico que ingreso al rango de busqueda deseada


    @focus @shop @rangoPrecio @detalle
    Scenario: Interceptar Carrito de compras
        When Ingreso al shop
        And Agrego 3 productos al carrito
        Then Verifico que se agregaron los productos al carrito correctamente 'Moved Permanently'

    @focus @shop @rangoPrecio @detalle
    Scenario: Vaciar Carrito de compras
        When Ingreso al shop
        And Agrego 3 productos al carrito
        Then Verifico que se agregaron los productos al carrito correctamente 'Moved Permanently'
        And elimino productos seleccionados
        Then Verifico que no hay productos agregados
