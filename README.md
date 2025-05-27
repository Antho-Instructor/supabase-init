# Prise en main de Supabase

## Table des matières

- [Prise en main de Supabase](#prise-en-main-de-supabase)
  - [Table des matières](#table-des-matières)
  - [Introduction](#introduction)
  - [Authentification](#authentification)
    - [Exemple de code pour l'authentification](#exemple-de-code-pour-lauthentification)
  - [Base de données](#base-de-données)
    - [Exemple de code pour interagir avec la base de données](#exemple-de-code-pour-interagir-avec-la-base-de-données)

## Introduction

[Supabase](https://supabase.com/) est une plateforme **open-source** qui fournit des services backend tels que la base de données, l'authentification et le stockage de fichiers. Il est souvent utilisé comme alternative à Firebase.

## Authentification

Il propose une solution d'authentification robuste qui prend en charge les utilisateurs, les rôles et les permissions. Vous pouvez facilement gérer les utilisateurs, envoyer des e-mails de confirmation et de réinitialisation de mot de passe, et configurer des règles d'accès basées sur les rôles.

### Exemple de code pour l'authentification

```tsx
const handleLogin = async () => {
	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});
	setMessage(error ? error.message : "Connexion réussie !");
};
```

## Base de données

Supabase utilise PostgreSQL comme base de données relationnelle. Il offre une interface SQL pour interagir avec la base de données, ainsi que des fonctionnalités avancées telles que les vues, les fonctions et les déclencheurs.

Vous pouvez créer des tables, définir des relations entre elles et exécuter des requêtes SQL directement depuis l'interface Supabase.

### Exemple de code pour interagir avec la base de données

```tsx
const fetchData = async () => {
	const { data, error } = await supabase
		.from("users")
		.select("*")
		.eq("is_active", true);
	if (error) {
		console.error("Erreur lors de la récupération des données :", error);
	} else {
		console.log("Données récupérées :", data);
	}
};
```
