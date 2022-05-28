import timer from "./img/timer.jpg";

function Timer () {
    return (
        <div class='timer'>
            <h1 class="title">Timer</h1>
            <div className='timer-img-container'>
                <img src={timer} className="timer-image"/>
            </div>
        </div> 
    )
}

export default Timer;

