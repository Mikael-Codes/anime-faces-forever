import React, { useState, useEffect  } from 'react'
// import TinderCard from '../react-tinder-card/index'
import TinderCard from 'react-tinder-card'
var Airtable = require('airtable');
const names = require('/components/names.json');
require('dotenv').config();

const pb = [
    {
        name: "Vrtte3wNf6AZR9xaJ"
    },
    {
        name: "keyc9gwNf6AZR9xuJ"
    }
]
const api_key = pb[1].name

// Add button: Generate girls
var base = new Airtable({apiKey: process.env.REACT_APP_AIRTABLE_API}).base('appuEOU54maP37kBE');
var airtable_array = Array()
var faces = Array()

// Randomize the order
var rand_db = []// db.sort(() => Math.random() - 0.5)

function Simple () {
    
  const loadData = () => {
    console.log("Loading Airtable data")
      
    if (airtable_array.length < 1) {
        base('Anime Girls').select({
            maxRecords: 32,
            view: "Grid view"
        }).eachPage(function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.
            records.forEach(function(record) {
                airtable_array.push(record)
            });
            faces = airtable_array.map(record => {
                return { name: names.names[Math.floor(Math.random() * names.names.length)].first + " " + names.names[Math.floor(Math.random() * names.names.length)].last, url: record.fields.Attachments[0].url}
            })
            rand_db = faces.sort(() => Math.random() - 0.5)
            setIsLoaded(true)
            console.log(isLoaded)
            // To fetch the next page of records, call `fetchNextPage`.
            // If there are more records, `page` will get called again.
            // If there are no more records, `done` will get called.
            // fetchNextPage();

        }, function done(err) {
            if (err) { console.error(err); return; }
        }, [  
        ]);
    }
  }
  useEffect(() => { 
      loadData();
    },[]);

  const characters = rand_db

  rand_db.sort(() => Math.random() - 0.5)

  const [lastDirection, setLastDirection] = useState()
  const [isLoaded, setIsLoaded] = useState(false)

  const swiped = (direction, nameToDelete) => {
    console.log('removing: ' + nameToDelete)
    setLastDirection(direction)
  }

  const outOfFrame = (name) => {
    console.log(name + ' left the screen!')
  }

  if (!isLoaded) {
    return <div />
  }
  else {
    return (
      <div>
        <link href='https://fonts.googleapis.com/css?family=Damion&display=swap' rel='stylesheet' />
        <link href='https://fonts.googleapis.com/css?family=Alatsi&display=swap' rel='stylesheet' />
        <h1>Infinite Waifus</h1>
        <div className='cardContainer'>
          {characters.map((character) =>
            <TinderCard className='swipe' key={character.name} onSwipe={(dir) => swiped(dir, character.name)} onCardLeftScreen={() => outOfFrame(character.name)}>
              <div style={{ backgroundImage: 'url(' + character.url + ')' }} className='card'>
                
                  <h3><span style= {{ backgroundColor: "white", padding: "0 4px 0 4px", borderRadius: "5px" }}>{character.name}</span></h3>
                
              </div>
            </TinderCard>
          )}
        </div>
        {lastDirection ? <h2 className='infoText'>You swiped {lastDirection}</h2> : <h2 className='infoText' />}
      </div>
    )
  }
}

export default Simple