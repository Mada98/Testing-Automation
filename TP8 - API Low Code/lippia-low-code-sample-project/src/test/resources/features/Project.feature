@project @regression
Feature: Project

  Background:
    And header X-Api-Key = $(env.api_key)
    And header Content-Type = application/json
    And header Accept = */*

#Creacion de proyecto parametros obligatorios y no obligatorios.
  @newProject @happyPath @smoke
  Scenario Outline: Create a new project
    Given base url $(env.base_url_clockify)
    And endpoint /workspaces/$(env.workspace_id)/projects
    And body jsons/bodies/<body>
    When execute method POST
    Then the status code should be 201
    * print response

    Examples:
      | body                           |
      | create_a_new_project_full.json |
      | create_a_new_project_min.json  |
    

#Encontrar proyecto por ID

  @findProject @happyPath @smoke
  Scenario: Find an existing project
    Given base url $(env.base_url_clockify)
    And endpoint /workspaces/$(env.workspace_id)/projects/69289929b37f4855bc67707e
    When execute method GET
    Then the status code should be 200
    * print response

#Edicion nombre de proyecto
  @editProjectName @happyPath @smoke
  Scenario: Edit an existing project
    Given base url $(env.base_url_clockify)
    And endpoint /workspaces/$(env.workspace_id)/projects/69289929b37f4855bc67707e
    And body jsons/bodies/create_a_new_project_min.json
    And set value "Edicion de nombre" of key name in body jsons/bodies/create_a_new_project_min.json
    When execute method PUT
    Then the status code should be 200
    And response should be $.name = Edicion de nombre
    * print response

#API KEY invalida, error 401
  @error401 @errorPath
  Scenario: Invalid API Key
    Given base url $(env.base_url_clockify)
    And header X-Api-Key = INVALID_KEY
    And body jsons/bodies/create_a_new_project_full.json
    When execute method POST
    Then the status code should be 401
    * print response

#Proyecto no encontrado tira error 400, no 404 
  @error404 @errorPath
  Scenario: Non-existent project
    Given base url $(env.base_url_clockify)
    And endpoint /workspaces/$(env.workspace_id)/project2/000000000000000000000000
    When execute method GET
    Then the status code should be 404
    * print response

#Creacion de proyecto sin campos obligatorios, error 400
  @error400 @errorPath 
  Scenario: Create a project without required fields
    Given base url $(env.base_url_clockify)
    And endpoint /workspaces/$(env.workspace_id)/projects
    And body jsons/bodies/empty_body.json
    When execute method POST
    Then the status code should be 400
    * print response

  @testing
  Scenario: Create / Search / Edit / Delete
    Given base url $(env.base_url_clockify)
    And endpoint /workspaces/$(env.workspace_id)/projects
    And body jsons/bodies/create_a_new_project_full.json
    And set value "Flujo complasdetoa" of key name in body jsons/bodies/create_a_new_project_full.json
    When execute method POST 
    Then the status code should be 201
    * define id_creado = $.id
    Given base url $(env.base_url_clockify)
    And header X-Api-Key = $(env.api_key)
    And header Content-Type = application/json
    And endpoint /workspaces/$(env.workspace_id)/projects/$(id_creado)
    When execute method DELETE
    Then the status code should be 200
    
    * print response

