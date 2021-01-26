import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

import { loremIpsum } from 'lorem-ipsum'

import FlatList from './src'
import './web.css'

const app = document.createElement( 'div' )
app.style.width = '100%'
app.style.height = '100%'
document.body.append( app )

const random = ( min: number, max: number ) =>
  Math.floor( Math.random() * ( Math.floor( max ) - Math.ceil( min ) ) ) + Math.ceil( min )

let process = 0

const datas = [
  Array( 10 ).fill( null ).map( () => ( {
    id: process,
    title: loremIpsum( { units: 'word', count: random( 3, 7 ) } ),
    text: loremIpsum( { units: 'paragraph', count: random( 5, 7 ) } ),
    image: `https://picsum.photos/200/300?rand=${Date.now()}-${++process}`
  } ) ),
  Array( 10 ).fill( null ).map( () => ( {
    id: process,
    title: loremIpsum( { units: 'word', count: random( 3, 7 ) } ),
    text: loremIpsum( { units: 'paragraph', count: random( 5, 7 ) } ),
    image: `https://picsum.photos/200/300?rand=${Date.now()}-${++process}`
  } ) ),
  Array( 10 ).fill( null ).map( () => ( {
    id: process,
    title: loremIpsum( { units: 'word', count: random( 3, 7 ) } ),
    text: loremIpsum( { units: 'paragraph', count: random( 5, 7 ) } ),
    image: `https://picsum.photos/200/300?rand=${Date.now()}-${++process}`
  } ) )
]

const App = () => {
  const [ list, setList ] = useState<{ id: number, title: string, text: string, image: string }[]>( [] )

  const [ page, setPage ] = useState( 0 )

  useEffect( () => {
    setTimeout( () => {
      if ( datas[page] ) setList( list => list.concat( datas[page] ) )
    }, 800 )
  }, [ page ] )

  return (
    <FlatList
      data={ list }
      keyExtractor={ ( item, index ) => `${item.id}-${index}` }
      onEndReached={ () => setPage( page => page + 1 ) }
      onEndReachedThreshold={0.3}
      renderItem={ ( { item } ) => 
        <div>
          <img src={item.image}/>
          <h4>{item.title}</h4>
          <p>{item.text}</p>
        </div>
      }
    />
  )
}

ReactDOM.render( <App />, app )
