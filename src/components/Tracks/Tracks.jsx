import { useEffect, useState } from "react";

import Track from "../Track/Track";
import useStore from "../../utils/store";
import { fetchMetadata } from "../../utils/utils";
import TRACKS from "../../utils/TRACKS";

import fetchJsonp from "fetch-jsonp";

import s from "./Tracks.module.scss";

const getFavorites = () => {
  return JSON.parse(localStorage.getItem("favorites") || "[]");
};


const toggleFavorite = (track) => {
  const favorites = getFavorites();
  const index = favorites.findIndex((t) => t.id === track.id);
  if (index === -1) {
    favorites.push(track);
  } else {
    favorites.splice(index, 1);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
};

const Tracks = ({ setCurrentTrack }) => {
  // permet d'alterner entre true et false pour afficher / cacher le composant
  const [showTracks, setShowTracks] = useState(false);
  const { tracks, setTracks } = useStore();
  const [searchTerm, setSearchTerm] = useState("");

  const [favorites, setFavorites] = useState(getFavorites());

  const handleToggleFavorite = (track) => {
    let updatedFavorites;
  
    if (favorites.some((fav) => fav.id === track.id)) {
      updatedFavorites = favorites.filter((fav) => fav.id !== track.id);
    } else {
      updatedFavorites = [...favorites, track];
    }
  
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };
  

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);
  

  // écouter la variable tracks qui vient du store
  useEffect(() => {
    if (tracks.length > TRACKS.length) {
      setShowTracks(true);
    }
  }, [tracks]);

  // TODO : Slider (infini ou non) pour sélectionner les tracks

  // TODO : Fonction de tri / filtre sur les tracks, par nom, durée...

  // TODO : Récupérer les tracks du store

  useEffect(() => {
    fetchMetadata(TRACKS, tracks, setTracks);
  }, []);

  const onKeyDown = (e) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      getSongs(searchTerm);
      setSearchTerm(""); // reset l'input après la recherche
    }
  };
  

  const getSongs = async (userInput) => {
    let response = await fetchJsonp(
      `https://api.deezer.com/search?q=${userInput}&output=jsonp`
    );
  
    if (response.ok) {
      response = await response.json();
  
      // Si les données sont récupérées, mets-les à jour dans le store
      const newTracks = response.data;
  
      // Mettre à jour les `tracks` dans le store global
      setTracks(newTracks);
  
      console.log("Nouveaux tracks : ", newTracks);
    } else {
      console.error("Erreur lors de la récupération des données");
    }
  };
  

  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

// Affichage des tracks selon la recherche
const displayedTracks = searchTerm
  ? tracks.filter((track) =>
      track.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : tracks;  // Afficher tous les tracks si pas de recherche

// Affichage des favoris
const displayedFavorites = favorites; // Tous les favoris, peu importe la recherche



  return (
    <>
      <div className={s.toggleTracks} onClick={() => setShowTracks(!showTracks)}>
  tracklist
</div>

<section className={`${s.wrapper} ${showTracks ? s.wrapper_visible : ""}`}>
  <div className={s.tracks}>
    <div className={s.header}>
      <span className={s.order}>#</span>
      <span className={s.title}>Titre</span>
      <span className={s.duration}>Durée</span>
    </div>

    {showOnlyFavorites
      ? displayedFavorites.map((track, i) => {
          return (
            <div key={track.id}>
              <Track
                title={track.title}
                duration={track.duration}
                cover={track.album.cover_xl}
                src={track.preview}
                index={i}
                onSelect={() =>
                  setCurrentTrack({
                    key: track.title + i,
                    title: track.title,
                    src: track.preview,
                    cover: track.album.cover_xl,
                    duration: track.duration,
                    id: track.id,
                  })
                }
              />
              <button
                className={s.favButton}
                onClick={() => handleToggleFavorite(track)}
                title="Ajouter aux favoris"
              >
                💖
              </button>
            </div>
          );
        })
      : displayedTracks.map((track, i) => {
          const isFav = favorites.some((fav) => fav.id === track.id);
          return (
            <div key={track.title + i}>
              <Track
                title={track.title}
                duration={track.duration}
                cover={track.album.cover_xl}
                src={track.preview}
                index={i}
                onSelect={() =>
                  setCurrentTrack({
                    key: track.title + i,
                    title: track.title,
                    src: track.preview,
                    cover: track.album.cover_xl,
                    duration: track.duration,
                    id: track.id,
                  })
                }
              />
              <button
                className={s.favButton}
                onClick={() => handleToggleFavorite(track)}
                title="Ajouter aux favoris"
              >
                {isFav ? "💖" : "🤍"}
              </button>
            </div>
          );
        })}
  </div>

  <input
  type="text"
  placeholder="Chercher un artiste"
  className={s.searchInput}
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  onKeyDown={onKeyDown}
/>

  <button
  className={s.favToggleButton}
  onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
>
  {showOnlyFavorites ? "Afficher tout" : "Afficher les favoris"}
</button>

</section>

    </>
  );
};

export default Tracks;
