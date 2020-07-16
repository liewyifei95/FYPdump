const express = require("express");
const app = express();
var bodyParser = require("body-parser");
var mysql = require("mysql");
var Promise = require("es6-promise").Promise;

var cors = require("cors"); 
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'fypdb'
});

// set port
app.timeout = 0;
app.listen(process.env.PORT || 3000, function () {
  console.log("Node app is running on port 3000");
});

connection.connect(error => {
  if (error) {
    console.error(error);
  } else {
    console.log("Connected to Database");
  }
});

app.post("/login", (req, res) => {
  //for app login
  var matric = req.body.MatriculationNumber;
  var pass = req.body.Password;

  if (matric === 0) {
    res.json({
      Success: "False"
    })
  }else{

  var query =
    "SELECT PASS from LOGIN WHERE `MATRIC_NUMBER` =" + "'" + matric + "'";
  connection.query(query, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      var dbpass = result[0].PASS;
      console.log(result[0].PASS);

      if (pass == dbpass) {
        res.json({
          Success: "True"
        });
      } else {
        res.json({
          Success: "False"
        });
      }
    }
  });
  }
})

app.post("/skillsdisplay", (req, api_res) => {
  var matric = req.body.MatriculationNumber;

  var query1 =
    "SELECT COUNT(*) as value FROM EVENTS,EVENT_CALENDAR,ATTENDANCE_MASTERLIST,EVENT_ATT_MAP,ATTRIBUTE_DETAILS,ATTRIBUTE_MAPPING WHERE EVENT_CALENDAR.EVENT_UID = ATTENDANCE_MASTERLIST.EVENT_UID AND EVENTS.EVENT_ID = EVENT_CALENDAR.EVENT_ID AND EVENTS.EVENT_ID = EVENT_ATT_MAP.EVENT_ID AND ATTRIBUTE_DETAILS.ATT_ID = EVENT_ATT_MAP.ATT_ID AND ATTRIBUTE_DETAILS.ATT_ID = ATTRIBUTE_MAPPING.ATT_ID AND ATTRIBUTE_MAPPING.Att_Agg = 'Professional development' AND ATTENDANCE_MASTERLIST.MATRIC_NUMBER = '" +
    matric +
    "'";
  var query2 =
    "SELECT COUNT(*) as value FROM EVENTS,EVENT_CALENDAR,ATTENDANCE_MASTERLIST,EVENT_ATT_MAP,ATTRIBUTE_DETAILS,ATTRIBUTE_MAPPING WHERE EVENT_CALENDAR.EVENT_UID = ATTENDANCE_MASTERLIST.EVENT_UID AND EVENTS.EVENT_ID = EVENT_CALENDAR.EVENT_ID AND EVENTS.EVENT_ID = EVENT_ATT_MAP.EVENT_ID AND ATTRIBUTE_DETAILS.ATT_ID = EVENT_ATT_MAP.ATT_ID AND ATTRIBUTE_DETAILS.ATT_ID = ATTRIBUTE_MAPPING.ATT_ID AND ATTRIBUTE_MAPPING.Att_Agg = 'Personal development' AND ATTENDANCE_MASTERLIST.MATRIC_NUMBER = '" +
    matric +
    "'";
  var query3 =
    "SELECT COUNT(*) as value FROM EVENTS,EVENT_CALENDAR,ATTENDANCE_MASTERLIST,EVENT_ATT_MAP,ATTRIBUTE_DETAILS,ATTRIBUTE_MAPPING WHERE EVENT_CALENDAR.EVENT_UID = ATTENDANCE_MASTERLIST.EVENT_UID AND EVENTS.EVENT_ID = EVENT_CALENDAR.EVENT_ID AND EVENTS.EVENT_ID = EVENT_ATT_MAP.EVENT_ID AND ATTRIBUTE_DETAILS.ATT_ID = EVENT_ATT_MAP.ATT_ID AND ATTRIBUTE_DETAILS.ATT_ID = ATTRIBUTE_MAPPING.ATT_ID AND ATTRIBUTE_MAPPING.Att_Agg = 'Leadership' AND ATTENDANCE_MASTERLIST.MATRIC_NUMBER = '" +
    matric +
    "'";
  var query4 =
    "SELECT COUNT(*) as value FROM EVENTS,EVENT_CALENDAR,ATTENDANCE_MASTERLIST,EVENT_ATT_MAP,ATTRIBUTE_DETAILS,ATTRIBUTE_MAPPING WHERE EVENT_CALENDAR.EVENT_UID = ATTENDANCE_MASTERLIST.EVENT_UID AND EVENTS.EVENT_ID = EVENT_CALENDAR.EVENT_ID AND EVENTS.EVENT_ID = EVENT_ATT_MAP.EVENT_ID AND ATTRIBUTE_DETAILS.ATT_ID = EVENT_ATT_MAP.ATT_ID AND ATTRIBUTE_DETAILS.ATT_ID = ATTRIBUTE_MAPPING.ATT_ID AND ATTRIBUTE_MAPPING.Att_Agg = 'Technical' AND ATTENDANCE_MASTERLIST.MATRIC_NUMBER = '" +
    matric +
    "'";
  var query5 =
    "SELECT COUNT(*) as value FROM EVENTS,EVENT_CALENDAR,ATTENDANCE_MASTERLIST,EVENT_ATT_MAP,ATTRIBUTE_DETAILS,ATTRIBUTE_MAPPING WHERE EVENT_CALENDAR.EVENT_UID = ATTENDANCE_MASTERLIST.EVENT_UID AND EVENTS.EVENT_ID = EVENT_CALENDAR.EVENT_ID AND EVENTS.EVENT_ID = EVENT_ATT_MAP.EVENT_ID AND ATTRIBUTE_DETAILS.ATT_ID = EVENT_ATT_MAP.ATT_ID AND ATTRIBUTE_DETAILS.ATT_ID = ATTRIBUTE_MAPPING.ATT_ID AND ATTRIBUTE_MAPPING.Att_Agg = 'Innovation' AND ATTENDANCE_MASTERLIST.MATRIC_NUMBER = '" +
    matric +
    "'";

  const promise_prod = new Promise((resolve, reject) => {
    connection.query(query1, (err, res) => {
      if (err) throw err;
      var value = res[0].value;
      resolve(value);
    });
  });

  const promise_perd = new Promise((resolve, reject) => {
    connection.query(query2, (err, res) => {
      if (err) throw err;
      var value = res[0].value;
      resolve(value);
    });
  });

  const promise_ldr = new Promise((resolve, reject) => {
    connection.query(query3, (err, res) => {
      if (err) throw err;
      var value = res[0].value;
      resolve(value);
    });
  });

  const promise_tech = new Promise((resolve, reject) => {
    connection.query(query4, (err, res) => {
      if (err) throw err;
      var value = res[0].value;
      resolve(value);
    });
  });

  const promise_inno = new Promise((resolve, reject) => {
    connection.query(query5, (err, res) => {
      if (err) throw err;
      var value = res[0].value;
      resolve(value);
    });
  });

  Promise.all([
    promise_prod,
    promise_perd,
    promise_ldr,
    promise_inno,
    promise_tech
  ]).then(function (values) {

    api_res.send({
      Professional_Development: values[0],
      Innovation: values[1],
      Leadership: values[2],
      Personal_Development: values[3],
      Technical: values[4]
    });
  });
});

