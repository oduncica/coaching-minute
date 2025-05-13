// Clés API
const COHERE_API_KEY = "bDPevjGX2BZPN9W2APxMKGgKGQihlSXFvYZgPa1C"; // Clé API Cohere
const EMAILJS_USER_ID = "stKUtZJmtCM--lJx_";
const EMAILJS_SERVICE_ID = "service_ayshmag";
const EMAILJS_TEMPLATE_ID = "template_vwuu3qp";

// Initialiser EmailJS
emailjs.init(EMAILJS_USER_ID);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const startButton = document.querySelector(".btn");
  const formSection = document.getElementById("formulaire");

  // Afficher le formulaire quand on clique sur le bouton
  startButton.addEventListener("click", () => {
    formSection.style.display = "block";
    window.scrollTo({ top: formSection.offsetTop, behavior: "smooth" });
  });

  // Soumission du formulaire
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const age = document.getElementById("age").value.trim();
    const secteur = document.getElementById("secteur").value.trim();
    const besoin = document.getElementById("besoin").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!age || !secteur || !besoin || !email) {
      return alert("Merci de remplir tous les champs.");
    }

    if (!email.includes("@")) {
      return alert("Adresse e-mail invalide.");
    }

    try {
      const coachingText = await generateTextWithCohere(besoin, secteur, age);
      await sendEmail(coachingText, email);
      alert("Ton coaching a été envoyé par e-mail !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi : " + err.message);
    }
  });
});

// Génération du texte via Cohere
// Génération du texte via Cohere (API Chat)
async function generateTextWithCohere(besoin, secteur, age) {
  const messages = [
    {
      role: "system",
      content:
        "Tu es un coach étudiant virtuel qui aide les étudiants à surmonter leurs défis.",
    },
    {
      role: "user",
      content: `Agis comme un coach étudiant. Donne un message de coaching positif, court, adapté à un étudiant de ${age}, en ${secteur}, qui ressent : ${besoin}.`,
    },
  ];

  const response = await fetch("https://api.cohere.ai/chat", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${COHERE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "command-xlarge-nightly", // Modèle gratuit de Cohere
      messages: messages,
      max_tokens: 100,
      temperature: 0.7,
    }),
  });

  const data = await response.json();

  // Vérification des erreurs
  if (data.message) {
    throw new Error("Erreur Cohere : " + data.message);
  }

  // Retour du texte généré
  if (data.reply) {
    return data.reply.trim();
  } else {
    throw new Error("Réponse inattendue de Cohere");
  }
}
// Envoi du mail avec EmailJS
function sendEmail(coachingText, email) {
  return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    to_email: email,
    coaching_text: coachingText,
  });
}
