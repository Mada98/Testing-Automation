const fs = require('fs').promises;
const path = require('path');

// Diccionario completo de traducciones
const completeTranslations = {
    // Traducciones básicas
    'Now click on Home menu button': 'Hago click en el botón del menú Home',
    'Test whether the Home page has Three Sliders only': 'Verifico que la página Home tiene solo tres sliders',
    'Test whether the Home page has Three Arrivals only': 'Verifico que la página Home tiene solo tres llegadas',
    'Now click the image in the Arrivals': 'Hago click en la imagen de las llegadas',
    'Click on Description tab for the book you clicked on.': 'Hago click en la pestaña Description del libro seleccionado',
    'Click the add to basket button': 'Hago click en el botón add to basket',
    'Enter the Coupon code as \'krishnasakinala\' to get 50rps off on the total.': 'Ingreso el código de cupón \'krishnasakinala\' para obtener 50rps de descuento',
    'User has the feasibility to remove the book at the time of check out also': 'Verifico que puedo remover el libro durante el checkout',
    'Click on textbox value under quantity in Check out page to add or subtract books.': 'Hago click en el campo de cantidad en la página de checkout para agregar o quitar libros',
    'Now after the above change \'Update Basket\' button will turn into Clickable mode.': 'Verifico que después del cambio el botón \'Update Basket\' se vuelve clickeable',
    'Now click on Update Basket to reflect those changes': 'Hago click en Update Basket para reflejar los cambios',
    'User has the feasibility to Update Basket at the time of check out.': 'Verifico que puedo actualizar el carrito durante el checkout',
    'User has the feasibility to Update Basket at the time of check out': 'Verifico que puedo actualizar el carrito durante el checkout',
    'User has the feasibility to find the total price of the books at to find the total price of the books at the time of check out': 'Verifico que puedo encontrar el precio total de los libros durante el checkout',
    'Clicking on Proceed to Checkout button leads to payment gateway page': 'Verifico que hacer click en Proceed to Checkout lleva a la página de pago',
    'User has the feasibility to add coupon in the payment gateway page and also he can find billing,order and additional details.': 'Verifico que puedo agregar cupón en la página de pago y encontrar detalles de facturación y pedido',
    
    // Traducciones de login
    'Enter incorrect username in username textbox': 'Ingreso un nombre de usuario incorrecto en el campo username',
    'Enter incorrect password in password textbox.': 'Ingreso una contraseña incorrecta en el campo password',
    'Enter valid username in username textbox': 'Ingreso un nombre de usuario válido en el campo username',
    'Now enter empty password in the password textbox': 'Dejo vacío el campo de contraseña',
    'Enter empty username in username textbox': 'Dejo vacío el campo de nombre de usuario',
    'Now enter valid password in the password textbox': 'Ingreso una contraseña válida en el campo password',
    'Enter the password field with some characters.': 'Ingreso algunos caracteres en el campo de contraseña',
    
    // Traducciones adicionales
    'Image should be clickable and shoul navigate to next page where user can add that book to his basket': 'Verifico que la imagen es clickeable y navega a la siguiente página donde puedo agregar el libro al carrito',
    'There should be a description regarding that book the user clicked on': 'Verifico que hay una descripción del libro seleccionado',
    'There should be a Reviews regarding that book the user clicked on': 'Verifico que hay reseñas del libro seleccionado',
    'User can add a book by clicking on Add To Basket button which adds that book in to his Basket': 'Verifico que puedo agregar un libro haciendo click en Add To Basket',
    'Now it throws an error prompt like you must enter a value between 1 and 20': 'Verifico que muestra un error indicando que debo ingresar un valor entre 1 y 20',
    'User can click on the Item link in menu item after adding the book in to the basket which leads to the check out page': 'Verifico que puedo hacer click en el enlace Item después de agregar el libro al carrito',
    'User can able to apply coupon by entering \'krishnasakinala\' in the coupon textbox which give 50rps off on the total price': 'Verifico que puedo aplicar el cupón \'krishnasakinala\' para obtener 50rps de descuento',
    'User can not able to apply coupon by entering \'krishnasakinala\' in the coupon textbox which give 50rps off on the total price because the coupon is applicable for the book price > 450 rps': 'Verifico que no puedo aplicar el cupón porque es válido solo para libros con precio mayor a 450 rps'
};

// Función para aplicar traducciones completas
async function applyCompleteTranslations(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf8');
        let translatedContent = content;
        
        // Aplicar todas las traducciones
        Object.entries(completeTranslations).forEach(([english, spanish]) => {
            const regex = new RegExp(english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            translatedContent = translatedContent.replace(regex, spanish);
        });
        
        // Limpiar pasos que empiecen con palabras clave duplicadas
        translatedContent = translatedContent.replace(/(\s+)(Given|When|Then|And)\s+(Given|When|Then|And)\s+/g, '$1$2 ');
        
        await fs.writeFile(filePath, translatedContent);
        console.log(`✅ Traducciones aplicadas: ${path.basename(filePath)}`);
        
        return true;
    } catch (error) {
        console.error(`❌ Error aplicando traducciones a ${filePath}:`, error.message);
        return false;
    }
}

// Función principal
async function main() {
    try {
        const baseDir = path.join(__dirname, '..');
        const featuresDir = path.join(baseDir, 'cypress/e2e/features/generated');
        
        console.log('🌐 Aplicando traducciones completas a archivos .feature...\n');
        
        const files = await fs.readdir(featuresDir);
        const featureFiles = files.filter(file => file.endsWith('.feature'));
        
        let successCount = 0;
        
        for (const file of featureFiles) {
            const filePath = path.join(featuresDir, file);
            const success = await applyCompleteTranslations(filePath);
            if (success) successCount++;
        }
        
        console.log(`\n🎉 Traducciones completadas: ${successCount}/${featureFiles.length} archivos procesados`);
        console.log('\n📋 Mejoras aplicadas:');
        console.log('   • Traducción completa de pasos en inglés');
        console.log('   • Limpieza de palabras clave duplicadas');
        console.log('   • Formato consistente en español');
        console.log('\n💡 Recomendación: Ejecutar validateFeatures.js para verificar el resultado');
        
    } catch (error) {
        console.error('❌ Error durante las traducciones:', error);
        process.exit(1);
    }
}

main(); 