const glob = require("glob")
const fse = require('fs-extra')
const util = require('util');

const INSTRUMENTS = ['bass', 'sax', 'guitar', 'drums', 'keys', 'trumpet', 'trombone']

// Async/Await:
async function readConfig () {
  try {
    const setConfig = await fse.readJson('./whiteeagle.json')
    return setConfig;
  } catch (err) {
    console.error(err)
  }
}
const byInstrument = {};

INSTRUMENTS.forEach(i => {
  byInstrument[i] = [];
})

readConfig().then(c => {
  const songs = c.songs;
  songs.forEach((s, i) => {
    let flag = (i === songs.length - 1);
    glob(`Charts/**/*${s}*.pdf`, (e,files) => processInstruments(files, flag));
  });
})

function processInstruments(files, final) {
  INSTRUMENTS.forEach(i => {
    let re;
    switch(i){
    	case 'drums':
        re = /drums|drum/ig;
        break;
      case 'keys':
        re = /keys|key|piano/ig;
        break;
      case 'tenor':
        re = /tenor|sax/ig;
        break;
      case 'alto':
        re = /alto|sax/ig;
        break;
      default:
        re = new RegExp(i, 'ig');
    }
    const iFile = files.find(f => f.match(re));
    if(!iFile) {
      console.log(`Couldn't find ${i} for ${files}\n\n`);
    }
    byInstrument[i].push(iFile);
  });

  if (final) {
  	INSTRUMENTS.forEach(i => {
  		printPdfs(printFilenames(i, byInstrument[i]));
  	});
  }
}

function printFilenames(instrument, arr) {
  return instrument + '.pdf" "' + arr.join('" "');
}

function printPdfs(filenames) {
  const exec = util.promisify(require('child_process').exec);

   async function combine() {
    console.log(`ruby combine.rb "${filenames}"`);
    const { stdout, stderr } = await exec(`ruby combine.rb "${filenames}"`);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
  }
  combine();
}


// options is optional
//glob("**/*.js", options, function (er, files) {
  // files is an array of filenames.
  // If the `nonull` option is set, and nothing
  // was found, then files is ["**/*.js"]
  // er is an error object or null.
//})