import useGlobalReducer from "../hooks/useGlobalReducer";
import { logout } from "../fetch";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout(dispatch);     // clear auth info
		navigate("/login");   // redirect to login
	};

	const isLoggedIn = !!store.token; // 

	return (
		<nav className="navbar navbar-light bg-light" data-bs-theme="light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">
						<img src="src/front/assets/img/logoNavbar.png" width={250} height={90}></img>
					</span>
				</Link>
				<div className="ml-auto">
					<Link to="/homepage" className="text-decoration-none">
						<span className="navbar-brand mb-0 h1">Home</span>
					</Link>
					<Link to="/destination" className="text-decoration-none">
						<span className="navbar-brand mb-0 h1">Destination</span>
					</Link>
					<Link to="/journals" className="text-decoration-none">
				 		<span className="navbar-brand mb-0 h1">Journal Feed</span>
					</Link>
					<Link to="/contactus" className="text-decoration-none">
						<span className="navbar-brand mb-0 h1">Contact Us</span>
					</Link>

					{isLoggedIn ? (
					<>
						<Link to="/journalpostform">
							<button className="btn btn-primary me-3">Post your Journal</button>
						</Link>
						<button className="btn btn-danger" onClick={handleLogout}>
							Logout
						</button>
					</>			
					)
					
					 : 
					(
					<>
						<Link to="/login" className="text-decoration-none">
							<span className="navbar-brand mb-0 h1 text-primary">Login</span>
						</Link>
						<Link to="/journalpostform">
							<button className="btn btn-primary me-3">Post your Journal</button>
						</Link>
						<Link to="/signup" className="text-decoration-none">
							<button className="btn btn-primary">Signup</button>
						</Link>

					</>
					)}
				</div>
			</div>
		</nav >
	);
};


