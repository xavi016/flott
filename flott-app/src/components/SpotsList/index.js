
import React from 'react'
import Spot from '../Spot'

export default function ({ spots }) {
    return <ul className="spots__results results">
    {spots && spots.length > 0 ? spots.map(spot => <li className="results__item card" key={spot.id}><Spot spot={spot}/></li>) : <p>No results</p>}
</ul>
}