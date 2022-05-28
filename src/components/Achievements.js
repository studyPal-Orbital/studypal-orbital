import achievements from "./img/achievements.jpg";

function Achievements () {
    return (
        <div class='achievements'>
            <h1 class="title">Achievements</h1>
            <div className='achievements-img-container'>
                <img src={achievements} className="achievements-image"/>
            </div>
        </div> 
    )
}

export default Achievements;
