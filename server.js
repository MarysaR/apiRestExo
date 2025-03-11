const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

// Données des utilisateurs (stockage en mémoire)
const users = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
  { id: 3, name: "Charlie", email: "charlie@example.com" },
];

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Route de base pour vérifier que le serveur fonctionne
app.get("/", (req, res) => {
  res.send("API en cours d'exécution...");
});

// Récupérer tous les utilisateurs
app.get("/api/users", (req, res) => {
  res.json(users);
});

// Récupérer un utilisateur par ID
app.get("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  }

  res.json(user);
});

// Ajouter un nouvel utilisateur
app.post("/api/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res
      .status(400)
      .json({ message: "Le nom et l'email sont obligatoires" });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

// Mettre à jour un utilisateur existant
app.put("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email } = req.body;
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  }

  users[userIndex] = { ...users[userIndex], name, email };
  res.json(users[userIndex]);
});

// Supprimer un utilisateur
app.delete("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  }

  users.splice(userIndex, 1);
  res.status(204).send();
});

// Récupérer les détails d'un utilisateur via une API externe (JSONPlaceholder)
app.get("/api/users/:id/details", async (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  }

  try {
    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/users/${userId}`
    );
    res.json({ ...user, details: response.data });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération des détails utilisateur",
      });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
