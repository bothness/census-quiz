// set constants
const dataurl = './data/data.csv';
const qtotal = 10; // number of questions
const qnames = {
  'badHealthHi': 'High population in bad health',
  'badHealthLo': 'Low population in bad health',
  'goodHeathHi': 'High population in good health',
  'goodHeathLo': 'Low population in good health',
  'ownershipHi': 'High home ownership',
  'ownershipLo': 'Low home ownership',
  'rentingHi': 'High renting population',
  'rentingLo': 'Low renting population',
  'youngHi': 'High population aged 0 to 15',
  'youngLo': 'Low population aged 0 to 15',
  'oldHi': 'High population aged 65 and over',
  'oldLo': 'Low population aged 65 and over',
  'christianHi': 'High Christian population',
  'christianLo': 'Low Christian population',
  'aethiestHo': 'High population with no religion',
  'aethiestLo': 'Low population with no religion',
  'asianHi': 'High Asian/Asian British population',
  'asianLo': 'Low Asian/Asian British population',
  'blackHi': 'High Black/African/Caribbean population',
  'blackLo': 'Low Black/African/Caribbean population',
  'whiteHi': 'High White population',
  'whiteLo': 'Low White population'
}

// get DOM elements
const qdiv = document.getElementById('question');
const adiv = document.getElementById('answers');
const scorespan = document.getElementById('score');
const totalspan = document.getElementById('total');

// set game variables
var data = {};
var lanm = {};
var latf = {};
var topics = [];
var question = {};
var qnumber = 1;
var qcorrect = 0;

// Function to turn CSV (string) into array of objects
function tsv2json(string) {
  let json = [];
  string = string.replace(/['"]+/g, '');
  let array = string.split('\n');
  let headers = array[0].split('\t');
  for (var i = 1; i < array.length - 1; i++) {
    let data = array[i].split('\t');
    let obj = {};
    for (var j = 0; j < data.length; j++) {
      obj[headers[j].trim()] = data[j].trim();
    }
    json.push(obj);
  }
  return json;
}

// Function to get LA names from the data
function getLAs(data) {
  let obj = {};
  for (i in data) {
    obj[data[i]['code']] = data[i]['name'];
  }
  return obj;
}

// Function to get true/false values from the data
function getTF(data) {
  let obj = {};
  for (i in data) {
    let lacode = data[i]['code'];
    let ladata = Object.assign({}, data[i]);
    delete ladata['code'];
    delete ladata['name'];
    obj[lacode] = ladata;
  }
  return obj;
}

// Function to get the topics
function getTopics(data) {
  let qkeys = Object.keys(data[0])
  qkeys.shift();
  qkeys.shift();
  return qkeys;
}

// Function to select a item from an array
function getItem(items) {
  var item = items[Math.floor(Math.random() * topics.length)];
  return item;
}

// Function to return a valid question
function makeQuestion(latf, topics) {

  // Get 3 unique topics
  let qtopics = [];
  while (qtopics.length < 3) {
    let qtopic = getItem(topics);
    if (!qtopics.includes(qtopic)) {
      qtopics.push(qtopic);
    }
  }

  // Get all places where only topic 1 is true
  let plist = [];
  for (i in latf) {
    if (latf[i][qtopics[0]] == 'true' && latf[i][qtopics[1]] == 'false' && latf[i][qtopics[2]] == 'false') {
      plist.push(i);
    }
  }

  // Get 3 random places from list
  let qplaces = [];
  while (qplaces.length < 3) {
    let place = getItem(plist);
    if (!qplaces.includes(place)) {
      qplaces.push(place);
    }
  }
  console.log(qtopics);
  console.log(qplaces);

  question = {
    'places': qplaces,
    'answers': {}
  }

  question['answers'][qtopics[0]] = true;
  question['answers'][qtopics[1]] = false;
  question['answers'][qtopics[2]] = false;

  renderQuestion(question);
}

function renderQuestion(question) {
  let qtext = qnumber + ". What do " + lanm[question['places'][0]] + ", " + lanm[question['places'][1]] + " and " + lanm[question['places'][2]] + " have in common?";
  let anskeys = Object.keys(question.answers);
  let ans1 = '<p><button class="btn btn-light" onclick="checkAnswer(question, \'' + anskeys[0] + '\', \'' + anskeys[0] + '\')">' + qnames[anskeys[0]] + '</button></p>';
  let ans2 = '<p><button class="btn btn-light" onclick="checkAnswer(question, \'' + anskeys[0] + '\', \'' + anskeys[1] + '\')">' + qnames[anskeys[1]] + '</button></p>';
  let ans3 = '<p><button class="btn btn-light" onclick="checkAnswer(question, \'' + anskeys[0] + '\', \'' + anskeys[2] + '\')">' + qnames[anskeys[2]] + '</button></p>';
  qdiv.innerHTML = qtext;
  adiv.innerHTML = ans1 + ans2 + ans3;
}

function checkAnswer(question, correct, response) {
  let atext = '';
  if (question['answers'][response] == true) {
    qcorrect += 1;
    scorespan.innerText = qcorrect;
    atext = '<span class="text-success">Correct! ' + qnames[correct] + '.</span>';
  } else {
    atext = '<span class="text-danger">Wrong! ' + qnames[correct] + '.</span>';
  }
  totalspan.innerText = qnumber;
  qnumber += 1;
  qdiv.innerHTML = atext;
  if (qnumber <= qtotal) {
    adiv.innerHTML = '<button class="btn btn-info" onclick="makeQuestion(latf, topics)">Next question...</button></div>';
  } else {
    adiv.innerHTML = '<button class="btn btn-info" onclick="makeRating(qcorrect)">How did I do?</button></div>';
  }
}

function makeRating(qcorrect) {
  let rating = '';
  if (qcorrect == 10) {
    rating = "Perfect. Amazing job!"
  } else if (qcorrect >= 7) {
    rating = "Great job!"
  } else if (qcorrect >= 4) {
    rating = "Not bad!"
  } else if (qcorrect >= 1) {
    rating = "Oof. You need to try harder next time!"
  } else {
    rating = "Awful! You didn't get a single answer right!"
  }
  qdiv.innerHTML = rating;
  adiv.innerHTML = '<button class="btn btn-info" onclick="restartQuiz()">Try again...</button></div>';
}

function restartQuiz() {
  qnumber = 1;
  qcorrect = 0;
  scorespan.innerText = 0;
  totalspan.innerText = 0;
  makeQuestion(latf, topics);
}

// Function to load questions data
function loadData() {
  fetch(dataurl)
      .then((response) => {
        return response.text();
      })
      .then((tsvdata) => {
        data = tsv2json(tsvdata);
        return data;
      })
      .then((data) => {
        lanm = getLAs(data);
        latf = getTF(data);
        topics = getTopics(data);
        return true;
      });
}

loadData();