app.post("/viewhistory", (req, res) => {
  var matric = req.body.MatriculationNumber;

  var query =
    "SELECT EVENTS.EVENT_NAME,ATTENDANCE_MASTERLIST.EVENT_POSITION,DATE_FORMAT(EVENT_CALENDAR.START_DATE,'%d/%c/%Y') as START_DATE,DATE_FORMAT(EVENT_CALENDAR.END_DATE,'%d/%c/%Y') as END_DATE,YEAR(EVENT_CALENDAR.START_DATE) as YEAR FROM ATTENDANCE_MASTERLIST,EVENT_CALENDAR, EVENTS WHERE EVENT_CALENDAR.EVENT_UID = ATTENDANCE_MASTERLIST.EVENT_UID AND EVENTS.EVENT_ID = EVENT_CALENDAR.EVENT_ID AND ATTENDANCE_MASTERLIST.ATTENDANCE = 1 AND ATTENDANCE_MASTERLIST.MATRIC_NUMBER = '" +
    matric +
    "'";

  connection.query(query, function (err, result) {

    res.send(
      result);
  });
});

app.get("/displaypie", function (req, api_res) {
  var query1 = "SELECT COUNT(distinct event_uid) as value from EVENTS,EVENT_CALENDAR WHERE EVENTS.EVENT_ID = EVENT_CALENDAR.EVENT_ID AND EVENTS.HOST = 'Garage@EEE'";
  var query2 = "SELECT COUNT(distinct event_uid) as value from EVENTS,EVENT_CALENDAR WHERE EVENTS.EVENT_ID = EVENT_CALENDAR.EVENT_ID AND EVENTS.HOST = 'MLDA@EEE'";
  var query3 = "SELECT COUNT(distinct event_uid) as value from EVENTS,EVENT_CALENDAR WHERE EVENTS.EVENT_ID = EVENT_CALENDAR.EVENT_ID AND EVENTS.HOST = 'Student Life and Development Unit'";
  var query4 = "SELECT COUNT(distinct event_uid) as value from EVENTS,EVENT_CALENDAR WHERE EVENTS.EVENT_ID = EVENT_CALENDAR.EVENT_ID AND EVENTS.HOST = 'Career and Attachment Office'";
  var query5 = "SELECT COUNT(distinct event_uid) as value from EVENTS,EVENT_CALENDAR WHERE EVENTS.EVENT_ID = EVENT_CALENDAR.EVENT_ID AND EVENTS.HOST = 'EEE Club'";
  var query6 = "SELECT COUNT(distinct event_uid) as value from EVENTS,EVENT_CALENDAR WHERE EVENTS.EVENT_ID = EVENT_CALENDAR.EVENT_ID AND EVENTS.HOST = 'LEAD'";

  const promise_garage = new Promise((resolve, reject) => {
    connection.query(query1, (err, res) => {
      if (err) throw err;
      var value = res[0].value;
      resolve(value);
    });
  });

  const promise_mlda = new Promise((resolve, reject) => {
    connection.query(query2, (err, res) => {
      if (err) throw err;
      var value = res[0].value;
      resolve(value);
    });
  });

  const promise_sldu = new Promise((resolve, reject) => {
    connection.query(query3, (err, res) => {
      if (err) throw err;
      var value = res[0].value;
      resolve(value);
    });
  });

  const promise_cao = new Promise((resolve, reject) => {
    connection.query(query4, (err, res) => {
      if (err) throw err;
      var value = res[0].value;
      resolve(value);
    });
  });

  const promise_club = new Promise((resolve, reject) => {
    connection.query(query5, (err, res) => {
      if (err) throw err;
      var value = res[0].value;
      resolve(value);
    });
  });

  const promise_lead = new Promise((resolve, reject) => {
    connection.query(query6, (err, res) => {
      if (err) throw err;
      var value = res[0].value;
      resolve(value);
    });
  });

  Promise.all([
    promise_garage,
    promise_mlda,
    promise_sldu,
    promise_cao,
    promise_club,
    promise_lead
  ]).then(values => {
    api_res.send({
      "Garage": values[0],
      "MLDA": values[1],
      "SLDU": values[2],
      "CAO": values[3],
      "EEE_Club": values[4],
      "LEAD": values[5]
    });
  });
})


