import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Box, Typography, Toolbar, CssBaseline } from "@mui/material";
import MatchesList from "./MatchList";
import MatchDetails from "./MatchDetails";
import Navbar from "./Navbar";

// Import des images de fond
import football1 from "../assets/images/football1.jpg";
import football2 from "../assets/images/football2.jpg";
import football3 from "../assets/images/football3.png";

const IMAGES = [football1, football2, football3];
const ROTATION_INTERVAL = 4000; // 4 secondes

function HomePage() {
  return (
    <>
      <Typography
        variant="h3"
        sx={{
          fontWeight: "bold",
          textShadow: "0 2px 8px rgba(0,0,0,0.6)",
          fontFamily: "Montserrat, sans-serif",
          mb: 2,
        }}
      >
        Coupe du Monde 2026
      </Typography>
      <Typography
        variant="h6"
        sx={{
          maxWidth: 700,
          textShadow: "0 2px 6px rgba(0,0,0,0.5)",
          fontFamily: "Montserrat, sans-serif",
          mb: 4,
        }}
      >
        Vivez des émotions fortes avec la Coupe du Monde de Football 2026
      </Typography>
    </>
  );
}

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Rotation des images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }, ROTATION_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        minHeight: "100vh",
        overflow: "auto",
        margin: 0,
        padding: 0,
      }}
    >
      <CssBaseline />
      
      {/* Navbar fixe */}
      <Navbar />
      
      {/* Espace pour la navbar */}
      <Toolbar />

      {/* Style de l'arrière-plan (pour que les images tournent) */}
      {IMAGES.map((src, index) => (
        <Box
          key={src}
          sx={{
            position: "fixed",
            inset: 0,
            width: "100vw",
            height: "100vh",
            backgroundImage: `url(${src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: index === currentIndex ? 1 : 0,
            transform: index === currentIndex ? "scale(1.05)" : "scale(1)",
            filter: "blur(2px) brightness(0.7)",
            transition: "opacity 1.2s ease-in-out, transform 6s ease-in-out",
            zIndex: -2,
          }}
        />
      ))}

      {/* Dégradé pour éviter que les images accaparent toute l'attention */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.8))",
          zIndex: -1,
        }}
      />

      {/* Centre le contenu */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          minHeight: "calc(100vh - 64px)",
          width: "100%",
          color: "white",
          px: 2,
          py: 4,
        }}
      >
        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/matchs" element={<MatchesList />} />
          <Route path="/match/:id" element={<MatchDetails />} />
        </Routes>
      </Box>
    </Box>
  );
}