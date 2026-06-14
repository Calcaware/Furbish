const fs = require("fs");
const path = require("path");

const officialDict = require("./data/dict-v1");

let communityDict = [];
const communityDictPath = path.join(__dirname, "data", "community-dict.json");
function loadCommunityDict() {
	try {
		communityDict = JSON.parse(fs.readFileSync(communityDictPath, "utf8"));
	} catch (e) {
		communityDict = [];
	}
}
loadCommunityDict();

function mergeEntries() {
	const entries = [...officialDict];
	for (const e of communityDict) {
		entries.push([e.furbish, e.english]);
	}
	return entries;
}

function buildFurbishToEnglish(entries) {
	return entries
		.map(e => ({ phrase: e[0].toLowerCase(), translation: e[1] }))
		.sort((a, b) => b.phrase.length - a.phrase.length);
}

function buildEnglishToFurbish(entries) {
	const map = new Map();
	for (const entry of entries) {
		const furbish = entry[0].toLowerCase();
		for (let i = 1; i < entry.length; i++) {
			const english = entry[i].toLowerCase();
			if (!map.has(english) || furbish.length > map.get(english).length) {
				map.set(english, furbish);
			}
		}
	}
	return Array.from(map.entries())
		.map(([phrase, translation]) => ({ phrase, translation }))
		.sort((a, b) => b.phrase.length - a.phrase.length);
}

let furbishToEnglish = buildFurbishToEnglish(mergeEntries());
let englishToFurbish = buildEnglishToFurbish(mergeEntries());

function escapeRegex(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function translateTo(text, map) {
	let result = text;
	for (const entry of map) {
		const regex = new RegExp("\\b" + escapeRegex(entry.phrase) + "\\b", "gi");
		result = result.replace(regex, entry.translation);
	}
	return result;
}

function translate(message, to) {
	if (to === "english") {
		return translateTo(message, furbishToEnglish);
	} else if (to === "furbish") {
		return translateTo(message, englishToFurbish);
	}
	return message;
}

function addCommunityEntry(furbish, english) {
	const entry = { furbish: furbish.toLowerCase(), english: english.toLowerCase() };
	communityDict.push(entry);
	fs.writeFileSync(communityDictPath, JSON.stringify(communityDict, null, 2));
	const entries = mergeEntries();
	furbishToEnglish = buildFurbishToEnglish(entries);
	englishToFurbish = buildEnglishToFurbish(entries);
}

if (require.main === module) {
	const usage = `translate options [message]
  Options:
    -e  --english    Furbish to English
    -f  --furbish    English to Furbish
    -h  --help       Get usage information.`;

	let args = process.argv.slice(2);
	switch (args[0]) {
		case "--english":
		case "-e":
			args.shift();
			console.log(translate(args.join(" "), "english"));
			break;
		case "--furbish":
		case "-f":
			args.shift();
			console.log(translate(args.join(" "), "furbish"));
			break;
		case "--help":
		case "-h":
		default:
			console.log(usage);
			break;
	}
}

module.exports = { translate, addCommunityEntry };
