var express = require('express');
var router = express.Router();

var ejs = require('ejs');

var Idea = require('../models/idea');


/* GET home page. */
router.get('/', function(req, res, next) {
   res.render('index', { title: 'Express' });
});

/* Bubble Page, will be transferred to the home page eventually */
router.get('/bubbles', function(req, res, next) {
   res.render('bubbles');
});

router.get('/ideas', function(req, res, next){
  Idea.find(function(err, ideas){
    if (err) throw err;
    res.json(ideas);
  });
});

router.get('/newIdea', function(req, res, next){
  res.render('newIdea');
});

router.post('/newIdea/submit', function (req, res, next){
  var list = req.body.tagline.split(',');
  var newIdea = new Idea({
    name: req.body.name,
    description: req.body.description,
    tagline: list,
    claim: null
  });

  newIdea.save(function(err, newIdea){
    if (err) throw err;
    console.log("saved!");
    res.json("success");
  });
});

router.post('/addComment', function(req, res, next){
  console.log(req.body);
  var newComment = {
    commenter: req.body.name,
    text: req.body.comment
  };

  Idea.findOneAndUpdate({_id:req.body.idea}, {$addToSet:{comments:newComment}}, function(err){
    if(err) throw err;
    console.log("saved comment");
    res.status(500);
  });
});

