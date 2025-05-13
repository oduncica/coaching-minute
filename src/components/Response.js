export const Response = () => {
  const apiKey = "FuyL5GS1HfNJye6A5ZrLQiyivpENhpPe";
  const apiUrl = "http://127.0.0.1:8080";

  fetch(apiUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Réponse de l'API:", data);
    })
    .catch((error) => {
      console.error("Erreur lors de l'appel API:", error);
    });
};
