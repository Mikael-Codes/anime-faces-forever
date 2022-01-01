import React, { useState, useEffect  } from 'react'
// import TinderCard from '../react-tinder-card/index'
import TinderCard from 'react-tinder-card'
var Airtable = require('airtable');

const pb = [
    {
        name: "Vrtte3wNf6AZR9xaJ"
    },
    {
        name: "keyc9gwNf6AZR9xuJ"
    }
]
const db = [
  {
    name: 'Sakura',
    url: './img/face_18.png'
  },
  {
    name: 'Daisuke',
    url: './img/face_19.png'
  },
  {
    name: 'Banana',
    url: './img/face_21.png'
  },
  {
    name: 'Yomi',
    url: './img/face_24.png'
  },
  {
    name: 'Ichika',
    url: './img/face_30.png'
  },
  {
    name: 'Sara',
    url: './img/face_75.png'
  },
  {
    name: 'Yui',
    url: './img/face_76.png'
  },
  {
    name: 'Hina',
    url: './img/face_77.png'
  },
  {
    name: 'Machiko',
    url: './img/face_78.png'
  },
  {
    name: 'Nayoko',
    url: './img/face_79.png'
  }
]

// Randomize the order
db.sort(() => Math.random() - 0.5)
const key = pb[1].name

// var rand_db = faces.sort(() => Math.random() - 0.5)
var base = new Airtable({apiKey: key}).base('appuEOU54maP37kBE');

var airtable_array = Array()
var faces = Array()
var rand_db = db
const loadData = () => {
    console.log("Loading Airtable data")
        
    // const [isLoadingData, setisLoadingData] = React.useState(true);
    // const [showData, setShowData] = React.useState(false);
    if (airtable_array.length < 1) {
        base('Anime Girls').select({
            // Selecting the first 3 records in Grid view:
            maxRecords: 128,
            view: "Grid view"
        }).eachPage(function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.

            records.forEach(function(record) {
                airtable_array.push(record)
            // console.log('Retrieved', record.get('Name'));
            });

            faces = airtable_array.map(record => {
                //console.log("Mapping record")
                //console.log(record);
                return { name: Math.floor(Math.random() * 1000000).toString(), url: record.fields.Attachments[0].url}
            })
            rand_db = faces.sort(() => Math.random() - 0.5)
            // To fetch the next page of records, call `fetchNextPage`.
            // If there are more records, `page` will get called again.
            // If there are no more records, `done` will get called.
        
            fetchNextPage();

        }, function done(err) {
            // setShowData(true)
            
            // setisLoadingData(false)
            if (err) { console.error(err); return; }

        }, []);
    }
}


function Simple () {

    useEffect(() => { 
        loadData();
    },[]);

  const characters = rand_db
  const [lastDirection, setLastDirection] = useState()

  const swiped = (direction, nameToDelete) => {
    console.log('removing: ' + nameToDelete)
    setLastDirection(direction)
  }

  const outOfFrame = (name) => {
    console.log(name + ' left the screen!')
  }

  return (
    <div>
      <link href='https://fonts.googleapis.com/css?family=Damion&display=swap' rel='stylesheet' />
      <link href='https://fonts.googleapis.com/css?family=Alatsi&display=swap' rel='stylesheet' />
      <h1>Infinite Waifus</h1>
      <div className='cardContainer'>
        {characters.map((character) =>
          <TinderCard className='swipe' key={character.name} onSwipe={(dir) => swiped(dir, character.name)} onCardLeftScreen={() => outOfFrame(character.name)}>
            <div style={{ backgroundImage: 'url(' + character.url + ')' }} className='card'>
              <h3>{character.name}</h3>
            </div>
          </TinderCard>
        )}
      </div>
      {lastDirection ? <h2 className='infoText'>You swiped {lastDirection}</h2> : <h2 className='infoText' />}
    </div>
  )
}

export default Simple