///////////TEST ROUTE//////////
var article = "In communications and information processing, code is a system of rules to convert information—such as a letter, word, sound, image, or gesture—into"+
"another form or representation, sometimes shortened or secret, for communication through a channel or storage in a medium. An early example is the invention of language, which enabled a person, through speech, to communicate what he or she saw, heard, felt, or thought to others. But speech limits the range of communication to the distance a voice can carry, and limits the audience to those present when the speech is uttered. The invention of writing, which converted spoken language into visual symbols, extended the range of communication across space and time."+
"The process of encoding converts information from a source into symbols for communication or storage. Decoding is the reverse process, converting code symbols back into a form that the recipient understands."+
"One reason for coding is to enable communication in places where ordinary plain language, spoken or written, is difficult or impossible. For example, semaphore, where the configuration of flags held by a signaller or the arms of a semaphore tower encodes parts of the message, typically individual letters and numbers. Another person standing a great distance away can interpret the flags and reproduce the words sent."+
'A cable code replaces words (e.g., ship or invoice) with shorter words, allowing the same information to be sent with fewer characters, more quickly, and most importantly, less expensively. Codes can be used for brevity. When telegraph messages were the state of the art in rapid long distance communication, elaborate systems of commercial codes that encoded complete phrases into single mouths (commonly five-minute groups) were developed, so that telegraphers became conversant with such "words" as BYOXO ("Are you trying to weasel out of our deal?"), LIOUY ("Why do you not answer my question?"), BMULD ("Youre a skunk!"), or AYYLU ("Not clearly coded, repeat more clearly."). Code words were chosen for various reasons: length, pronounceability, etc. Meanings were chosen to fit perceived needs: commercial negotiations, military terms for military codes, diplomatic terms for diplomatic codes, any and all of the preceding for espionage codes. Codebooks and codebook publishers proliferated, including one run as a front for the American Black Chamber run by Herbert Yardley between the First and Second World Wars. The purpose of most of these codes was to save on cable costs. The use of data coding for data compression predates the computer era; an early example is the telegraph Morse code where more-frequently used characters have shorter representations. Techniques such as Huffman coding are now used by computer-based algorithms to compress large data files into a more compact form for storage or transmission.'+
'Computer programming (often shortened to programming) is a process that leads from an original formulation of a computing problem to executable computer programs. Programming involves activities such as analysis, developing understanding, generating algorithms, verification of requirements of algorithms including their correctness and resources consumption, and implementation (commonly referred to as coding[1][2]) of algorithms in a target programming language. Source code is written in one or more programming languages. The purpose of programming is to find a sequence of instructions that will automate performing a specific task or solving a given problem. The process of programming thus often requires expertise in many different subjects, including knowledge of the application domain, specialized algorithms and formal logic. Related tasks include testing, debugging, and maintaining the source code, implementation of the build system, and management of derived artifacts such as machine code of computer programs. These might be considered part of the programming process, but often the term software development is used for this larger process with the term programming, implementation, or coding reserved for the actual writing of source code. Software engineering combines engineering techniques with software development practices.'+
'Within software engineering, programming (the implementation) is regarded as one phase in a software development process. There is an ongoing debate on the extent to which the writing of programs is an art form, a craft, or an engineering discipline.[3] In general, good programming is considered to be the measured application of all three, with the goal of producing an efficient and evolvable software solution (the criteria for "efficient" and "evolvable" vary considerably). The discipline differs from many other technical professions in that programmers, in general, do not need to be licensed or pass any standardized (or governmentally regulated) certification tests in order to call themselves "programmers" or even "software engineers." Because the discipline covers many areas, which may or may not include critical applications, it is debatable whether licensing is required for the profession as a whole. In most cases, the discipline is self-governed by the entities which require the programming, and sometimes very strict environments are defined (e.g. United States Air Force use of AdaCore and security clearance). However, representing oneself as a "professional software engineer" without a license from an accredited institution is illegal in many parts of the world. Another ongoing debate is the extent to which the programming language used in writing computer programs affects the form that the final program takes.[citation needed] This debate is analogous to that surrounding the Sapir–Whorf hypothesis[4] in linguistics and cognitive science, which postulates that a particular spoken language\'s nature influences the habitual thought of its speakers. Different language patterns yield different patterns of thought. This idea challenges the possibility of representing the world perfectly with language, because it acknowledges that the mechanisms of any language condition the thoughts of its speaker community.'+
'Ancient cultures seemed to have no conception of computing beyond arithmetic, algebra, and geometry, occasionally devising computational systems with elements of calculus (e.g. the method of exhaustion). The only mechanical device that existed for numerical computation at the beginning of human history was the abacus, invented in Sumeria circa 2500 BC. Later, the Antikythera mechanism, invented some time around 100 BC in ancient Greece, is the first known mechanical calculator utilizing gears of various sizes and configuration to perform calculations,[5] which tracked the metonic cycle still used in lunar-to-solar calendars, and which is consistent for calculating the dates of the Olympiads.[6] The Kurdish medieval scientist Al-Jazari built programmable automata in 1206 AD. One system employed in these devices was the use of pegs and cams placed into a wooden drum at specific locations, which would sequentially trigger levers that in turn operated percussion instruments. The output of this device was a small drummer playing various rhythms and drum patterns.[7] The Jacquard loom, which Joseph Marie Jacquard developed in 1801, uses a series of pasteboard cards with holes punched in them. The hole pattern represented the pattern that the loom had to follow in weaving cloth. The loom could produce entirely different weaves using different sets of cards. Charles Babbage adopted the use of punched cards around 1830 to control his Analytical Engine. Mathematician Ada Lovelace, a friend of Babbage, between 1842 and 1843 translated an article by Italian military engineer Luigi Menabrea on the engine,[8] which she supplemented with a set of notes, simply called Notes. These notes include an algorithm to calculate a sequence of Bernoulli numbers,[9] intended to be carried out by a machine. Despite controversy over scope of her contribution, many consider this algorithm to be the first computer program.[8]'+
'In the 1880s, Herman Hollerith invented the recording of data on a medium that could then be read by a machine. Prior uses of machine readable media, above, had been for lists of instructions (not data) to drive programmed machines such as Jacquard looms and mechanized musical instruments. "After some initial trials with paper tape, he settled on punched cards..."[10] To process these punched cards, first known as "Hollerith cards" he invented the keypunch, sorter, and tabulator unit record machines.[11] These inventions were the foundation of the data processing industry. In 1896 he founded the Tabulating Machine Company (which later became the core of IBM). The addition of a control panel (plugboard) to his 1906 Type I Tabulator allowed it to do different jobs without having to be physically rebuilt. By the late 1940s, there were several unit record calculators, such as the IBM 602 and IBM 604, whose control panels specified a sequence (list) of operations and thus were programmable machines. The invention of the von Neumann architecture allowed computer programs to be stored in computer memory. Early programs had to be painstakingly crafted using the instructions (elementary operations) of the particular machine, often in binary notation. Every model of computer would likely use different instructions (machine language) to do the same task. Later, assembly languages were developed that let the programmer specify each instruction in a text format, entering abbreviations for each operation code instead of a number and specifying addresses in symbolic form (e.g., ADD X, TOTAL). Entering a program in assembly language is usually more convenient, faster, and less prone to human error than using machine language, but because an assembly language is little more than a different notation for a machine language, any two machines with different instruction sets also have different assembly languages.'+
'The synthesis of numerical calculation, predetermined operation and output, along with a way to organize and input instructions in a manner relatively easy for humans to conceive and produce, led to the modern development of computer programming. In 1954, FORTRAN was invented; it was the first widely used high level programming language to have a functional implementation, as opposed to just a design on paper.[12][13] (A high-level language is, in very general terms, any programming language that allows the programmer to write programs in terms that are more abstract than assembly language instructions, i.e. at a level of abstraction "higher" than that of an assembly language.) It allowed programmers to specify calculations by entering a formula directly (e.g. Y = X*2 + 5*X + 9). The program text, or source, is converted into machine instructions using a special program called a compiler, which translates the FORTRAN program into machine language. In fact, the name FORTRAN stands for "Formula Translation". Many other languages were developed, including some for commercial programming, such as COBOL. Programs were mostly still entered using punched cards or paper tape. (See computer programming in the punch card era). By the late 1960s, data storage devices and computer terminals became inexpensive enough that programs could be created by typing directly into the computers. Text editors were developed that allowed changes and corrections to be made much more easily than with punched cards. (Usually, an error in punching a card meant that the card had to be discarded and a new one punched to replace it.) As time has progressed, computers have made giant leaps in processing power, which have allowed the development of programming languages that are more abstracted from the underlying hardware. Popular programming languages of the modern era include ActionScript, C, C++, C#, Haskell, Java, JavaScript, Objective-C, Perl, PHP, Python, Ruby, Smalltalk, SQL, Visual Basic, and dozens more.[14] Although these high-level languages usually incur greater overhead, the increase in speed of modern computers has made the use of these languages much more practical than in the past. These increasingly abstracted languages are typically easier to learn and allow the programmer to develop applications much more efficiently and with less source code. However, high-level languages are still impractical for a few programs, such as those where low-level hardware control is necessary or where maximum processing speed is vital. Computer programming has become a popular career in the developed world, particularly in the United States, Europe, and Japan. Due to the high labor cost of programmers in these countries, some forms of programming have been increasingly subject to outsourcing (importing software and services from other countries, usually at a lower wage), making programming career decisions in developed countries more complicated, while increasing economic opportunities for programmers in less developed areas, particularly China and India.'

