Feature: 03 - Crowdar Academy 2025 - Test Cases

    Background:
        Given Navego a la página de Test Cases

    @focus @testCases @extraccion
    Scenario: Extraer información de todos los casos de prueba
        When Extraigo toda la información de casos de prueba
        And Extraigo elementos necesarios de los casos de prueba
        Then Verifico que existan 18 casos de prueba

    @focus @testCases @home
    Scenario: Verificar sección Home Page
        When Expando la sección "Home Page"
        Then Verifico que existan 18 casos de prueba
        And Verifico que el primer caso sea "Home Page with three Sliders only"

    @focus
    Scenario: Verificar sección My Account - Login
        When Expando la sección "MY ACCOUNT - LOGIN"
        Then Verifico que existan 8 casos de prueba de login
        And Verifico que incluya pruebas de "Log-in with valid username and password"

    @focus
    Scenario: Verificar sección Shop
        When Expando la sección "SHOP"
        Then Verifico que existan 12 casos de prueba de shop
        And Verifico que incluya "Shop-Filter By Price Functionality"

    @focus
    Scenario: Verificar sección My Account - Registration
        When Expando la sección "MY ACCOUNT - REGISTRATION" 
        Then Verifico que existan 5 casos de prueba de registro
        And Verifico que incluya validación de "Registration-Sign-in"
