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
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">Logo</span>
				</Link>
				<div className="ml-auto">
					{isLoggedIn ? (
					<>
						<Link to="/">
							<span className="navbar-brand mb-0 h1">post</span>
						</Link>
						<Link to="/">
							<span className="navbar-brand mb-0 h1">post</span>
						</Link>
						<Link to="/">
							<span className="navbar-brand mb-0 h1">post</span>
						</Link>
						<button className="btn btn-danger" onClick={handleLogout}>
							Logout
						</button>
						
					</>			
					)
					
					 : 
					(
					<>
						<Link to="/login">
							<span className="navbar-brand mb-0 h1">Login</span>
						</Link>
						<Link to="/signup">
							<button className="btn btn-primary">Signup</button>
						</Link>
						
					</>
					)}
				</div>
				<div className="ml-auto">
					<Link to="/journalpostform">
						<button className="btn btn-primary">Post your Journal</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};
