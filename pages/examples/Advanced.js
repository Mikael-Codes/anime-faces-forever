import React, { useState, useMemo, useRef, useEffect } from 'react'
import { render } from 'react-dom';
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
  }
]

function LoadStuff() {
    
  
}
// console.log(airtable_array);
// console.log(faces)

// Randomize the order


const key = pb[1].name

// var rand_db = faces.sort(() => Math.random() - 0.5)
var base = new Airtable({apiKey: key}).base('appuEOU54maP37kBE');

var airtable_array = Array()
var faces = Array()
var rand_db = Array() 
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
            console.log(faces)
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
function Advanced () {

    useEffect(() => { 
        loadData();
    },[]);

        const [currentIndex, setCurrentIndex] = useState(rand_db.length - 1)
        const [lastDirection, setLastDirection] = useState()
        // used for outOfFrame closure
        const currentIndexRef = useRef(currentIndex)

        // Memoization
        // Only recompute if one of the dependencies has changed
        const childRefs = useMemo(
            () =>
            Array(rand_db.length)
                .fill(0)
                .map((i) => React.createRef()),
            []
        )

        const updateCurrentIndex = (val) => {
            setCurrentIndex(val)
            currentIndexRef.current = val
        }

        const canGoBack = currentIndex < rand_db.length - 1
        const canSwipe = currentIndex >= 0

        // set last direction and decrease current index
        const swiped = (direction, nameToDelete, index) => {
            setLastDirection(direction)
            updateCurrentIndex(index - 1)
        }

        const outOfFrame = (name, idx) => {
            console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current)
            // handle the case in which go back is pressed before card goes outOfFrame
            currentIndexRef.current >= idx && childRefs[idx].current.restoreCard()
            // TODO: when quickly swipe and restore multiple times the same card,
            // it happens multiple outOfFrame events are queued and the card disappear
            // during latest swipes. Only the last outOfFrame event should be considered valid
        }

        const swipe = async (dir) => {
            if (canSwipe && currentIndex < rand_db.length) {
            await childRefs[currentIndex].current.swipe(dir) // Swipe the card!
            }
        }

        // increase current index and show card
        const goBack = async () => {
            if (!canGoBack) return
            const newIndex = currentIndex + 1
            updateCurrentIndex(newIndex)
            await childRefs[newIndex].current.restoreCard()
        }

        return (
            <div>
            <link
                href='https://fonts.googleapis.com/css?family=Damion&display=swap'
                rel='stylesheet'
            />
            <link
                href='https://fonts.googleapis.com/css?family=Alatsi&display=swap'
                rel='stylesheet'
            />
            <h1>Infinite Waifu Land</h1>

                <div className='cardContainer'>
                    {rand_db.map((character, index) => (
                    <TinderCard
                        ref={childRefs[index]}
                        className='swipe'
                        key={character.name}
                        onSwipe={(dir) => swiped(dir, character.name, index)}
                        onCardLeftScreen={() => outOfFrame(character.name, index)}
                    >
                        <div
                        style={{ backgroundImage: 'url(' + character.url + ')' }}
                        className='card'
                        >
                        <h3>{character.name}</h3>
                        </div>
                    </TinderCard>
                    ))}
                </div>,
                <div className='buttons'>
                    <button style={{ backgroundColor: !canSwipe && '#c3c4d3' }} onClick={() => swipe('left')}>Swipe left!</button>
                    <button style={{ backgroundColor: !canGoBack && '#c3c4d3' }} onClick={() => goBack()}>Undo swipe!</button>
                    <button style={{ backgroundColor: !canSwipe && '#c3c4d3' }} onClick={() => swipe('right')}>Swipe right!</button>
                </div>
                

            {lastDirection ? (
                <h2 key={lastDirection} className='infoText'>
                You swiped {lastDirection}
                </h2>
            ) : (
                <h2 className='infoText'>
                Swipe a card or press a button to get Restore Card button visible!
                </h2>
            )}
            </div>
        )
}

export default Advanced

