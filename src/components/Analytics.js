import analytics from "./img/analytics.jpg";
import React from 'react'

function Analytics () {
    return (
        <div class='analytics'>
            <h1 class="title">Analytics</h1>
            <div className='analytics-img-container'>
                <img src={analytics} className="analytics-image" alt="Analytics placeholder"/>
            </div>
        </div> 
    )
}

export default Analytics;

