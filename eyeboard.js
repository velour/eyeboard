class Choice {
	constructor(leftElement, rightElement) {
		this.isLetters = true;
		this.leftElement = leftElement;
		this.rightElement = rightElement;
		this.leftElement.addEventListener("click", event => this.choose(this.leftItems));
		this.rightElement.addEventListener("click", event => this.choose(this.rightItems));
		this.leftItems = [];
		this.rightItems = [];
	}

	setItems(items, isLetters) {
		if (isLetters) {
			this.leftElement.classList.remove("words");
			this.rightElement.classList.remove("words");
			this.leftElement.classList.add("letters");
			this.rightElement.classList.add("letters");
		} else {
			this.leftElement.classList.remove("letters");
			this.rightElement.classList.remove("letters");
			this.leftElement.classList.add("words");
			this.rightElement.classList.add("words");
		}
		this.isLetters = isLetters;
		var sep = " ";
		if (!this.isLetters) {
			sep = "<br>";
		}

		const i = items.length / 2;
		this.leftItems = items.slice(0, i);
		var leftString = "";
		for (const item of this.leftItems) {
			leftString += item + sep;
		}
		this.leftElement.innerHTML = leftString;

		this.rightItems = items.slice(i, items.length);
		var rightString = "";
		for (const item of this.rightItems) {
			rightString += item + sep;
		}
		this.rightElement.innerHTML = rightString;
	}

	choose(items) {
		save();
		if (items.length == 1) {
			addText(items[0], this.isLetters);
			resetChoices();
			return;
		}
		this.setItems(items, this.isLetters);
	}

	state() {
		return {
			items: this.leftItems.concat(this.rightItems),
			isLetters: this.isLetters,
		};
	}

	restore(s) {
		this.setItems(s.items, s.isLetters);
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

var history = [];

const alphabet = "abcdefghijklmnopqrstuvwxyz";

var wordFreqMap = new Map();
wordFreqMap.set("be", 5);
wordFreqMap.set("i", 5);
wordFreqMap.set("you", 5);
wordFreqMap.set("the", 5);
wordFreqMap.set("a", 5);
wordFreqMap.set("to", 5);
wordFreqMap.set("it", 5);
wordFreqMap.set("not", 5);
wordFreqMap.set("yes", 10000);
wordFreqMap.set("no", 10000);
wordFreqMap.set("that", 5);
wordFreqMap.set("and", 5);

function currentWord() {
	const i = text.innerHTML.lastIndexOf(" ") + 1;
	return text.innerHTML.slice(i, text.innerHTML.length);
}

function commonWords() {
	var wordFreq = [];
	const cur = currentWord();
	for (const [word, freq] of wordFreqMap) {
		if (word.startsWith(cur)) {
			wordFreq.push({word: word, freq: freq})
		}
	}
	wordFreq.sort((a, b) => {
		if (a.freq == b.freq) {
			return a.word > b.word;
		}
		return a.freq < b.freq;
	});
	var n = wordFreq.length;
	if (n > 10) {
		n = 10;
	}
	wordFreq = wordFreq.slice(0, n);

	wordFreq.sort((a, b) => {
		return a.word > b.word;
	});
	const words = [];
	for (const wf of wordFreq) {
		words.push(wf.word);
	}
	return words;
}

function resetChoices() {
	topChoice.setItems(alphabet, /*isLetters=*/ true);
	botChoice.setItems(commonWords(), /*isLetters=*/ false);
}

function addText(t, isLetter) {
	if (!isLetter) {
		t = t.slice(currentWord().length) + " ";
	}
	text.innerHTML += t;
}

function save() {
	history.push({
		topChoice: topChoice.state(),
		botChoice: botChoice.state(),
		text: text.innerHTML,
	});
	back.classList.remove("unavailable");
	back.classList.add("available");
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
	history = [];
	back.classList.remove("available");
	back.classList.add("unavailable");
}

function init() {
	clear();
	text.addEventListener("click", event => {
		clear();
	});
	back.addEventListener("click", event => {
		if (history.length == 0) {
			return;
		}
		const prev = history.pop();
		topChoice.restore(prev.topChoice);
		botChoice.restore(prev.botChoice);
		text.innerHTML = prev.text;
		if (history.length == 0) {
			back.classList.remove("available");
			back.classList.add("unavailable");
		}
	});
	enter.addEventListener("click", event => {
		save();
		addText(" ");
		resetChoices();
	});
}

init();
