import React, { useState, useEffect } from "react";
import "../styles/Hangman.css";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";
import {useNavigate} from "react-router-dom"
import Navbarr from '../components/Navbar';
import { getUser } from "../api"
import avatar1 from './avatars/edfirmi.jpeg';
import avatar2 from './avatars/jfazi.jpeg';
import avatar3 from './avatars/ychirouz.jpeg';
import avatar4 from './avatars/tpenalba.jpeg';

function Hangman() {
  const navigate = useNavigate();

  // États du jeu
  const userToken = localStorage.getItem(ACCESS_TOKEN);
  const [currentGame, setCurrentGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [letter, setLetter] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [user, setUser] = useState();
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [selectedWordGroup, setSelectedWordGroup] = useState(null);
  const [miss_letter, set_miss_letter] = useState(0);
  const [find_letter, set_find_letter] = useState(0);
  const [selectedWordGroupName, setSelectedWordGroupName] = useState("Default");

  const defaultWords = ["python", "flask", "react", "javascript", "html", "css", "django", "shell", "programmation", "code"];
  const midWords = ["final fantasy", "grand theft auto", "red dead redemption", "super smash bros", "animal crossing", "uncharted", "far cry", "assassin creed", "call of duty", "five nights at freddy"];
  const hardWords = ["otorhinolaryngologiste", "anticonstitutionnellement", "cacochyme", "chlorhydrique", "dyslexie", "dithyrambe", "obnubilation", "syllogisme", "misanthrope", "philanthrope"];
  useEffect(() => {
    async function inituser() {
      const TMPuser = await getUser()
      setUser(TMPuser);
      setScore(TMPuser.hangman_score)
    }

    inituser();
  }, [])
  
  // Fonction pour démarrer une nouvelle partie
  const startNewGame = () => {
    setLoading(true);
    
    // Simuler un délai de chargement pour une meilleure expérience utilisateur
    setTimeout(() => {
      // Choisir un mot aléatoire
      let randomWord;
      if (score < 150) {
        randomWord = selectedWordGroup[Math.floor(Math.random() * selectedWordGroup.length)];
      } else if (score >= 150 && score < 250) {
        randomWord = selectedWordGroup[Math.floor(Math.random() * selectedWordGroup.length)];
      } else {
        randomWord = selectedWordGroup[Math.floor(Math.random() * selectedWordGroup.length)];
      }
    
      //const randomWord = defaultWords[Math.floor(Math.random() * defaultWords.length)];
      
      // Créer un nouveau jeu avec les mêmes propriétés que le backend
      const newGame = {
        id: Date.now(), // Identifiant unique
        maskedWord: randomWord.split('').map(letter => letter === ' ' ? ' ' : '_').join(''),
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

  const getMaskedWord = (word, guessedLetters) => {
    return word.split('').map(letter => 
      letter === ' ' ? ' ' : guessedLetters.includes(letter) ? letter : "_"
    ).join('');
  };
  /*const getMaskedWord = (word, guessedLetters) => {
    return word.split('').map(letter => 
      guessedLetters.includes(letter) ? letter : "_"
    ).join('');
  };*/

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
        set_find_letter(find_letter + 1);
      } else {
        updatedGame.attemptsLeft -= 1;
        set_miss_letter(miss_letter + 1);
      }
      
      // Vérifier si la partie est gagnée
      const isWordGuessed = !updatedGame.maskedWord.includes("_");
      
      if (isWordGuessed) {
        updatedGame.status = "won";
        // Bonus pour avoir complété le mot
        pointsEarned += 10;
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
        await axios.post('api/user/addScoreHangman/', {userToken, score, result: "VICTOIRE", find_letter, miss_letter});
        await axios.post('api/user/addHangmanStats/', {userToken, word: currentGame.word, finded: 1, date: getDate(), word_group: selectedWordGroupName, skin: selectedAvatar});

      } else if (updatedGame.status === "lost") {
        setMessage(`Dommage ! Le mot était : ${updatedGame.word}`);
        await axios.post('api/user/addScoreHangman/', {userToken, score, result: "DEFAITE", find_letter, miss_letter});
        await axios.post('api/user/addHangmanStats/', {userToken, word: currentGame.word, finded: 0, date: getDate(), word_group: selectedWordGroupName, skin: selectedAvatar});
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
          
          {/* Tête (conditionnelle selon si un avatar est sélectionné) */}
          {selectedAvatar && attemptsLeft < 5 ? (
            <image 
              href={selectedAvatar} 
              x="120" 
              y="50" 
              height="40" 
              width="40" 
              className="avatar-head"
              opacity={attemptsLeft < 5 ? "1" : "0"}
            />
          ) : (
            <circle cx="140" cy="70" r="20" stroke="black" strokeWidth="3" fill="transparent" 
                    opacity={attemptsLeft < 5 ? "1" : "0"} />
          )}
          
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

  function getDate() {
    const d = new Date();
		var day = d.getDate();
		if (day.toString().length == 1)
			day = '0' + day;
		var month = d.getMonth()+1;
		if (month.toString().length == 1)
			month = '0' + month;
		const year = d.getFullYear();
		const a = + d.getHours() + ':' + d.getMinutes() + '  ' + year + '-' + month + '-' + day;
    return a
  }

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
          
          {renderKeyboard()}
          
          {currentGame.status !== "ongoing" && (
            <div className={`game-over ${currentGame.status}`}>
              <p>{message}</p>
              <button onClick={startNewGame} className="new-game-button">
                Nouvelle partie
              </button>
              <button onClick={() => { window.location.reload(); }} className="new-game-button">
                Changer Options
              </button>
            </div>
          )}
        </div>
      )}
      
      {!currentGame && !loading && (
  <div className="avatar-selection-container">
    <h2>Choisissez votre avatar</h2>
    <div className="avatar-selection">
      <button 
        style={{backgroundColor: selectedAvatar == avatar1 ? "gray" : "white" }}
        onClick={() => setSelectedAvatar(avatar1)} 
        className="avatar-button"
      >
        <img src={avatar1} alt="Avatar 1" className="avatar-preview" />
        <span>Empereur des merdeux</span>
      </button>
      
      <button 
        style={{backgroundColor: selectedAvatar == avatar2 ? "gray" : "white" }}
        onClick={() => score >= 100 ? setSelectedAvatar(avatar2) : null} 
        className={`avatar-button ${score < 100 ? 'locked' : ''}`}
        disabled={score < 100}
      >
        <img 
          src={avatar2} 
          alt="Avatar 2" 
          className={`avatar-preview ${score < 100 ? 'locked-img' : ''}`} 
        />
        <span>Lutin Radin</span>
        {score < 100 && <div className="lock-overlay">Débloqué à 100 points</div>}
      </button>
      
      <button 
        style={{backgroundColor: selectedAvatar == avatar3 ? "gray" : "white" }}
        onClick={() => score >= 200 ? setSelectedAvatar(avatar3) : null} 
        className={`avatar-button ${score < 200 ? 'locked' : ''}`}
        disabled={score < 200}
      >
        <img 
          src={avatar3} 
          alt="Avatar 3" 
          className={`avatar-preview ${score < 200 ? 'locked-img' : ''}`} 
        />
        <span>Leche motte</span>
        {score < 200 && <div className="lock-overlay">Débloqué à 200 points</div>}
      </button>
      
      <button 
        style={{backgroundColor: selectedAvatar == avatar4 ? "gray" : "white" }}
        onClick={() => score >= 300 ? setSelectedAvatar(avatar4) : null} 
        className={`avatar-button ${score < 300 ? 'locked' : ''}`}
        disabled={score < 300}
      >
        <img 
          src={avatar4} 
          alt="Avatar 4" 
          className={`avatar-preview ${score < 300 ? 'locked-img' : ''}`} 
        />
        <span>Leche berde</span>
        {score < 300 && <div className="lock-overlay">Débloqué à 300 points</div>}
      </button>
    </div>

    <div className="word-selection-container">
      <h2>Choisissez le thème</h2>
      <div className="word-selection">
        <button 
          onClick={() => {setSelectedWordGroup(defaultWords); setSelectedWordGroupName('Informatique');}} 
          className="word-button"
          style={{backgroundColor: selectedWordGroupName == 'Informatique' ? "gray" : "white" }}
        >
          <div className="theme-icon">📝</div>
          <span>Easy Informatique</span>
        </button>
          
        <button 
          onClick={() => score >= 100 ? (setSelectedWordGroup(midWords), setSelectedWordGroupName('Gaming')) : null}
          className={`word-button ${score < 100 ? 'locked' : ''}`}
          disabled={score < 100}
          style={{backgroundColor: selectedWordGroupName == 'Gaming' ? "gray" : "white" }}
        >
          <div className="theme-icon">🎮</div>
          <span>Mid Gaming</span>
          {score < 100 && <div className="lock-overlay">Débloqué à 100 points</div>}
        </button>
          
        <button 
          onClick={() => score >= 300 ? (setSelectedWordGroup(hardWords), setSelectedWordGroupName('Orthographe')) : null}
          className={`word-button ${score < 300 ? 'locked' : ''}`}
          disabled={score < 300}
          style={{backgroundColor: selectedWordGroupName == 'Orthographe' ? "gray" : "white" }}
        >
          <div className="theme-icon">📚</div>
          <span>Hard Orthographe</span>
          {score < 300 && <div className="lock-overlay">Débloqué à 300 points</div>}
        </button>
      </div>
  </div>
    
    {selectedAvatar && selectedWordGroup && (
      <button onClick={startNewGame} className="new-game-button">
        Commencer une partie
      </button>
    )}
  </div>
)}
      
      {loading && <div className="loading">Chargement...</div>}
    </div>
    </>
  );
}

export default Hangman;