# language: es
@dynamic @simple
Característica: Análisis Dinámico Simple
  Como QA automatizador
  Quiero probar rápidamente los comandos integrados
  Para validar el funcionamiento del sistema híbrido

  Antecedentes:
    Dado que navego al sitio de automationtesting

  @mapeo @rapido
  Escenario: Mapeo rápido de elementos
    Cuando mapeo todos los elementos de la página actual
    Entonces verifico que se encontraron al menos 3 elementos

  @extraccion @simple
  Escenario: Extracción simple de casos
    Cuando extraigo toda la información de casos disponibles
    Entonces verifico que se extrajeron múltiples secciones

  @workflow @basico
  Escenario: Workflow básico
    Cuando inicio el workflow de análisis automatizado
    Cuando configuro las opciones de procesamiento completo
    Cuando ejecuto el análisis con generación de reportes
    Entonces verifico que el workflow se completó exitosamente 