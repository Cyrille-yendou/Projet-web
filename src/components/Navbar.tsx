import { useState } from "react";
import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";


//PAS ENCORE INCLUSE DANS L'APP MAIS SOON TKT

const navLinks = [
  { label : "Home", path: "/" },
  { label : "Matchs", path: "/matchs" },
  { label : "Equipes", path: "/team" },
  { label : "Groupes", path: "/stadiums" },
  { label : "Billetterie", path: "/tickets" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <AppBar
      position="fixed"
      sx={{
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(8px)",
        boxShadow: "none",
      }}
    >
      <Toolbar>
        {}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Coupe du Monde 2026
        </Typography>

        {/* LIENS DESKTOP */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          {navLinks.map((link) => (
            <Button
              key={link.path}
              component={Link}
              to={link.path}
              color="inherit"
              sx={{ textTransform: "none" }}
            >
              {link.label}
            </Button>
          ))}
        </Box>

      </Toolbar>
    </AppBar>
  );
}