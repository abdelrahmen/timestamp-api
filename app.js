import  express  from "express";
import moment from 'moment';
import path from 'path'
import cors from "cors";

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let app = express();

app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

app.use(express.static("public"));

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname,'views','index.html'))
})

app.get("/api/:daterequested", function(req, res) {
    let dateRequested = req.params.daterequested;
    let date;
    
    // check if the date requested is a Unix timestamp
    if (!isNaN(dateRequested)) {
      date = moment(Number(dateRequested));
    } else {
      // use moment.js to parse the date
      date = moment(dateRequested, [
        'YYYY-MM-DD',
        'DD-MM-YYYY',
        'MM-DD-YYYY',
        'YYYY/MM/DD',
        'DD/MM/YYYY',
        'MM/DD/YYYY',
        'MMMM D, YYYY',
        'MMM D, YYYY',
        'M/D/YYYY'
      ]);
    }
    
    // check if the parsed date is valid
    if (!date.isValid()) {
      res.json({ error: "Invalid Date" });
      return;
    }
    
    // create an object with all possible date formats
    let formats = {
      unix: Math.floor(date.valueOf()),
      utc: date.toDate().toUTCString(),
      'YYYY-MM-DD': date.format('YYYY-MM-DD'),
      'DD-MM-YYYY': date.format('DD-MM-YYYY'),
      'MM-DD-YYYY': date.format('MM-DD-YYYY'),
      'YYYY/MM/DD': date.format('YYYY/MM/DD'),
      'DD/MM/YYYY': date.format('DD/MM/YYYY'),
      'MM/DD/YYYY': date.format('MM/DD/YYYY'),
      'MMMM D, YYYY': date.format('MMMM D, YYYY'),
      'MMM D, YYYY': date.format('MMM D, YYYY'),
      'M/D/YYYY': date.format('M/D/YYYY')
    };
    
    res.json(formats);
  });
  

app.get("/api/", function (req, res) {
  let date = new Date();

  // create an object with all possible date formats
  let formats = {
    unix: Math.floor(date.getTime()),
    utc: date.toUTCString(),
    "YYYY-MM-DD": moment(date).format("YYYY-MM-DD"),
    "DD-MM-YYYY": moment(date).format("DD-MM-YYYY"),
    "MM-DD-YYYY": moment(date).format("MM-DD-YYYY"),
    "YYYY/MM/DD": moment(date).format("YYYY/MM/DD"),
    "DD/MM/YYYY": moment(date).format("DD/MM/YYYY"),
    "MM/DD/YYYY": moment(date).format("MM/DD/YYYY"),
    "MMMM D, YYYY": moment(date).format("MMMM D, YYYY"),
    "MMM D, YYYY": moment(date).format("MMM D, YYYY"),
    "M/D/YYYY": moment(date).format("M/D/YYYY"),
  };

  res.json(formats);
});

// listen for requests :)
let PORT = 3000 || process.env.PORT;
let listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
