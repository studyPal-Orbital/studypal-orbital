import { useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'
import homepageBackground from "./img/homepage-bg.jpg";

const Home = () => {

    const { user, logout } = UserAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/')
            console.log('You are logged out')
        } catch (e) {
            console.log(e.message)
        }
    }

    return (
         <div className="home-page-container">
            <h1>studyPal</h1>
            <p><i>A productivity application to help you plan out your busy days!</i></p>
            <p class='home-emailacc'>Account : { user.email }</p>
            <button class = 'home-signout' onClick={handleLogout}>Sign out</button>
            <img src={homepageBackground} className="home-page-background" alt="Stationary"/>
        </div>
    )
}

export default Home;

