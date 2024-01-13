const alphabet = "abcdefghijklmnopqrstuvwxyz"

var wordFreqMap = new Map()
wordFreqMap.set("be", 5);
wordFreqMap.set("i", 5);
wordFreqMap.set("you", 5);
wordFreqMap.set("the", 5);
wordFreqMap.set("a", 5);
wordFreqMap.set("to", 5);
wordFreqMap.set("it", 5);
wordFreqMap.set("not", 5);
wordFreqMap.set("yes", 5);
wordFreqMap.set("no", 5);
wordFreqMap.set("that", 5);
wordFreqMap.set("and", 5);

function commonWords() {
	var wordFreq = [];
	for (const [key, val] of wordFreqMap) {
		wordFreq.push({word: key, freq: val})
	}
	var n = wordFreq.length;
	if (n > 25) {
		n = 25;
	}
	wordFreq.sort((a, b) => {
		return a.word > b.word;
	});
	const words = [];
	for (const wf of wordFreq.slice(0, n)) {
		words.push(wf.word);
	}
	return words;
}

function split(items) {
	const i = items.length / 2;
	const left = items.slice(0, i);
	const right = items.slice(i, items.length);
	return [left, right];
}

class Choice {
	constructor(leftElement, rightElement) {
		this.isLetters = true;
		this.leftElement = leftElement;
		this.rightElement = rightElement;
		this.leftElement.addEventListener("click", event => this.chooseLeft());
		this.rightElement.addEventListener("click", event => this.chooseRight());
		this.leftItems = [];
		this.rightItems = [];
	}

	setItems(items, isLetters) {
		this.isLetters = isLetters;

		const [left, right] = split(items);
		this.leftItems = left;
		this.rightItems = right;

		var leftString = "";
		var sep = " ";
		if (!this.isLetters) {
			sep = "<br>";
		}
		for (const item of this.leftItems) {
			leftString += item + sep;
		}
		this.leftElement.innerHTML = leftString;

		var rightString = "";
		for (const item of this.rightItems) {
			rightString += item + sep;
		}
		this.rightElement.innerHTML = rightString;
	}

	chooseLeft() {
		if (this.leftItems.length == 1) {
			addText(this.leftItems[0], this.isLetters);
			resetChoices();
			return;
		}
		this.setItems(this.leftItems, this.isLetters);
	}

	chooseRight() {
		if (this.rightItems.length == 1) {
			addText(this.rightItems[0], this.isLetters);
			resetChoices();
			return;
		}
		this.setItems(this.rightItems, this.isLetters);
	}
}

const text = document.getElementById("text");
const back = document.getElementById("back");
const enter = document.getElementById("enter");

const topChoice = new Choice(
	document.getElementById("top-left"),
	document.getElementById("top-right"));

const botChoice = new Choice(
	document.getElementById("bot-left"),
	document.getElementById("bot-right"));

function resetChoices() {
	topChoice.setItems(alphabet, /*isLetters=*/ true);
	botChoice.setItems(commonWords(), /*isLetters=*/ false);
}

function addText(t, isLetter) {
	if (!isLetter) {
		t += " ";
	}
	text.innerHTML += t;
}

function clear() {
	const words = text.innerHTML.split(" ");
	for (const word of words) {
		if (word == "") {
			continue;
		}
		var n = wordFreqMap.get(word);
		if (n == null) {
			n = 0;
		}
		wordFreqMap.set(word, n + 1);
	}
	text.innerHTML = "";
	resetChoices();
}

function init() {
	text.innerHTML = "";
	resetChoices();
	text.addEventListener("click", event => clear());
	back.addEventListener("click", event => resetChoices());
	enter.addEventListener("click", event => {
		addText(" ");
		resetChoices();
	});
}

init();
