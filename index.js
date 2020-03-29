// Requires file system to work with Node.js
const fs = require("fs");
// Requires inquirer to ask questions
const inquirer = require("inquirer");
//Required path to handle and transform the file paths
const path = require("path");
//Required open to return the promise for the custom event listener that returns the resume color
const open = require("open");
//Required api to retrieve the data that is generated
const api = require("./api");
//Allows the HTML to dynamically be created to show information or images
const generateHTML = require("./html");
//Converts HTML to PDF form
const convertFactory = require("electron-html-to");
// The two questions the user is asked
const login = [
  {
    type: "input",
    name: "github",
    message: "What is your GitHub username?"
  },

  {
    type: "list",
    name: "color",
    message: "What is your favorite color?",
    choices: ["green", "blue", "pink", "red"]
  }
];
//process.cwd used to get the current working directory through the node process
function writeToFile(fileName, data) {
  return fs.writeFileSync(path.join(process.cwd(), fileName), data);
}
//initializes attributes from inqruirer 
function init() {
  inquirer.prompt(login).then(({ github, color }) => {
    console.log("Searching...");

    api
      .getUser(github)
      .then(response =>
        api.getTotalStars(github).then(stars => {
          return generateHTML({
            stars,
            color,
            ...response.data
          });
        })
      )
      //converts html to pdf
      .then(html => {
        const conversion = convertFactory({
          converterPath: convertFactory.converters.PDF
        });

        conversion({ html }, function(err, result) {
          if (err) {
            return console.error(err);
          }

          result.stream.pipe(
            fs.createWriteStream(path.join(__dirname, `resume_${color}.pdf`))
          );
          //stops the convert factory process 
          conversion.kill();
        });

        open(path.join(process.cwd(), `resume_${color}.pdf`));
      });
  });
}

init();

