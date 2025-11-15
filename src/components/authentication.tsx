import { 
    Box, 
    Card, 
    CardContent, 
    Typography, 
    TextField, 
    Button, 
    Alert, 
    Container, 
    CircularProgress, 
    Divider 
} from "@mui/material";

import { useState, useEffect } from "react";
import { signInPOST, signOut, signUp } from "../serviceAPI/authenticator";
import type { User } from "../types/user";
import { dateFormatDDMMYYYY } from "../context/toolBox";
import { useAuth } from "../hook/useAuth";
import { Link, useNavigate } from "react-router-dom";

export default function Authentification() {
    const navigate = useNavigate();
    const { 
        user, 
        isAuthenticated, 
        setUser, 
        setIsAuthenticated, 
        checkAuth 
    } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

      //comme sur teamList, on évite le scroll horizontal (présent sur toutes les pages)
      useEffect(() => {
        document.body.style.overflowX = "hidden";
        return () => {
          document.body.style.overflowX = "auto";
        };
      }, []);

    async function signingIn(data) {
        setLoading(true);
        signInPOST(data.get("email"), data.get("password"))
            .then(async res => {
                if (res) {
                    setIsAuthenticated(true); //connexion
                   await checkAuth(); // récupration du profil
                }
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));

    }

    async function signingUp(data) {
        //console.log("SUBMIT SIGNUP"); debug : soucis avec MUI
        setLoading(true);
        const buffer: User = {
            firstname: data.get("firstname"),
            lastname: data.get("lastname"),
            email: data.get("email"),
            password: data.get("password"),
            birthDate: data.get("birthDate"),
            
        }
        signUp(buffer)
            .then(async res => {   
                if (res) {
                    setIsAuthenticated(true);
                    await checkAuth(); // récupère le profil
                }
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }

    async function signingOut() {
        setLoading(true);
        signOut()
            .then(res => {
                if (res) {    // si deco, clear les variables
                    setIsAuthenticated(false);
                    setUser(null); // Clear l'utilisateur (sera mis à initialUser par le Provider)
                    navigate("/", { replace: true });
                } else {
                    setError("Déconnexion API échouée.");
                }
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }

    if (loading)
        return (
            <Container sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                <CircularProgress />
            </Container>
        );

    if (isAuthenticated) //si l'utilisateur est connecté, on affiche son profil (avec possibilité de consulter les commandes passées)
        return (
            <Container
            sx={{ mt: 6, backgroundColor: "white !important", fontFamily: "Montserrat, sans-serif" }}
            maxWidth="md"
            >
                <Card
                sx={{
                    p: 3,
                    borderRadius: 2,
                    boxShadow: 2,
                    backgroundColor: "white !important",
                }}
                >
                    <CardContent>
                        {user ? (
                            <>
                                <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
                                    Ravi de vous revoir
                                </Typography>
                                <Typography variant="h6" sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}>
                                    {user.firstname} {user.lastname}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    Né(e) le <strong>{dateFormatDDMMYYYY(user.birthDate.toString())}</strong>
                                </Typography>
                                <TextField
                                    label="Email"
                                    size="small"
                                    value={user.email || ""}
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                    sx={{mb: 3, "& .MuiInputBase-root": { backgroundColor: "white" } }}
                                />
                                <Button
                                    component={Link}
                                    to="/historique"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    color="primary"
                                    sx={{ mb: 3,
                                        color: "white",
                                        backgroundColor: "primary.main",
                                        "&:hover" : {
                                            backgroundColor: "primary.dark"
                                        }
                                     }}
                                >
                                    Consulter mes commandes
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={signingOut}
                                    fullWidth
                                    size="small"
                                    color="error"
                                >
                                    Se déconnecter
                                </Button>
                            </>
                        ) : (
                            <Typography>Récupération du profil...</Typography>
                        )}
                    </CardContent>
                </Card>
            </Container>
        );

    //affichage du form de connexion ou inscription (si pas connecté)
    return (
        <Container
            sx={{ mt: 6, backgroundColor: "transparent !important", fontFamily: "Montserrat, sans-serif" }}
            maxWidth="md"
            >
            <Card
            sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: 2,
                backgroundColor: "white !important",
                }}
            >
                <CardContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "1fr auto 1fr" },
                            gap: 4,
                            alignItems: "start"
                        }}
                    >
                        {/*pour l'inscription (à gauche de tout) */}
                        <Box>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Inscription
                            </Typography>
                            <Box
                                component="form"
                                onSubmit={(e) => { //"remplace" le action=signingUp dans le form (en gros ça mettait Bad Request avant parce que le form était pas bien transmis) 
                                    e.preventDefault();
                                    const data = new FormData(e.currentTarget); //on récupère les données
                                    //console.log([...data.entries()]); //debug
                                    //console.log("birthDate =", data.get("birthDate")); //debug : voir si c'est pas le format de la date qui posait un souci
                                    signingUp(data); 
                                }}
                            >
                                <TextField
                                    fullWidth
                                    label="Prénom"
                                    name="firstname"
                                    required
                                    size="small"
                                    sx={{ mb: 3, }}
                                />
                                <TextField
                                    fullWidth
                                    label="Nom"
                                    name="lastname"
                                    required
                                    size="small"
                                    sx={{ mb: 3, }}
                                />
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    name="email"
                                    required
                                    size="small"
                                    sx={{ mb: 3, }}
                                />
                                <TextField
                                    fullWidth
                                    label="Mot de passe"
                                    type="password"
                                    name="password"
                                    required
                                    size="small"
                                    sx={{ mb: 3, }}
                                />
                                <TextField
                                    fullWidth
                                    label="Anniversaire"
                                    type="date"
                                    name="birthDate"
                                    InputLabelProps={{ shrink: true }}
                                    required
                                    size="small"
                                    inputProps={{ max: new Date().toISOString().split("T")[0] }} //éviter de mettre des dates futures, l'API apprécie pas
                                    sx={{ mb: 3, }}
                                />
                                <Button fullWidth variant="contained" size="small" type="submit">
                                    S'inscrire
                                </Button>
                            </Box>
                        </Box>
                        {/*le séparateur vertical (pour séparer les deux "blocs") */}
                        <Divider
                            orientation="vertical"
                            flexItem
                            sx={{ display: { xs: "none", md: "block" } }}
                        />

                        {/*pour la connexion (à droite du sep)*/}
                        <Box>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Connexion
                            </Typography>
                            <Box component="form" action={signingIn}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    name="email"
                                    required
                                    size="small"
                                    sx={{ mb: 3, }}
                                />
                                <TextField
                                    fullWidth
                                    label="Mot de passe"
                                    type="password"
                                    name="password"
                                    required
                                    size="small"
                                    sx={{ mb: 3, }}
                                />
                                <Button fullWidth variant="contained" size="small" type="submit">
                                    Se connecter
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
}