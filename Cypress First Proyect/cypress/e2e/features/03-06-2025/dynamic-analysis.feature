# language: es
@dynamic @commands @analysis
Característica: Análisis Dinámico con Comandos Integrados
  Como QA automatizador  
  Quiero usar comandos de Cypress que integren los scripts de análisis
  Para generar casuística BDD dinámica basada en la exploración de la aplicación

  Antecedentes:
    Dado que navego al sitio de automationtesting

  @mapeo @elementos
  Escenario: Mapear elementos de página dinámicamente
    Cuando mapeo todos los elementos de la página actual
    Entonces verifico que se encontraron al menos 5 elementos

  @extraccion @casos
  Escenario: Extraer casos de prueba y convertir a BDD
    Cuando extraigo toda la información de casos disponibles
    Entonces verifico que se extrajeron múltiples secciones

  @generacion @steps  
  Escenario: Generar steps dinámicamente desde elementos
    Cuando mapeo todos los elementos de la página actual
    Cuando genero steps dinámicos basados en los elementos encontrados
    Entonces verifico que se generaron steps de navegación

  @procesador @unificado
  Escenario: Ejecutar procesador unificado desde Cypress
    Cuando ejecuto el procesador unificado mediante comando
    Entonces verifico que se generaron locators automáticamente

  @integracion @completa
  Escenario: Flujo completo de análisis y generación
    Cuando ejecuto el flujo completo de análisis dinámico
    Entonces verifico que se mapearon elementos exitosamente

  @workflow @automatizado
  Escenario: Workflow automatizado completo
    Cuando inicio el workflow de análisis automatizado
    Cuando configuro las opciones de procesamiento completo  
    Cuando ejecuto el análisis con generación de reportes
    Entonces verifico que el workflow se completó exitosamente 