var fakeFullNames = ["Susan Mirsky","Yael Stevens","Mariann Riviera","Elizebeth Topping","Illa Kendricks","Charissa Greenhill","Ninfa Ruhl","Soon Gauer","Dori Bengtson","Ula Peart","Lamar Heidecker",
"Kendal Feltman","Claudine Ormsby","Vesta Vangundy","Cyrus Stjames","Trenton Farrel","Dotty Best","Kanisha Prins","Evelynn Charest","Milford Darwin","Deidra Gertner","Theresa Monnier","Lizette Parke",
"Etsuko Schomer","Greta Oliver","Mayme Cleaver","Marti Coller","Donette Kutcher","Eleonore Cornelison","Delilah Hubert","Milagro Mccool","Ginger Mcgreevy","Adolph Smead","Merrie Siegal","Adrienne Duffel",
"Reta Wyckoff","Althea Shuler","Cicely Deloera","Marg Wark","Everette Granda","Carmelita Wallace","Bridgett Latshaw","Larraine Purdue","Joette Speights","Evangeline Damon","Synthia Distefano","Andreas Ellwood",
"Hui Maitland","Cristopher Hamed","Syreeta Locust","Darrin Flores","Tyrone Poteete","Lacy Datta","Loan Lucey","Laverne Chidester","Freeman Hebel","Jacque Averill","Ethan Piercy","Buffy Mcnickle",
"Ush, Sorkin","Leanne Plunk","Fidel Zucco","Elia Jeffries","Dong Heckart","Eleonore Goranson","Beverley Abbot","Emil Ashcraft","Demarcus Bacon","Pia Pixler","Fe Weathersby","Ella Euell","Tanja Gurley",
"Adelaida Bo,land","Abraham Broxton","Roxana Michelson","Sheryll Zeller","Lyndsay Vinci","Darin Amor","Sana Wheeling","Arlena Jolly","Christie Stripling","Freddy Crouse","Jonelle Nesbit","Tammy Exline",
"Melda Goldner","Lynette Demoss","Christene Patz","Deneen Lauterbach","Jettie Easley","Celesta Keiser","Shira Begaye","Treva Jan","Bonny Vassell","Francie Timms","Janyce Maglio",
"Dianne Monti","Jeffry Cuellar","Antonietta Plumadore","Jospeh Soukup","Barbra Sipes"]

