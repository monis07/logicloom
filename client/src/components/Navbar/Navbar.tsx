import { useNavigate } from "react-router-dom";
import './Navbar.scss'
function Navbar(){
    const navigate=useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    }
    return (
        <div className="app__navbar">
            <div className="app__navbar-logo">
                <h2>LogicLoom</h2>
            </div>
            <div className="app__navbar-button">
                <button onClick={handleLogout}>Log Out</button>
            </div>
        </div>
    )

}
export default Navbar;