app.get("/displaytimeline", function (req, res) {
  var query = "SELECT EVENTS.EVENT_NAME, host as HOST, DATE_FORMAT(EVENT_CALENDAR.START_DATE,'%d/%c/%Y') as DATE FROM EVENTS,EVENT_CALENDAR WHERE EVENTS.EVENT_ID = EVENT_CALENDAR.EVENT_ID AND EVENT_CALENDAR.START_DATE > CURDATE() ORDER BY EVENT_CALENDAR.START_DATE ASC LIMIT 10;"
  //host
  connection.query(query, function (err, res2) {
    res.send(res2);
  });
});

app.get("/displaychart", function (req, api_res) {

  var queryprod = "select att_agg, count(distinct event_uid) as count from event_calendar, event_att_map, attribute_mapping where event_calendar.event_id = event_att_map.event_id and event_att_map.att_id = attribute_mapping.att_id and attribute_mapping.att_agg = 'professional development'";

  var queryperd = "select att_agg, count(distinct event_uid) as count from event_calendar, event_att_map, attribute_mapping where event_calendar.event_id = event_att_map.event_id and event_att_map.att_id = attribute_mapping.att_id and attribute_mapping.att_agg = 'personal development'";

  var queryldr = "select att_agg, count(distinct event_uid) as count from event_calendar, event_att_map, attribute_mapping where event_calendar.event_id = event_att_map.event_id and event_att_map.att_id = attribute_mapping.att_id and attribute_mapping.att_agg = 'leadership'";

  var querytech = "select att_agg, count(distinct event_uid) as count from event_calendar, event_att_map, attribute_mapping where event_calendar.event_id = event_att_map.event_id and event_att_map.att_id = attribute_mapping.att_id and attribute_mapping.att_agg = 'technical'";

  var queryinno = "select att_agg, count(distinct event_uid) as count from event_calendar, event_att_map, attribute_mapping where event_calendar.event_id = event_att_map.event_id and event_att_map.att_id = attribute_mapping.att_id and attribute_mapping.att_agg = 'innovation'";

  const promise_prod = new Promise((resolve, reject) => {
    connection.query(queryprod, (err, res) => {
      if (err) throw err;
      var value = res[0].count;
      resolve(value);
    });
  });

  const promise_perd = new Promise((resolve, reject) => {
    connection.query(queryperd, (err, res) => {
      if (err) throw err;
      var value = res[0].count;
      resolve(value);
    });
  });

  const promise_ldr = new Promise((resolve, reject) => {
    connection.query(queryldr, (err, res) => {
      if (err) throw err;
      var value = res[0].count;
      resolve(value);
    });
  });

  const promise_tech = new Promise((resolve, reject) => {
    connection.query(querytech, (err, res) => {
      if (err) throw err;
      var value = res[0].count;
      resolve(value);
    });
  });

  const promise_inno = new Promise((resolve, reject) => {
    connection.query(queryinno, (err, res) => {
      if (err) throw err;
      var value = res[0].count;
      resolve(value);
    });
  });

  Promise.all([
    promise_prod,
    promise_perd,
    promise_ldr,
    promise_tech,
    promise_inno,
  ]).then( values => {
    api_res.send({
      "Professional development": values[0],
      "Personal development": values[1],
      "Leadership": values[2],
      "Technical": values[3],
      "Innovation": values[4],
    });
  });

})


