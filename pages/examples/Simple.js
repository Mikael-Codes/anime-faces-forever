import React, { useState, useEffect  } from 'react'
// import TinderCard from '../react-tinder-card/index'
import TinderCard from 'react-tinder-card'
var Airtable = require('airtable');
const config = require('components/config.json')
const names = require('/components/names.json');

var base = new Airtable({apiKey: config.api_key}).base(config.base);
var airtable_array = Array()
var faces = Array()

function Simple () {
    
  const loadData = () => {
    console.log("Loading Airtable data")
      
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

            setIsLoaded(true)
            console.log(isLoaded)
            // To fetch the next page of records, call `fetchNextPage`.
            // If there are more records, `page` will get called again.
            // If there are no more records, `done` will get called.
            fetchNextPage();

        }, function done(err) {
            if (err) { console.error(err); return; }
        }, [  
        ]);
    
  }

  useEffect(() => { 
      loadData();
    },[]);

  const characters = faces

  faces.sort(() => Math.random() - 0.5)

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