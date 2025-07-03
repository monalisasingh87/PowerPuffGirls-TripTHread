import React, { useEffect } from "react"
import background2 from "../assets/img/background2.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { WorldMap } from "./WorldMap.jsx";
import { Link } from "react-router-dom";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()

	const loadMessage = async () => {
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL

			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

			const response = await fetch(backendUrl + "/api/hello")
			const data = await response.json()

			if (response.ok) dispatch({ type: "set_hello", payload: data.message })

			return data

		} catch (error) {
			if (error.message) throw new Error(
				`Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`
			);
		}

	}

	useEffect(() => {
		loadMessage()
	}, [])

	return (
		<div className="text-center mt-5">
      <div className="container">
				<div className="col-10 p-lg-5 mx-auto my-5">
					<h2 className="display-4 fw-normal" style={{color: "#3CA9D1"}}>TripThread</h2>
					<p className="lead">Explore the world visually. Discover languages, currency, stories and dreams — all in one place</p>
					
          <Link to="/destination">
            <a className="btn btn-lg btn-outline-dark" style={{hover: "#FF6B00"}}>Start Exploring</a>
          </Link>
				</div>
				<WorldMap></WorldMap>  
</div>


			
			<div className="alert alert-info">
				{store.message ? (
					<span>{store.message}</span>
				) : (
					<span className="text-danger">
						{}
					</span>
				)}
			</div>
		</div>
	);
}; 