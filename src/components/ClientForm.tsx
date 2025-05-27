import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Client = {
	id: string;
	name: string;
	email: string;
	user_id: string;
	created_at: string;
};

export default function ClientForm() {
	const [clients, setClients] = useState<Client[]>([]);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [editingId, setEditingId] = useState<string | null>(null);
	const [message, setMessage] = useState("");

	const fetchClients = async () => {
		// 📋 Récupérer les clients
		const { data, error } = await supabase
			.from("clients")
			.select("*")
			.order("created_at", { ascending: false });

		if (error) setMessage(error.message);
		else setClients(data as Client[]);
	};

	useEffect(() => {
		fetchClients();
	}, []);

	const resetForm = () => {
		setName("");
		setEmail("");
		setEditingId(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Vérifier si l'utilisateur est connecté avec la méthode getSession
		const { data: sessionData } = await supabase.auth.getSession();
		const user = sessionData.session?.user;

		if (!user) {
			setMessage("Utilisateur non connecté.");
			return;
		}

		if (editingId) {
			// ✏️ UPDATE
			const { error } = await supabase
				.from("clients")
				.update({ name, email })
				.eq("id", editingId);

			setMessage(error ? error.message : "Client mis à jour.");
		} else {
			// ➕ INSERT
			const { error } = await supabase.from("clients").insert({
				name,
				email,
				user_id: user.id,
			});

			setMessage(error ? error.message : "Client ajouté.");
		}

		resetForm();
		fetchClients();
	};

	const handleEdit = (client: Client) => {
		setName(client.name);
		setEmail(client.email);
		setEditingId(client.id);
	};

	const handleDelete = async (id: string) => {
		// 🗑️ DELETE
		const { error } = await supabase.from("clients").delete().eq("id", id);
		if (error) setMessage(error.message);
		else {
			setMessage("Client supprimé.");
			fetchClients();
		}
	};

	return (
		<div style={{ maxWidth: 500, margin: "2rem auto" }}>
			<h2>{editingId ? "Modifier un client" : "Ajouter un client"}</h2>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="Nom"
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
				/>
				<br />
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<br />
				<button type="submit">
					{editingId ? "Mettre à jour" : "Ajouter"}
				</button>
				{editingId && (
					<button type="button" onClick={resetForm}>
						Annuler
					</button>
				)}
			</form>

			<p>{message}</p>

			<h3>📋 Liste des clients</h3>
			{clients.length === 0 && <p>Aucun client pour le moment.</p>}
			<ul>
				{clients.map((client) => (
					<li key={client.id}>
						<strong>{client.name}</strong> ({client.email})
						<div>
							<button onClick={() => handleEdit(client)}>
								✏️
							</button>
							<button onClick={() => handleDelete(client.id)}>
								🗑️
							</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
