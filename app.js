const RoleType = {
    Manager: require("./lib/Manager"),
    Engineer: require("./lib/Engineer"),
    Intern: require("./lib/Intern")
}
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
var employees = []

// Initial questions

function Questions() {

    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the employee's name?"
        },
        {
            type: "input",
            name: "id",
            message: "What is the employee's ID?"
        },
        {
            type: "input",
            name: "email",
            message: "What is the employee's email address?"
        },
        {
            type: "list",
            name: "role",
            message: "What position applies to the employee?",
            choices: [
                "Manager",
                "Engineer",
                "Intern"
            ]
        }
    ]).then(function(answer) {
        SecondQuestions(answer)
    })
}
//Call initial questions
Questions()

// Role related questions
function SecondQuestions({name, id, email, role}) {
    if (role === "Manager") {
        var variableTrait = "the managers Office number"
    } else if (role === "Engineer") {
        var variableTrait = "the engineers GitHub username"
    } else {
        var variableTrait = "the interns school"
    }

    inquirer.prompt([
        {
            type: 'input',
            name: 'answer',
            message: `What is ${variableTrait}?`
        }
    ]).then(function({answer}) {
        employees.push(new RoleType[role](name, id, email, answer))
        FinalQuestion()
    })
}

// Add more employee's or finalise
function FinalQuestion() {
    inquirer.prompt([
        {
            type: "list",
            name: "ans",
            message: "Would you like to add another employee, if not, select no and the page will be created.",
            choices: [
                "Yes",
                "No"
            ]
        }
    ]).then(function({ans}) {
        if (ans === "Yes") {
            console.log("Add another employee")
            Questions()
        } else {
            console.log("Successfully written to main.html")
            var html = render(employees)
            fs.writeFile(outputPath, html, err => {
                if (err) throw err
            })
        }
    })
}