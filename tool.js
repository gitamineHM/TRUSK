'use strict';
var bluebird = require("bluebird");
var async = require('async');
const inquirer = require('inquirer');
var redisclient = require('redis');
var redis = redisclient.createClient()
var i = 0, j = 0;

redis.on('connect', () => {
   console.log('\x1Bc');
   main()
});

redis.on('error', () => {
  console.log(error)
});

function validateName(name) {
        return name !== '';
    }

function validateNumber(number) {
       var reg = /^([1-9]|[1-9][0-9]|[1-9][0-9][0-9])$/;  //1-999
       return reg.test(number) || "Doit être un nombre positif";
    }

var questions = [{
        message: "Le nom du trusker",
        type: "input",
        name: "TruskerName",
        validate: validateName
        },{
        message: "Le nom de la société",
        type: "input",
        name: "EntrepriseName",
        validate: validateName
        },{
        message: "Le nombre d'employés",
        type: "input",
        name: "NumberOfEmployees",
        validate: validateNumber,
        next: true,
        },{
        message: "Le nom de l'employé ",
        type: "input",
        name: "NameOfEmployee",
        validate: validateName
        },{
        message: "Le nombre de camion",
        type: "input",
        name: "NumberOfTrucks",
        validate: validateNumber,
        next: true,
        },{
        message: "Volume en m³ du camion ",
        type: "input",
        name: "TruckVolume",
        validate: validateNumber
        },{
        message: "Type de camion",
        type: "list",
        name : 'TruckType',
        choices: ['A', 'B', 'C']
        },{
        message: "Les informations sont-elles valides ?",
        type: "list",
        name : 'Valid',
        choices: ['Oui', 'Non'],
        confirm: true
        }]

//Main routine
async function main() {
    bluebird.mapSeries(questions, async (qs) => {
        if(j >i)
          while (j >i) {
              qs = addNumberToNameAndNumber(qs)
              await ask(qs).then(async (a)=> {
                    await save(Object.keys(a)[0], a[Object.keys(a)[0]])
                    })
              i++;
          }
        else
        {
          if(i==j) i=0;j=0;
          return ask(qs).then(async (a) => {
                        await save(Object.keys(a)[0], a[Object.keys(a)[0]])
                        if(qs.next)
                        j = parseInt(a[Object.keys(a)[0]]);
                        if (qs.confirm && a.Valid == 'Oui') //informations Valides
                       {
                         redis.flushdb()
                         console.log('FIN')
                       }
                       else if (qs.confirm && a.Valid == 'Non')
                       {
                        console.log('\x1Bc');
                        redis.flushdb()
                        main()
                       }
                    })
        }
   })
}


function addNumberToNameAndNumber(string, number)
{
    if(isNaN(string.name.substr(string.name.length-1, string.name.length)))
    {
      string.name += i +1 ;
      string.message += i +1 ;
    }
    else
    { string.name = string.name.substr(0,string.name.length -1)
      string.name += i + 1
      string.message = string.message.substr(0,string.message.length -1)
      string.message += i + 1
    }
    return string
}
//Ask function
function ask(qs) {
   return new Promise((resolve, reject) => {
     read(qs.name)
     .then((a) => {
          console.log(qs.message + ' : ' +  a)
          resolve(a)
     })
     .catch(() => {
         inquirer.prompt(qs)
                 .then((a) => {
                   if (qs.next)
                   j = parseInt(a[Object.keys(a)[0]]);
                   resolve(a)
                  })
      })
  })
}

//Save redis key
function save(key,data)
{
  return new Promise(function (resolve, reject) {
    redis.set(key,data,function(err,reply) {
       if (err) reject(err)
       resolve(reply);
    });
  });
}

//Read Redis key
function read(key)
{
  return new Promise(function (resolve, reject) {
    redis.exists(key, function(err, reply) {
          if (reply === 1) {
                redis.get(key,function(err,reply) {
                          if (err) reject(err)
                          resolve(reply);
                });
              }
         else
         reject();
    });
  });
}
