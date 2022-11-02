import fs from 'fs';

const createCSV = () => {
    // get the current data as a string in the format of DD-MM-YYYY
    const date = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).split('/').join('-');

    const fileName = `tweets-${date}.csv`;

    // if file doesn't exist, create the CSV with the header trend,id,text
    if (!fs.existsSync(fileName)) {
        fs.writeFileSync(fileName, 'trend,id,text');
    }

    return fileName;
}

export { createCSV };