var fakeTagsString = "4thDimension/4D ABAP ABC ActionScript Ada Agilent VEE Algol Alice Angelscript Apex APL AppleScript Arc Arduino ASP AspectJ Assembly ATLAS Augeas AutoHotkey AutoIt"+
"AutoLISP \
Automator \
Avenue \
Awk \
Bash \
visualBasic \
bc \
BCPL \
BETA \
BlitzMax \
Boo \
BourneShell \
Bro \
C \
C# \
C++ \
C++/CLI \
C-Omega \
Caml \
Ceylon \
CFML \
cg \
Ch \
CHILL \
CIL \
CL \
Clarion \
Clean \
Clipper \
Clojure \
CLU \
COBOL \
Cobra \
CoffeeScript \
ColdFusion \
COMAL \
CommonLisp \
Coq \
cT \
Curl \
D \
Dart \
DCL \
DiBOL \
Dylan \
E \
eC \
Ecl \
ECMAScript \
EGL \
Eiffel \
Elixir \
Emacs \
Erlang \
Etoys \
Euphoria \
EXEC \
F# \
Factor \
Falcon \
Fancy \
Fantom \
Felix \
Forth \
Fortran \
Fortress \
FoxPro \
Gambas \
GNUOctave \
Go \
GoogleAppsScript \
Gosu \
Groovy \
Haskell \
haXe \
Heron \
HPL \
HyperTalk \
Icon \
IDL \
Inform \
Informix-4GL \
INTERCAL \
Io \
Ioke \
J \
J# \
JADE \
Java \
JavaScript \
JScript \
JScript.NET \
Julia \
KornShell \
Kotlin \
LabVIEW \
LadderLogic \
Lasso \
Limbo \
Lingo \
Lisp \
Logo \
Logtalk \
LotusScript \
LPC \
Lua \
Lustre \
M4 \
MAD \
Magic \
Magik \
Malbolge \
MANTIS \
Maple \
Mathematica \
MATLAB \
Max/MSP \
MAXScript \
MEL \
Mercury \
Mirah \
Miva \
ML \
Monkey \
Modula-2 \
Modula-3 \
MOO \
Moto \
MS-DOSBatch \
MUMPS \
NATURAL \
Nemerle \
Nimrod \
NQC \
NSIS \
Nu \
NXT-G \
Oberon \
ObjectRexx \
Objective-C \
Objective-J \
OCaml \
Occam \
ooc \
Opa \
OpenCL \
OpenEdgeABL \
OPL \
Oz \
Paradox \
Parrot \
Pascal \
Perl \
PHP \
Pike \
PILOT \
PL/I \
PL/SQL \
Pliant \
PostScript \
POV-Ray \
PowerBasic \
PowerScript \
PowerShell \
Processing \
Prolog \
Puppet \
PureData \
Python \
Q \
R \
Racket \
REALBasic \
REBOL \
Revolution \
REXX \
RPG \
Ruby \
Rust \
S \
S-PLUS \
SAS \
Sather \
Scala \
Scheme \
Scilab \
Scratch \
sed \
Seed7 \
Self \
Shell \
SIGNAL \
Simula \
Simulink \
Slate \
Smalltalk \
Smarty \
SPARK \
SPSS \
SQR \
Squeak \
Squirrel \
StandardML \
Suneido \
SuperCollider \
TACL \
Tcl \
Tex \
thinBasic \
TOM \
Transact-SQL \
Turing \
TypeScript \
Vala/Genie \
VBScript \
Verilog \
VHDL \
VimL \
WebDNA \
Whitespace \
X10 \
xBase \
XBase++ \
Xen \
XPL \
XSLT \
XQuery \
yacc \
Yorick \
Zshell";

