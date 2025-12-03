Feature: Login SauceDemo
  @login
  Scenario: Login como usuario normal
    Given  Me logueo como usuario correctamente
  
  @login
  Scenario Outline: Login usuario - Escenario Outline 
    Given Navego al sitio de automationtesting
    When Me logueo como usuario con user '<user>' y pass '<pass>' 
    Then Valido resultado del login según el tipo de usuario

        Examples:
          | user                                            |   pass                |
          | standard_user                                   |   secret_sauce        |
          | locked_out_user                                 |   secret_sauce        |
          | problem_user                                    |   secret_sauce        |
          | performance_glitch_user                         |   secret_sauce        |
          | error_user                                      |   secret_sauce        |
          | visual_user                                     |   secret_sauce        |

  @login @prompt
  Scenario: Login usando prompt interactivo
    Given Navego al sitio de automationtesting
    When Me logueo usando prompt para ingresar credenciales
    Then Valido saludo de bienvenida en el Título

  @login @prompt
  Scenario: Login seleccionando usuario desde prompt
    Given Navego al sitio de automationtesting
    When Me logueo seleccionando usuario desde prompt
    Then Valido saludo de bienvenida en el Título