import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "./lib/supabaseClient";
import ClientForm from "./components/ClientForm";

export default function App() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const [user, setUser] = useState<User | null>(null);
	const [session, setSession] = useState<Session | null>(null);

	const handleSignup = async () => {
		const { error } = await supabase.auth.signUp({ email, password });
		setMessage(
			error
				? error.message
				: "Vérifie ta boîte mail pour valider ton compte."
		);
	};

	const handleLogin = async () => {
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		setMessage(error ? error.message : "Connexion réussie !");
	};

	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			setMessage(error.message);
		} else {
			setMessage("Déconnexion réussie.");
			setUser(null);
		}
	};

	useEffect(() => {
		const getUser = async () => {
			const { data } = await supabase.auth.getUser();
			if (data?.user) {
				setUser(data.user);
			}
		};
		getUser();

		const { data: listener } = supabase.auth.onAuthStateChange(
			(event, session) => {
				console.log("Changement de session:", event, session);
				setSession(session);
				setUser(session?.user ?? null);
			}
		);

		return () => {
			listener.subscription.unsubscribe();
		};
	}, []);

	return (
		<div style={{ padding: 40 }}>
			<h1>🔐 Auth Supabase</h1>

			{user ? (
				<>
					<p>Connecté en tant que : {user.email}</p>
					<button onClick={handleLogout}>Déconnexion</button>

					{/* ✅ Affichage du formulaire client */}
					<ClientForm />
				</>
			) : (
				<>
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<input
						type="password"
						placeholder="Mot de passe"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<div>
						<button onClick={handleSignup}>S’inscrire</button>
						<button onClick={handleLogin}>Se connecter</button>
					</div>
				</>
			)}

			<p>{message}</p>
		</div>
	);
}