var articleArr = article.split(" ");
var fakeComments = ["Great Job!","Cool","I don't like it","Nice job!","Seems like it would be helpful","I like it!","I look forward to seeing this work"];
var fakeTags = fakeTagsString.split(" ");
var fakeCreators = fakeFullNames.map(function(name) {
  var firstName = name.split(" ")[0],
      lastName = name.split(" ")[1];
  return (firstName+"."+lastName)
});

var fakeNames = fakeFullNames.map(function(name) {

})
router.get('/testIdea', function(req, res, next) {
  for (var i = 0; i < 100; i++) {
    var startNameIndex = Math.floor(Math.random()*articleArr.length)
    var testName = articleArr.slice(startNameIndex,startNameIndex + 4);
    testName[0] = testName[0].substr(0,1).toUpperCase() + testName[0].substr(1,testName[0].length);
    testName = testName.join(" ");
    var startTagIndex = Math.floor(Math.random()*fakeTags.length);
    var startLikeIndex = Math.floor(Math.random()*fakeCreators.length);
    var startTLineIndex = Math.floor(Math.random()*(articleArr.length - 10));
    var startDescIndex = Math.floor(Math.random()*(articleArr.length));
    console.log(startDescIndex);
    var fakeLikers = new Array(Math.floor(Math.random() * 1000));
    fakeLikers.map(function(x,i) {
      return i;
    })
    var testComments = new Array(Math.floor(Math.random() * 100));
    var testTagLine = articleArr.slice(startTLineIndex,startTLineIndex+8);
    testTagLine[0] = testTagLine[0].substr(0,1).toUpperCase() + testTagLine[0].substr(1,testTagLine[0].length);
    testTagLine = testTagLine.join(" ");
    for (var j = 0; j < testComments.length; j++) {
      var newComment = {
        commenter: fakeCreators[Math.floor(Math.random() * fakeCreators.length)],
        text: fakeComments[Math.floor(Math.random() * fakeComments.length)]
      }
      testComments[j] = newComment;
    }
    var newIdea = new Idea({
      name: testName,
      creator: fakeCreators[i],
      description: articleArr.slice(startDescIndex, startDescIndex+100).join(" "),
      tagline: testTagLine,
      tags: fakeTags.slice(startTagIndex,startTagIndex+Math.ceil(Math.random()*5)),
      likers: fakeLikers,
      comments: testComments,
      claim: ""
    });

    newIdea.save(function(err, idea){
      if (err) throw err;
      console.log("saved!");
    });
  }
});

module.exports = router;
