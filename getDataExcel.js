// Requiring the module
const reader = require("xlsx");
const readlineSync = require("readline-sync");

const getDataExcel = () => {
  //   const fileName = readlineSync.question("Input file name : ");

  //   const file = reader.readFile("./" + fileName + ".xlsx");
  const file = reader.readFile("./dataterbaru.xlsx");

  let data = [];

  const sheets = file.SheetNames;

  for (let i = 0; i < sheets.length; i++) {
    const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
    temp.forEach((res) => {
      for (const value in res) {
        if (Object.hasOwnProperty.call(res, value)) {
          const data = res[value];
          if (Number.isInteger(data)) {
            res[value] = Math.floor(data);
          }
        }
      }

      Object.keys(res).forEach((key) => {
        var replacedKey = key
          .trim()
          .replace(/\s+/g, "_")
          .replace(".", "")
          .replace("*", "")
          .toLowerCase();

        res[replacedKey] = res[key];
        delete res[key];
      });

      data.push(res);
    });
  }

  return data;
};
