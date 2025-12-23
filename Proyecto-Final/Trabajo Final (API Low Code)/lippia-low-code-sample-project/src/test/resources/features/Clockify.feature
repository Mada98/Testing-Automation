@Clockify @Regression
  Feature: Gestion de horas en Clockify

    Background:
      Given base url $(env.base_url_clockify)
      And header X-Api-Key = $(env.api_key)
      And header Content-Type = application/json
      And header Accept = */*

    @ConsultarHoras
    Scenario: Consultar las horas registradas
      And endpoint /workspaces/$(env.workspace_id)/user/6728f41344f22145c5f04b6a/time-entries
      When execute method GET
      Then the status code should be 200

    @AgregarHora
    Scenario: Agregar horas a un proyecto
      And endpoint /workspaces/$(env.workspace_id)/time-entries
      And body jsons/bodies/add_time_entry.json
      When execute method POST
      Then the status code should be 201
      * define entryId = $.id

    @EditarHora
    Scenario: Editar un registro de hora
      Given call Clockify.feature@AgregarHora
      And endpoint /workspaces/6925c01313ecba2b56b58cfb/time-entries/{{entryId}}
      And body jsons/bodies/edit_time_entry.json
      When execute method PUT
      Then the status code should be 200
      And verify the response description 'equals' This is a sample edited description.

    @EliminarHora
    Scenario: Elminar registro de hora
      Given call Clockify.feature@AgregarHora
      And endpoint /workspaces/6925c01313ecba2b56b58cfb/time-entries/{{entryId}}
      When execute method DELETE
      Then the status code should be 204