app.get("/displaybar", function (req, res) {
  var query = "call getpart()"
  connection.query(query, function (err, res2) {
    if (err) throw err;
    else res.send(res2[0]);
    // assume attendence for any given event > 1 else will result in empty row;
  })
})

app.post("/register", function (req, res) {
  var matric = req.body.matric;
  var eventuid = req.body.eventuid;
  var email = req.body.email;

  var queryverify =
    "SELECT NTU_EMAIL as value from STUDENT_MASTERLIST WHERE MATRIC_NUMBER = '" +
    matric +
    "'";

  async function register() {
    let promise1 = new Promise((resolve, reject) => {
      connection.query(queryverify, function (err, result) {
        if (result.length === 0) {
          resolve(false);
        }
        else {
          var emaildb = result[0].value;
          if (email == emaildb) {
            resolve(true);
          }
        }
      });
    });
    let result = await promise1;
    if (result == true) {
      var registerstudent =
        "INSERT INTO ATTENDANCE_MASTERLIST(EVENT_UID,MATRIC_NUMBER,EVENT_POSITION,ATTENDANCE,REGISTERTIME) VALUES ('" +
        eventuid +
        "','" +
        matric +
        "','Participant','0',NOW())";
      connection.query(registerstudent, function (err, result) {
        if (err) throw err;
        else {
          res.json({
            Success: "True"
          })
        }
      })
    } else if (result == false) {
      res.json({
        Success: "False"
      })
    }
  }

  register();

});

app.post("/attendance", function (req, res) {
  var qrvalue = req.body.qrvalue;
  var query = "UPDATE ATTENDANCE_MASTERLIST SET ATTENDANCE = 1,ATTENDANCETIME = NOW() WHERE concat(ATTENDANCE_MASTERLIST.EVENT_UID,ATTENDANCE_MASTERLIST.matric_number) = ?";
  connection.query(query, [qrvalue], function (err, result) {
    if (err) {
      res.send(err);
    } else {
      res.json({
        Success: "True"
      });
    }
  }
  );
})

app.get("/pasteventsdet", function (req, res) {
  var query = "SELECT fypdb.event_calendar.EVENT_UID, EVENT_NAME, host, start_date, end_date FROM fypdb.event_calendar, fypdb.events where fypdb.event_calendar.event_id = fypdb.events.EVENT_ID and start_date < now();"
  connection.query(query, function (err, res2) {
    if (err) throw err;
    else {
      var result = res2;
      res.send(result);
    }
  })
})

app.get("/futeventsdet", function (req, res) {
  var query = "SELECT fypdb.event_calendar.EVENT_UID, EVENT_NAME, host, start_date, end_date FROM fypdb.event_calendar, fypdb.events where fypdb.event_calendar.event_id = fypdb.events.EVENT_ID and start_date > now();"
  connection.query(query, function (err, res2) {
    if (err) throw err;
    else {
      var result = res2;
      res.send(result);
    }
  })
})

app.get("/eventnames", function (req, res) {
  var query = "SELECT EVENT_NAME FROM fypdb.event_calendar, fypdb.events where fypdb.event_calendar.event_id = fypdb.events.EVENT_ID and fypdb.event_calendar.start_date>now();"
  connection.query(query, function (err, res2) {
    if (err) throw err;
    else {
      var result = res2;
      res.send(result);
    }
  })
})

app.get("/test", function (req, res) {
  var testquery = "select count(distinct event_uid) as count from event_calendar, events where event_calendar.EVENT_ID = events.event_id and host = 'Student Life and Development Unit';";
  connection.query(testquery, function (err, res2) {
    var result = res2[0];
    console.log(result);
    res.send(result);
  })
})


