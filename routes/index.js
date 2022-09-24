var express = require('express');
var router = express.Router();
require("dotenv").config();
const Window = require('window');
const { post } = require('jquery');
const { DateTime } = require("luxon");
//Necessary for google Calendar
const {google} = require('googleapis');
//Necessary for contact form
const cors = require("cors");
const nodemailer = require("nodemailer");
const multiparty = require("multiparty");
//Necessary for Tumblr
const tumblr = require('tumblr.js');

//Connnect to outlook via nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com", //replace with your email provider
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false
  },
});

//Verify connection configuration of nodemailer
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

//Connect to google Calendar
// Provide the required configuration
function events(req,res,next){
const GREDENTIALS = JSON.parse(process.env.GREDENTIALS);
const calendarId = process.env.CALENDAR_ID;

// Google calendar API settings
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({version : "v3"});

const auth = new google.auth.JWT(
    GREDENTIALS.client_email,
    null,
    GREDENTIALS.private_key,
    SCOPES
);

// Your TIMEOFFSET Offset
const TIMEOFFSET = '+05:30';

// Get date-time string for calender
const dateTimeForCalander = () => {

    let date = new Date();

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    let day = date.getDate();
    if (day < 10) {
        day = `0${day}`;
    }
    let hour = date.getHours();
    if (hour < 10) {
        hour = `0${hour}`;
    }
    let minute = date.getMinutes();
    if (minute < 10) {
        minute = `0${minute}`;
    }

    let newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000${TIMEOFFSET}`;

    let event = new Date(Date.parse(newDateTime));

    let startDate = event;
    // Delay in end time is 1
    let endDate = new Date(new Date(startDate).setHours(startDate.getHours()+1));

    return {
        'start': startDate,
        'end': endDate
    }
};
// Get all the events between two dates
let getEvents = async (dateTimeStart, dateTimeEnd)=>{
  try {
    let response = await calendar.events.list({
        auth: auth,
        calendarId: calendarId,
        timeMin: dateTimeStart,
        timeMax: dateTimeEnd,
        timeZone: 'Asia/Kolkata'
    });
    let data = response['data'];
    let items = response['data']['items'];
    let titleOfCalendar=data.summary;
    res.locals.titleOfCalendar=titleOfCalendar;
    next();
} catch (error) {
    console.log(`Error at getEvents --> ${error}`);
    return 0;
}
};
 
  let start = '2020-10-03T00:00:00.000Z';
  let end = '2022-10-04T00:00:00.000Z';
  
  getEvents(start, end)
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    });
  }

//Connect to tumblr.js
const tumblrClient = tumblr.createClient({
  credentials:{consumer_key: process.env.TCK2,
  consumer_secret: process.env.TCS2,
  token: process.env.TT2,
  token_secret: process.env.TSS2
}, returnPromises: true,});

//get news post from tumblr
function gallery(req,res,next){
  tumblrClient.blogPosts('housescxn', {type: 'text', tag: ['cityultragallery']}).then(resp=>{
   //res.locals.posts=resp.posts;
    let newsTitles=[];
    let newsDates=[];
    let newsAuthors=[];
    let newsBodies=[];
    let newsTopics=[];
    let newsLinks=[];
    resp.posts.forEach(parse);
    function parse(item){
      newsTitles.push(item.title);
      newsDates.push(DateTime.fromSQL(item.date).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY));
      newsAuthors.push(item.post_author);
      newsBodies.push(item.body);
      newsTopics.push(item.tags);
      newsLinks.push(item.post_url);
    }
    res.locals.newsTitles=newsTitles; 
    res.locals.newsDates=newsDates;
    res.locals.newsAuthors=newsAuthors;
    res.locals.newsBodies=newsBodies;
    res.locals.newsTopics=newsTopics;
    res.locals.newsLinks=newsLinks;
    //console.log(res.locals.posts);
    next();
  }).catch(e => {
    console.log(e);
    });
}
//get burgers
function burgers(req,res,next){
  tumblrClient.blogPosts('housescxn', {type: 'text', tag: ['burgers']}).then(resp=>{
   //res.locals.posts=resp.posts;
    let burgersTitles=[];
    let burgersDates=[];
    let burgersAuthors=[];
    let burgersBodies=[];
    let burgersTopics=[];
    let burgersLinks=[];
    resp.posts.forEach(parse);
    function parse(item){
      burgersTitles.push(item.title);
      burgersDates.push(DateTime.fromSQL(item.date).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY));
      burgersAuthors.push(item.post_author);
      burgersBodies.push(item.body);
      burgersTopics.push(item.tags);
      burgersLinks.push(item.post_url);
    }
    res.locals.burgersTitles=burgersTitles; 
    res.locals.burgersDates=burgersDates;
    res.locals.burgersAuthors=burgersAuthors;
    res.locals.burgersBodies=burgersBodies;
    res.locals.burgersTopics=burgersTopics;
    res.locals.burgersLinks=burgersLinks;
    //console.log(res.locals.posts);
    next();
  }).catch(e => {
    console.log(e);
    });
}
//get bentos
function bentos(req,res,next){
  tumblrClient.blogPosts('housescxn', {type: 'text', tag: ['bentos']}).then(resp=>{
   //res.locals.posts=resp.posts;
    let bentosTitles=[];
    let bentosDates=[];
    let bentosAuthors=[];
    let bentosBodies=[];
    let bentosTopics=[];
    let bentosLinks=[];
    resp.posts.forEach(parse);
    function parse(item){
      bentosTitles.push(item.title);
      bentosDates.push(DateTime.fromSQL(item.date).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY));
      bentosAuthors.push(item.post_author);
      bentosBodies.push(item.body);
      bentosTopics.push(item.tags);
      bentosLinks.push(item.post_url);
    }
    res.locals.bentosTitles=bentosTitles; 
    res.locals.bentosDates=bentosDates;
    res.locals.bentosAuthors=bentosAuthors;
    res.locals.bentosBodies=bentosBodies;
    res.locals.bentosTopics=bentosTopics;
    res.locals.bentosLinks=bentosLinks;
    //console.log(res.locals.posts);
    next();
  }).catch(e => {
    console.log(e);
    });
}
//get pupus
function pupus(req,res,next){
  tumblrClient.blogPosts('housescxn', {type: 'text', tag: ['pupus']}).then(resp=>{
   //res.locals.posts=resp.posts;
    let pupusTitles=[];
    let pupusDates=[];
    let pupusAuthors=[];
    let pupusBodies=[];
    let pupusTopics=[];
    let pupusLinks=[];
    resp.posts.forEach(parse);
    function parse(item){
      pupusTitles.push(item.title);
      pupusDates.push(DateTime.fromSQL(item.date).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY));
      pupusAuthors.push(item.post_author);
      pupusBodies.push(item.body);
      pupusTopics.push(item.tags);
      pupusLinks.push(item.post_url);
    }
    res.locals.pupusTitles=pupusTitles; 
    res.locals.pupusDates=pupusDates;
    res.locals.pupusAuthors=pupusAuthors;
    res.locals.pupusBodies=pupusBodies;
    res.locals.pupusTopics=pupusTopics;
    res.locals.pupusLinks=pupusLinks;
    //console.log(res.locals.posts);
    next();
  }).catch(e => {
    console.log(e);
    });
}
//get slaws
function slaws(req,res,next){
  tumblrClient.blogPosts('housescxn', {type: 'text', tag: ['slaws']}).then(resp=>{
   //res.locals.posts=resp.posts;
    let slawsTitles=[];
    let slawsDates=[];
    let slawsAuthors=[];
    let slawsBodies=[];
    let slawsTopics=[];
    let slawsLinks=[];
    resp.posts.forEach(parse);
    function parse(item){
      slawsTitles.push(item.title);
      slawsDates.push(DateTime.fromSQL(item.date).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY));
      slawsAuthors.push(item.post_author);
      slawsBodies.push(item.body);
      slawsTopics.push(item.tags);
      slawsLinks.push(item.post_url);
    }
    res.locals.slawsTitles=slawsTitles; 
    res.locals.slawsDates=slawsDates;
    res.locals.slawsAuthors=slawsAuthors;
    res.locals.slawsBodies=slawsBodies;
    res.locals.slawsTopics=slawsTopics;
    res.locals.slawsLinks=slawsLinks;
    //console.log(res.locals.posts);
    next();
  }).catch(e => {
    console.log(e);
    });
}
//get fritters
function fritters(req,res,next){
  tumblrClient.blogPosts('housescxn', {type: 'text', tag: ['fritters']}).then(resp=>{
   //res.locals.posts=resp.posts;
    let frittersTitles=[];
    let frittersDates=[];
    let frittersAuthors=[];
    let frittersBodies=[];
    let frittersTopics=[];
    let frittersLinks=[];
    resp.posts.forEach(parse);
    function parse(item){
      frittersTitles.push(item.title);
      frittersDates.push(DateTime.fromSQL(item.date).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY));
      frittersAuthors.push(item.post_author);
      frittersBodies.push(item.body);
      frittersTopics.push(item.tags);
      frittersLinks.push(item.post_url);
    }
    res.locals.frittersTitles=frittersTitles; 
    res.locals.frittersDates=frittersDates;
    res.locals.frittersAuthors=frittersAuthors;
    res.locals.frittersBodies=frittersBodies;
    res.locals.frittersTopics=frittersTopics;
    res.locals.frittersLinks=frittersLinks;
    //console.log(res.locals.posts);
    next();
  }).catch(e => {
    console.log(e);
    });
}
//get happyHour
function happyHour(req,res,next){
  tumblrClient.blogPosts('housescxn', {type: 'text', tag: ['happyHour']}).then(resp=>{
   //res.locals.posts=resp.posts;
    let happyHourTitles=[];
    let happyHourDates=[];
    let happyHourAuthors=[];
    let happyHourBodies=[];
    let happyHourTopics=[];
    let happyHourLinks=[];
    resp.posts.forEach(parse);
    function parse(item){
      happyHourTitles.push(item.title);
      happyHourDates.push(DateTime.fromSQL(item.date).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY));
      happyHourAuthors.push(item.post_author);
      happyHourBodies.push(item.body);
      happyHourTopics.push(item.tags);
      happyHourLinks.push(item.post_url);
    }
    res.locals.happyHourTitles=happyHourTitles; 
    res.locals.happyHourDates=happyHourDates;
    res.locals.happyHourAuthors=happyHourAuthors;
    res.locals.happyHourBodies=happyHourBodies;
    res.locals.happyHourTopics=happyHourTopics;
    res.locals.happyHourLinks=happyHourLinks;
    //console.log(res.locals.posts);
    next();
  }).catch(e => {
    console.log(e);
    });
}
//get drafts
function drafts(req,res,next){
  tumblrClient.blogPosts('housescxn', {type: 'text', tag: ['drafts']}).then(resp=>{
   //res.locals.posts=resp.posts;
    let draftsTitles=[];
    let draftsDates=[];
    let draftsAuthors=[];
    let draftsBodies=[];
    let draftsTopics=[];
    let draftsLinks=[];
    resp.posts.forEach(parse);
    function parse(item){
      draftsTitles.push(item.title);
      draftsDates.push(DateTime.fromSQL(item.date).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY));
      draftsAuthors.push(item.post_author);
      draftsBodies.push(item.body);
      draftsTopics.push(item.tags);
      draftsLinks.push(item.post_url);
    }
    res.locals.draftsTitles=draftsTitles; 
    res.locals.draftsDates=draftsDates;
    res.locals.draftsAuthors=draftsAuthors;
    res.locals.draftsBodies=draftsBodies;
    res.locals.draftsTopics=draftsTopics;
    res.locals.draftsLinks=draftsLinks;
    //console.log(res.locals.posts);
    next();
  }).catch(e => {
    console.log(e);
    });
}
//get mondays
function mondays(req,res,next){
  tumblrClient.blogPosts('housescxn', {type: 'text', tag: ['mondays']}).then(resp=>{
   //res.locals.posts=resp.posts;
    let mondaysTitles=[];
    let mondaysDates=[];
    let mondaysAuthors=[];
    let mondaysBodies=[];
    let mondaysTopics=[];
    let mondaysLinks=[];
    resp.posts.forEach(parse);
    function parse(item){
      mondaysTitles.push(item.title);
      mondaysDates.push(DateTime.fromSQL(item.date).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY));
      mondaysAuthors.push(item.post_author);
      mondaysBodies.push(item.body);
      mondaysTopics.push(item.tags);
      mondaysLinks.push(item.post_url);
    }
    res.locals.mondaysTitles=mondaysTitles; 
    res.locals.mondaysDates=mondaysDates;
    res.locals.mondaysAuthors=mondaysAuthors;
    res.locals.mondaysBodies=mondaysBodies;
    res.locals.mondaysTopics=mondaysTopics;
    res.locals.mondaysLinks=mondaysLinks;
    //console.log(res.locals.posts);
    next();
  }).catch(e => {
    console.log(e);
    });
}
//get tuesdays
function tuesdays(req,res,next){
  tumblrClient.blogPosts('housescxn', {type: 'text', tag: ['tuesdays']}).then(resp=>{
   //res.locals.posts=resp.posts;
    let tuesdaysTitles=[];
    let tuesdaysDates=[];
    let tuesdaysAuthors=[];
    let tuesdaysBodies=[];
    let tuesdaysTopics=[];
    let tuesdaysLinks=[];
    resp.posts.forEach(parse);
    function parse(item){
      tuesdaysTitles.push(item.title);
      tuesdaysDates.push(DateTime.fromSQL(item.date).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY));
      tuesdaysAuthors.push(item.post_author);
      tuesdaysBodies.push(item.body);
      tuesdaysTopics.push(item.tags);
      tuesdaysLinks.push(item.post_url);
    }
    res.locals.tuesdaysTitles=tuesdaysTitles; 
    res.locals.tuesdaysDates=tuesdaysDates;
    res.locals.tuesdaysAuthors=tuesdaysAuthors;
    res.locals.tuesdaysBodies=tuesdaysBodies;
    res.locals.tuesdaysTopics=tuesdaysTopics;
    res.locals.tuesdaysLinks=tuesdaysLinks;
    //console.log(res.locals.posts);
    next();
  }).catch(e => {
    console.log(e);
    });
}
//get wednesdays
function wednesdays(req,res,next){
  tumblrClient.blogPosts('housescxn', {type: 'text', tag: ['wednesdays']}).then(resp=>{
   //res.locals.posts=resp.posts;
    let wednesdaysTitles=[];
    let wednesdaysDates=[];
    let wednesdaysAuthors=[];
    let wednesdaysBodies=[];
    let wednesdaysTopics=[];
    let wednesdaysLinks=[];
    resp.posts.forEach(parse);
    function parse(item){
      wednesdaysTitles.push(item.title);
      wednesdaysDates.push(DateTime.fromSQL(item.date).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY));
      wednesdaysAuthors.push(item.post_author);
      wednesdaysBodies.push(item.body);
      wednesdaysTopics.push(item.tags);
      wednesdaysLinks.push(item.post_url);
    }
    res.locals.wednesdaysTitles=wednesdaysTitles; 
    res.locals.wednesdaysDates=wednesdaysDates;
    res.locals.wednesdaysAuthors=wednesdaysAuthors;
    res.locals.wednesdaysBodies=wednesdaysBodies;
    res.locals.wednesdaysTopics=wednesdaysTopics;
    res.locals.wednesdaysLinks=wednesdaysLinks;
    //console.log(res.locals.posts);
    next();
  }).catch(e => {
    console.log(e);
    });
}
//get thursdays
function thursdays(req,res,next){
  tumblrClient.blogPosts('housescxn', {type: 'text', tag: ['thursdays']}).then(resp=>{
   //res.locals.posts=resp.posts;
    let thursdaysTitles=[];
    let thursdaysDates=[];
    let thursdaysAuthors=[];
    let thursdaysBodies=[];
    let thursdaysTopics=[];
    let thursdaysLinks=[];
    resp.posts.forEach(parse);
    function parse(item){
      thursdaysTitles.push(item.title);
      thursdaysDates.push(DateTime.fromSQL(item.date).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY));
      thursdaysAuthors.push(item.post_author);
      thursdaysBodies.push(item.body);
      thursdaysTopics.push(item.tags);
      thursdaysLinks.push(item.post_url);
    }
    res.locals.thursdaysTitles=thursdaysTitles; 
    res.locals.thursdaysDates=thursdaysDates;
    res.locals.thursdaysAuthors=thursdaysAuthors;
    res.locals.thursdaysBodies=thursdaysBodies;
    res.locals.thursdaysTopics=thursdaysTopics;
    res.locals.thursdaysLinks=thursdaysLinks;
    //console.log(res.locals.posts);
    next();
  }).catch(e => {
    console.log(e);
    });
}
//get fridays
function fridays(req,res,next){
  tumblrClient.blogPosts('housescxn', {type: 'text', tag: ['fridays']}).then(resp=>{
   //res.locals.posts=resp.posts;
    let fridaysTitles=[];
    let fridaysDates=[];
    let fridaysAuthors=[];
    let fridaysBodies=[];
    let fridaysTopics=[];
    let fridaysLinks=[];
    resp.posts.forEach(parse);
    function parse(item){
      fridaysTitles.push(item.title);
      fridaysDates.push(DateTime.fromSQL(item.date).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY));
      fridaysAuthors.push(item.post_author);
      fridaysBodies.push(item.body);
      fridaysTopics.push(item.tags);
      fridaysLinks.push(item.post_url);
    }
    res.locals.fridaysTitles=fridaysTitles; 
    res.locals.fridaysDates=fridaysDates;
    res.locals.fridaysAuthors=fridaysAuthors;
    res.locals.fridaysBodies=fridaysBodies;
    res.locals.fridaysTopics=fridaysTopics;
    res.locals.fridaysLinks=fridaysLinks;
    //console.log(res.locals.posts);
    next();
  }).catch(e => {
    console.log(e);
    });
}
//get saturdays
function saturdays(req,res,next){
  tumblrClient.blogPosts('housescxn', {type: 'text', tag: ['saturdays']}).then(resp=>{
   //res.locals.posts=resp.posts;
    let saturdaysTitles=[];
    let saturdaysDates=[];
    let saturdaysAuthors=[];
    let saturdaysBodies=[];
    let saturdaysTopics=[];
    let saturdaysLinks=[];
    resp.posts.forEach(parse);
    function parse(item){
      saturdaysTitles.push(item.title);
      saturdaysDates.push(DateTime.fromSQL(item.date).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY));
      saturdaysAuthors.push(item.post_author);
      saturdaysBodies.push(item.body);
      saturdaysTopics.push(item.tags);
      saturdaysLinks.push(item.post_url);
    }
    res.locals.saturdaysTitles=saturdaysTitles; 
    res.locals.saturdaysDates=saturdaysDates;
    res.locals.saturdaysAuthors=saturdaysAuthors;
    res.locals.saturdaysBodies=saturdaysBodies;
    res.locals.saturdaysTopics=saturdaysTopics;
    res.locals.saturdaysLinks=saturdaysLinks;
    //console.log(res.locals.posts);
    next();
  }).catch(e => {
    console.log(e);
    });
}
//get sundays
function sundays(req,res,next){
  tumblrClient.blogPosts('housescxn', {type: 'text', tag: ['sundays']}).then(resp=>{
   //res.locals.posts=resp.posts;
    let sundaysTitles=[];
    let sundaysDates=[];
    let sundaysAuthors=[];
    let sundaysBodies=[];
    let sundaysTopics=[];
    let sundaysLinks=[];
    resp.posts.forEach(parse);
    function parse(item){
      sundaysTitles.push(item.title);
      sundaysDates.push(DateTime.fromSQL(item.date).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY));
      sundaysAuthors.push(item.post_author);
      sundaysBodies.push(item.body);
      sundaysTopics.push(item.tags);
      sundaysLinks.push(item.post_url);
    }
    res.locals.sundaysTitles=sundaysTitles; 
    res.locals.sundaysDates=sundaysDates;
    res.locals.sundaysAuthors=sundaysAuthors;
    res.locals.sundaysBodies=sundaysBodies;
    res.locals.sundaysTopics=sundaysTopics;
    res.locals.sundaysLinks=sundaysLinks;
    //console.log(res.locals.posts);
    next();
  }).catch(e => {
    console.log(e);
    });
}
  //GET home page
router.get('/projects/CityULTRA',function(req, res, next) {
  res.render('index', {
    title: `CityUltra | SCXN Web Design & Publishing`,
    description:`Sleek and lively frontend suited for food and entertainment venues`,
    thisURL:`https://scxn.github.io/projects/CityULTRA`});
    next()
});
  //GET home page
  router.get('/projects/CityULTRA/home',function(req, res, next) {
    res.render('index', {
      title: `CityUltra | SCXN Web Design & Publishing`,
      description:`Sleek and lively frontend suited for food and entertainment venues`,
      thisURL:`https://scxn.github.io/projects/CityULTRA`});
      next()
  });
  //GET Events page
  router.get('/projects/CityULTRA/events',function(req, res, next) {
    res.render('events', {
      title: `CityUltra | SCXN Web Design & Publishing`,
      description:`Sleek and lively frontend suited for food and entertainment venues`,
      thisURL:`https://scxn.github.io/projects/CityULTRA`});
      next()
  });
  //GET Menu page
  router.get('/projects/CityULTRA/menu',burgers,bentos,pupus,slaws,fritters,happyHour,drafts,mondays,tuesdays,wednesdays,thursdays,fridays,saturdays,sundays,function(req, res, next) {
    res.render('menu', {
      title: `CityUltra | SCXN Web Design & Publishing`,
      description:`Sleek and lively frontend suited for food and entertainment venues`,
      thisURL:`https://scxn.github.io/projects/CityULTRA`});
      next()
  });
  //GET Gallery page
  router.get('/projects/CityULTRA/gallery',gallery,function(req, res, next) {
    res.render('gallery', {
      title: `CityUltra | SCXN Web Design & Publishing`,
      description:`Sleek and lively frontend suited for food and entertainment venues`,
      thisURL:`https://scxn.github.io/projects/CityULTRA`});
      next()
  });
//GET Booking page
router.get('/projects/CityULTRA/booking',function(req, res, next) {
  res.render('booking', {
    title: `CityUltra | SCXN Web Design & Publishing`,
    description:`Sleek and lively frontend suited for food and entertainment venues`,
    thisURL:`https://scxn.github.io/projects/CityULTRA`});
    next()
});

//POST messages
router.post('/projects/birdhouseStudio/send', (req, res, ) => {
  let form = new multiparty.Form();
  let data = {};
  form.parse(req, function (err, fields) {
    Object.keys(fields).forEach(function (property) {
      data[property] = fields[property].toString();
    });
    console.log(data);
    const mail = {
      sender: `${data.name} <${data.address}>`,
      to: process.env.EMAIL, // receiver email,
      subject: data.subject,
      text: `From:\n${data.name} <email: ${data.address}> \n${data.subject}\n${data.demo}\n${data.message}\n${data.phone}`,
    };
    transporter.sendMail(mail, (err, data) => {
      if (err) {
        console.log(err);
        //res.status(500).send("Something went wrong.");
        res.render('yikes');
      } else {
        res.render('thanksForYourComment');
      }
    });
  });
});

module.exports = router;