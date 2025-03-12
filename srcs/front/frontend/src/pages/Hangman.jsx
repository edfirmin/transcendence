import React, { useState, useEffect } from "react";
import "../styles/Hangman.css";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";
import {useNavigate} from "react-router-dom"
import Navbarr from '../components/Navbar';
import { getUser } from "../api"

function Hangman() {
  // États du jeu
  const userToken = localStorage.getItem(ACCESS_TOKEN);
  const [currentGame, setCurrentGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [letter, setLetter] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [user, setUser] = useState();

  const defaultWords = ["python", "flask", "react", "javascript", "html", "css", "pendu", "jeu", "programmation", "code"];

  useEffect(async () => {
    const TMPuser = await getUser()
    setUser(TMPuser);
    setScore(TMPuser.hangman_score)
  }, [])
  
  // Fonction pour démarrer une nouvelle partie
  const startNewGame = () => {
    setLoading(true);
    
    // Simuler un délai de chargement pour une meilleure expérience utilisateur
    setTimeout(() => {
      // Choisir un mot aléatoire
      const randomWord = defaultWords[Math.floor(Math.random() * defaultWords.length)];
      
      // Créer un nouveau jeu avec les mêmes propriétés que le backend
      const newGame = {
        id: Date.now(), // Identifiant unique
        maskedWord: "_".repeat(randomWord.length),
        guessedLetters: "",
        attemptsLeft: 6,
        status: "ongoing",
        // On stocke le mot complet localement (côté serveur c'est une relation)
        word: randomWord
      };
      
      setCurrentGame(newGame);
      setMessage("Nouvelle partie commencée!");
      setLetter("");
      setLoading(false);
    }, 500);
  };

  // Fonction pour obtenir le mot masqué
  const getMaskedWord = (word, guessedLetters) => {
    return word.split('').map(letter => 
      guessedLetters.includes(letter) ? letter : "_"
    ).join('');
  };

  // Fonction pour deviner une lettre
  const guessLetter = (e) => {
    e.preventDefault();
    
    if (!letter || letter.length !== 1 || !letter.match(/[a-z]/i)) {
      setMessage("Veuillez entrer une seule lettre");
      return;
    }
    
    const lowerLetter = letter.toLowerCase();
    
    if (currentGame.guessedLetters.includes(lowerLetter)) {
      setMessage("Cette lettre a déjà été devinée");
      return;
    }
    
    setLoading(true);
    
    // Simuler un délai pour une meilleure expérience utilisateur
    setTimeout(async () => {
      // Copier l'objet du jeu actuel
      const updatedGame = { ...currentGame };
      
      // Ajouter la lettre aux lettres devinées
      updatedGame.guessedLetters += lowerLetter;
      
      // Mettre à jour le mot masqué
      updatedGame.maskedWord = getMaskedWord(updatedGame.word, updatedGame.guessedLetters);
      
      // Calculer les points si la lettre est correcte
      let pointsEarned = 0;
      
      if (updatedGame.word.includes(lowerLetter)) {
        // Compter combien de fois la lettre apparaît dans le mot
        const letterCount = updatedGame.word.split('').filter(char => char === lowerLetter).length;
        // Attribuer 10 points par occurrence de la lettre
        pointsEarned = letterCount * 10;
      } else {
        updatedGame.attemptsLeft -= 1;
      }
      
      // Vérifier si la partie est gagnée
      const isWordGuessed = !updatedGame.maskedWord.includes("_");
      
      if (isWordGuessed) {
        updatedGame.status = "won";
        // Bonus pour avoir complété le mot
        pointsEarned += 50;
      } else if (updatedGame.attemptsLeft <= 0) {
        updatedGame.status = "lost";
      }
      
      // Mettre à jour le state avec le jeu modifié
      setCurrentGame(updatedGame);
      
      // Ajouter les points au score
      if (pointsEarned > 0) {
        setScore(prevScore => prevScore + pointsEarned);
      }
      
      // Définir le message en fonction du résultat
      if (updatedGame.status === "won") {
        setMessage(`Félicitations ! Vous avez trouvé le mot : ${updatedGame.word}`);
        await axios.post('api/user/addScoreHangman/', {userToken, score});
      } else if (updatedGame.status === "lost") {
        setMessage(`Dommage ! Le mot était : ${updatedGame.word}`);
        await axios.post('api/user/addScoreHangman/', {userToken, score});
      } else if (updatedGame.word.includes(lowerLetter)) {
        setMessage(`Bonne devinette ! +${pointsEarned} points !`);
      } else {
        setMessage("Lettre incorrecte !");
      }

      
      setLetter("");  
      setLoading(false);
    }, 300);
  };

  // Fonction pour dessiner le pendu en fonction des tentatives restantes
  const drawHangman = (attemptsLeft) => {
    return (
      <div className="hangman-drawing">
        <svg width="200" height="250" viewBox="0 0 200 250">
          {/* Base */}
          <line x1="20" y1="230" x2="100" y2="230" stroke="black" strokeWidth="3" />
          
          {/* Poteau vertical */}
          <line x1="60" y1="20" x2="60" y2="230" stroke="black" strokeWidth="3" />
          
          {/* Poutre horizontale */}
          <line x1="58" y1="20" x2="140" y2="20" stroke="black" strokeWidth="3" />
          
          {/* Corde */}
          <line x1="140" y1="20" x2="140" y2="50" stroke="black" strokeWidth="3" 
                opacity={attemptsLeft < 6 ? "1" : "0"} />
          
          {/* Tête */}
          <circle cx="140" cy="70" r="20" stroke="black" strokeWidth="3" fill="transparent" 
                 opacity={attemptsLeft < 5 ? "1" : "0"} />
          
          {/* Corps */}
          <line x1="140" y1="90" x2="140" y2="150" stroke="black" strokeWidth="3" 
                opacity={attemptsLeft < 4 ? "1" : "0"} />
          
          {/* Bras gauche */}
          <line x1="140" y1="110" x2="110" y2="100" stroke="black" strokeWidth="3" 
                opacity={attemptsLeft < 3 ? "1" : "0"} />
          
          {/* Bras droit */}
          <line x1="140" y1="110" x2="170" y2="100" stroke="black" strokeWidth="3" 
                opacity={attemptsLeft < 2 ? "1" : "0"} />
          
          {/* Jambe gauche */}
          <line x1="140" y1="150" x2="120" y2="180" stroke="black" strokeWidth="3" 
                opacity={attemptsLeft < 1 ? "1" : "0"} />
          
          {/* Jambe droite */}
          <line x1="140" y1="150" x2="160" y2="180" stroke="black" strokeWidth="3" 
                opacity={attemptsLeft === 0 ? "1" : "0"} />
        </svg>
      </div>
    );
  };

  // Fonction pour rendre le clavier virtuel
  const renderKeyboard = () => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
    
    return (
        <div className="keyboard">
          {alphabet.map((char) => {
            const isGuessed = currentGame?.guessedLetters?.includes(char);
            return (
              <button
                key={char}
                onClick={() => {
                  setLetter(char);
                  document.getElementById('letter-form').requestSubmit();
                }}
                disabled={isGuessed || currentGame?.status !== 'ongoing' || loading}
                className={`key ${isGuessed ? 'guessed' : ''}`}
              >
                {char}
              </button>
            );
          })}
        </div>
      );
    };

  return (
    <>
    <Navbarr></Navbarr>
    <div className="pendu-container">
      <h1>Jeu du Pendu</h1>
      <div className="score-display">Score: {score}</div>
      
      {currentGame && (
        <div className="game-area">
          {/* Zone de dessin du pendu */}
          {drawHangman(currentGame.attemptsLeft)}
          
          {/* Affichage du mot masqué */}
          <div className="word-display">
            {currentGame.maskedWord.split('').map((char, index) => (
              <span key={index} className="letter-box">
                {char}
              </span>
            ))}
          </div>
          
          {/* Affichage des informations de jeu */}
          <div className="game-info">
            <p>Tentatives restantes: <strong>{currentGame.attemptsLeft}</strong></p>
            <p>Lettres déjà essayées: <strong>{currentGame.guessedLetters.split('').join(', ')}</strong></p>
            <p className="game-message">{message}</p>
          </div>
          
          {/* Formulaire pour deviner une lettre */}
          <form id="letter-form" onSubmit={guessLetter} className="guess-form">
            <input
              type="text"
              value={letter}
              onChange={(e) => setLetter(e.target.value.toLowerCase())}
              maxLength="1"
              placeholder="Entrez une lettre"
              disabled={currentGame.status !== "ongoing" || loading}
            />
            <button 
              type="submit" 
              disabled={currentGame.status !== "ongoing" || loading}
              className="guess-button"
            >
              Deviner
            </button>
          </form>
          
          {/* Clavier virtuel */}
          {renderKeyboard()}
          
          {/* Affichage du statut final */}
          {currentGame.status !== "ongoing" && (
            <div className={`game-over ${currentGame.status}`}>
              <p>{message}</p>
              <button onClick={startNewGame} className="new-game-button">
                Nouvelle partie
              </button>
            </div>
          )}
        </div>
      )}
      
      {!currentGame && !loading && (
        <button onClick={startNewGame} className="new-game-button">
          Commencer une partie
        </button>
      )}
      
      {loading && <div className="loading">Chargement...</div>}
    </div>
    </>
  );
}

export default Hangman;