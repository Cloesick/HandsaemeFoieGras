// Importeer de benodigde Node.js modules
const fs = require('fs');
const path = require('path');

// Definieer de hoofdmap die doorzocht moet worden
const directoryPath = path.join(__dirname, 'public', 'images');

/**
 * Hernoemt bestanden in een map en de bijbehorende submappen.
 * @param {string} directory - Het pad naar de map.
 */
function renameFilesInDirectory(directory) {
    // Lees de inhoud van de map
    const files = fs.readdirSync(directory);

    files.forEach(file => {
        const oldPath = path.join(directory, file);
        const stat = fs.statSync(oldPath);

        // Als het een submap is, roep de functie opnieuw aan (recursief)
        if (stat.isDirectory()) {
            renameFilesInDirectory(oldPath);
        } else {
            // Haal de bestandsnaam en de extensie apart op
            const fileExtension = path.extname(file);
            const fileName = path.basename(file, fileExtension);

            // Maak een "schone" bestandsnaam in PascalCase:
            const cleanedName = fileName
                .replace(/\(.*?\)/g, '') // Verwijder (haakjes) en inhoud
                .trim() // Verwijder spaties aan begin/eind
                .replace(/[^a-zA-Z0-9\s]/g, ''); // Verwijder speciale tekens, behalve spaties

            const words = cleanedName.split(/\s+/).filter(Boolean); // Splits op spaties en verwijder lege items

            const newFileName = words.map(word => {
                // Eerste letter van elk woord met een hoofdletter
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            }).join(''); // Voeg de woorden samen

            // Voeg de extensie weer toe aan de nieuwe naam
            const newFile = `${newFileName}${fileExtension}`;
            const newPath = path.join(directory, newFile);

            // Hernoem het bestand alleen als de naam daadwerkelijk verandert
            if (oldPath !== newPath) {
                try {
                    fs.renameSync(oldPath, newPath);
                    console.log(`Hernoemd: ${file} -> ${newFile}`);
                } catch (error) {
                    console.error(`Fout bij hernoemen van ${file}:`, error);
                }
            }
        }
    });
}

// Start het proces
try {
    console.log(`Start met het hernoemen van bestanden in: ${directoryPath}`);
    renameFilesInDirectory(directoryPath);
    console.log('Hernoemen voltooid!');
} catch (error) {
    console.error('Er is een fout opgetreden:', error);
}
