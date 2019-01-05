const repl  = require("repl");
const color = require("../helpers/console_colors");

let cli = {};
let r   = null;

let show  = {};
show.menu = {
    desc: "View all the current menu items",
    exec: function() {

    }
};

show.orders = {
    desc: "View all the recent orders in the system (orders placed in the last 24 hours)",
    exec: function() {

    }
};

show.order = {
    desc: "Lookup the details of a specific order by order ID",
    exec: function(id) {

    }
};

show.users = {
    desc: "View all the users who have signed up in the last 24 hours",
    exec: function() {

    }
};

show.user = {
    desc: "Lookup the details of a specific user by email address",
    exec: function(email) {

    }
};

show.help = {
    desc: "Shows avaliable commands",
    exec: function() {
        console.log("Avaliable commands:");

        // Show each command
        for (var key in show) {
            if (show.hasOwnProperty(key)) {
                console.log(color.FgGreen, `${key}`.padEnd(10), color.Reset, show[key].desc);
            }
        }
    }
};

cli.init = function() {
    r = repl.start({prompt: "> ", input: process.stdin, output: process.stdout});

    r.on("exit", () => {
        process.exit(0);
    });

    r.defineCommand("help", () => {
        show.help();
        this.displayPrompt();
    });

    r.defineCommand("show", function(arg) {
        let [what, param] = arg.split(" ");

        try {
            show[what].exec(param);
        } catch (err) {
            console.log(`Unknown command 'show ${arg}'`);

            show.help.exec();
        }

        this.displayPrompt();
    });
};

module.exports = cli;