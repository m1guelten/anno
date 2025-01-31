const fs = require('fs');

const fileProcessor = {
  viewFile: (partialsNotReady, partialsReady) => {
    function readFiles(dirname) {
      let result = [];
      fs.readdirSync(dirname).forEach((fileName) => {
        const contents = fs.readFileSync(dirname + fileName, 'utf-8');
        result.push({ name: fileName, contents: contents });
      });
      return result;
    }
    let allFiles = readFiles(partialsNotReady).concat(readFiles(partialsReady));
    allFiles.sort((a, b) => {
      return a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: 'base',
      });
    });
    let finalFile = '';
    for (let file of allFiles) {
      finalFile += file.contents + '\n\n';
    }
    return finalFile;
  },
  parsingParagraph: (startFile, endCatalog) => {
    let fs = require('fs');
    fs.readFile(startFile, 'utf8', function (err, data) {
      if (data) {
        const path = require('path');
        fs.mkdir(
          path.join(__dirname, endCatalog),
          { recursive: true },
          (err) => {}
        );

        const paragraphText = data.split('\\n');

        const resultArray = [...paragraphText];
        for (let i = 0; i < paragraphText.length; i++) {
          if (paragraphText[i].match(/[!.?]/g).length > 6) {
            resultArray.splice(i, 1);
            const temp = paragraphText[i]
              .replace(/[.]/g, '.&')
              .replace(/[!]/g, '!&')
              .replace(/[?]/g, '?&')
              .split('&');

            let result = '';
            for (let i = 1; i <= temp.length; i++) {
              result += temp[i - 1];
              if (i % 6 === 0 || i === temp.length) {
                resultArray.push(result);
                result = '';
              }
            }
          }
        }
        for (let i = 0; i < resultArray.length; i++) {
          fs.writeFile(
            `${endCatalog}/part${i + 1}.txt`,
            resultArray[i],
            {
              encoding: 'utf8',
              flag: 'w',
              //    mode: 0o666,
            },
            (err) => {
              if (err) console.log(err);
            }
          );
        }
      }
      if (err) {
        console.log(err);
      }
    });
    return endCatalog;
  },
};

console.log(
  fileProcessor.viewFile('./data/aboba1partInitial/', './data/aboba1partReady/')
);
console.log(
  fileProcessor.parsingParagraph(
    './data/exampleOriginal.txt',
    './data/examplePartials'
  )
);
module.exports = fileProcessor;
