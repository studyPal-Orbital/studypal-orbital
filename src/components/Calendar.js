import calendar from "./img/calendar.jpg";


function Calendar () {
    return (
        <div class='calendar'>
            <h1 class="title">Calendar</h1>
            <div className='calendar-img-container'>
                <img src={calendar} className="calendar-image" alt="Calendar placeholder"/>
            </div>
        </div> 
    )
}

export default Calendar;



