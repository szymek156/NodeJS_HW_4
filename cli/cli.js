const repl     = require("repl");
const color    = require("../helpers/console_colors");
const _data    = require("../helpers/data");
const config   = require("../config");
const validate = require("../helpers/validate");

const MENU_DB  = config.MENU_DB;
const CART_DB  = config.CART_DB;
const TOKEN_DB = config.TOKEN_DB;
const USER_DB  = config.USER_DB;

let cli = {};

// Create a horizontal line across the screen
cli.horizontalLine = function() {
    // Get the available screen size
    var width = process.stdout.columns;

    // Put in enough dashes to go across the screen
    var line = "";
    for (i = 0; i < width; i++) {
        line += "-";
    }
    console.log(line);
};

let show  = {};
show.menu = {
    desc: "View all the current menu items",
    exec: async function() {
        let menu = await _data.read(MENU_DB, "menu");

        console.log(menu);
    }
};

show.orders = {
    desc: "View all the recent orders in the system (orders placed in the last 24 hours)",
    exec: async function() {
        let orders = await _data.list(CART_DB);

        let recent = [];

        for (let order of orders) {
            let stat = await _data.stat(CART_DB, order);

            // Diff date of file creation and current
            let diff = new Date(stat.birthtime - Date.now())

            if (diff.getHours() <= 24) {
                recent.push(order);
            }
        }

        console.log(recent);
    }
};

show.order = {
    desc: "Lookup the details of a specific order by order ID",
    exec: async function(id) {
        id = validate.parameter(id, "string")

        if (!id) {
            console.log(`${color.FgRed} Invalid id parameter ${color.Reset}`);
            return;
        }

        let orders = await _data.read(CART_DB, id);

        console.log(orders);
    }
};

show.users = {
    desc: "View all the users who have signed up in the last 24 hours",
    exec: async function() {
        let tokens = await _data.list(TOKEN_DB);

        // Use set to avoid email duplication, in case if user used different cookies to log in
        emails = new Set();

        for (let token of tokens) {
            let stat = await _data.stat(TOKEN_DB, token);

            // Diff date of file creation and current
            let diff = new Date(stat.birthtime - Date.now())

            if (diff.getHours() <= 24) {
                let element = await _data.read(TOKEN_DB, token);
                emails.add(element.email);
            }
        }

        console.log(emails);
    }
};

show.user = {
    desc: "Lookup the details of a specific user by email address",
    exec: async function(email) {
        email = validate.parameter(email, "string");

        if (!email) {
            console.log(`${color.FgRed} Invalid email parameter ${color.Reset}`);
            return;
        }

        let user = await _data.read(USER_DB, email);

        console.log(user);
    }
};

show.help = {
    desc: "Shows avaliable commands",
    exec: async function() {
        cli.horizontalLine();

        console.log("Avaliable commands:");

        // Show each command
        for (var key in show) {
            if (show.hasOwnProperty(key)) {
                console.log(color.FgGreen, `${key}`.padEnd(10), color.Reset, show[key].desc);
            }
        }

        cli.horizontalLine();
    }
};

cli.init = function() {
    let r = repl.start({prompt: "> ", input: process.stdin, output: process.stdout});

    r.on("exit", () => {
        process.exit(0);
    });

    r.defineCommand("help", function() {
        show.help.exec();
        this.displayPrompt();
    });

    r.defineCommand("show", async function(arg) {
        let [what, param] = arg.split(" ");

        try {
            await show[what].exec(param);
        } catch (err) {
            console.log(`${color.FgRed} command failed ${color.Reset} 'show ${arg}'`);
            console.log(`${err}`);

            show.help.exec();
        }

        this.displayPrompt();
    });
};

module.exports = cli;