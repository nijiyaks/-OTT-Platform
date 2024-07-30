import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate ,useParams} from "react-router-dom";
import { removeUser } from "../store/authSlice";
import './navbar.css';
function Navbar() {
    var user = useSelector(store=>store.auth.user);
    const dispatch = useDispatch();
    const navigate= useNavigate();
    const { postId } = useParams();
    function logout(){
        if(user){
            axios.post("http://localhost:8000/api/logoutuser",{},{
                headers:{Authorization:`Token ${user.token}`,
            }
            });
            dispatch(removeUser());
            navigate('/login');
        }
    }

    return <nav className="navbar navbar-expand-sm " >
        <div className="navbar-brand" >
            <h4>OTT MOVIES</h4>
        </div>
        <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
        >
            <span className="navbar-toggler-icon"></span>
        </button>
        <div
        className="collapse navbar-collapse mr-auto"
        id="navbarNav"
        style={{ float: "left" }}
        >
            <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                <NavLink to={"/"} className="nav-link">
                  
               </NavLink>
                </li>
           
                {user &&( <li className="nav-item">
                <NavLink to={"/listvideos"} className="nav-link" style={{fontSize: 19}}>
                   List Videos
                </NavLink>
                </li>)}
                {user &&(<li className="nav-item">
                <NavLink to={"/listplan"} className="nav-link" style={{fontSize: 19}}>
                   List Plans
                </NavLink>
                </li>)}
                {user &&( <li className="nav-item">
                <NavLink to={"/myplan"} className="nav-link" style={{fontSize: 19}}>
                   My Plan
                </NavLink>
                </li>)}
                
                <li className="nav-item">
                <NavLink to={"/register"} className="nav-link" >
                   SignUp
                </NavLink>
                </li>
                {user? <li className="nav-item">
           <span className="nav-link" onClick={logout} style={{color:"blue"}}>Logout</span>
  </li>:
                
                <li className="nav-item">
                <NavLink 
                to={"/login"} 
                className={
                    'nav-link '+
                    (status => status.isActive ? 'active' : '')
                } 
                >
                    Login
                </NavLink>
                </li>
            }
            </ul>
        </div>
    </nav>;
}

export default Navbar;