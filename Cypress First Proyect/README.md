Fork para Academy 2025-1S - Advanced Automation Testing

# Comandos Utiles
 npm init
 
 npm install cypress --save-dev
 
 npm install cypress-donwloadfile
 
 Run Cypress:  .\node_modules\.bin\cypress open

Comando optativo: npx cypress open              

Ante dificultades ejecutar en modo Administrador:
 - Para CMD: ".\node_modules\.bin\cypress.cmd install --force"
 - Para Bash: " .\\node_modules\\.bin\\cypress.cmd install --force"

 Después ya podrán correr "npm run cy:open"


 - Error de Cypress cache
    
    **Borrar variables de entorno PROXY**
    
    - **Borrar configuración de PROXY del proyecto:** Desde el proyecto correr el sig comando → *npm config list Acá aparecerá una lista:* **Borrar de la lista el https y el proxy** con los siguientes comandos → *npm config rm https-proxy → npm config rm proxy*
    - Luego borrar node_modules
    - npm cache clean --force
    - npm config set registry https://registry.yarnpkg.com
    - Correr → *npm install*
    - Instalar Cypress →*npm install cypress --save-dev*
    Correr proyecto → (Acá debe levantar el proyecto correctamente)
    - Listo! 🤙🏼

# cypress-cucumber-boilerplate-for-e2e-testing

<img src="https://media-exp1.licdn.com/dms/image/C4E0BAQF1dg2KtKFdPg/company-logo_200_200/0/1626295436859?e=2159024400&v=beta&t=Ib_T9PXXQxkHRKnj3Oe65EKuR6EAh01IgAA6IGvU0FY" alt="exemplo imagem">

> Cypress 10+ with Cucumber boilerplate project.

### 💻 Topics

Integrated with:

- [x] https://github.com/badeball/cypress-cucumber-preprocessor
- [x] https://github.com/bahmutov/cypress-esbuild-preprocessor
- [x] https://www.npmjs.com/package/multiple-cucumber-html-reporter
- [x] https://github.com/cucumber/json-formatter
- [x] https://github.com/Shelex/cypress-allure-plugin

(+ bundlers: https://github.com/badeball/cypress-cucumber-preprocessor/tree/master/examples)

- ## 💻 Pre-requisites

1. Node JS
2. Optional: Java 8 for Allure Reporter
3. Optional: Json-formatter for Native Reporter option(depends on your OS: https://github.com/cucumber/json-formatter)

## 🚀 Install the project

Install project dependencies with: npm i

## Run the demo:

1. Standard Execution: npm run cypress:execution
2. Native report(with JSON FORMATTER): Check how to do it in this video: [Cucumber BDD Report - YouTube](https://www.youtube.com/watch?v=5AGXK9cL2fs&t=2s&ab_channel=JoanMedia)
3. Allure Report: 
   1. npm run cypress:execution-allure
   2. npm run allure:report
   3. allure open
   4. You'll get a report like this one: GitHub Page - Allure Report Sample: https://joanesquivel.github.io/cypress-cucumber-boilerplate/


##  Sample repo to generate an allure report as an artifact using GH Actions

* https://github.com/SeyiOG/newCyLearn2/blob/main/.github/workflows/cypress-allure-report.yml
