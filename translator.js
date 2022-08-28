// Furbish/English Translator
// Author: Calcaware

const usage = `translate options [message]
  Options:
    -e  --english    Furbish to English
    -f  --furbish    English to Furbish
    -h  --help       Get usage information.
  Notes:
    Output words surrounded by {} didn't translate directly.`;

const dictionary = require("./data/dict-v1");

function translate(to, message) {
	if (to == "english") {
		let output = message.join(" ");
		for (let d = 0; d < dictionary.length; d++) {
			if (output.indexOf(dictionary[d][0]) !== -1)
				output = output.replace(dictionary[d][0], dictionary[d][1]);
		}
		console.log(output);
	}
	else if (to == "furbish") {
		let output = message.join(" ");
		for (let d = 0; d < dictionary.length; d++) {
			if (output.indexOf(dictionary[d][1]) !== -1)
				output = output.replace(dictionary[d][1], dictionary[d][0]);
		}
		console.log(output);
	}
}

(() => {
	let args = process.argv.slice(2);
	switch (args[0]) {

		case "--english":
		case "-e":
			args.shift();
			translate("english", args);
			break;

		case "--furbish":
		case "-f":
			args.shift();
			translate("furbish", args);
			break;

		case "--help":
		case "-h":
		default:
			console.log(usage);
			break;

	}
})();