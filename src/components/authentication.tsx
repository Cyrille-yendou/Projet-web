import { Box, Typography } from "@mui/material";
import { useEffect, useState, type MouseEventHandler } from "react";
import {  signInPOST, signOut, signUp } from "../serviceAPI/authenticator";
import type { User } from "../types/user";
import { dateFormatDDMMYYYY } from "./toolBox";
import { useAuth } from "../hook/useAuth";
import { Link, useNavigate } from "react-router-dom";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
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

    if (loading) return <Box sx={style}><p>Chargement...</p></Box>;

    if (isAuthenticated)
        return (
            <Box sx={style}>
                {user &&(
                    <>  
                <h2>Ravi de vous voir,<br></br> {user.firstname} {user.lastname} !</h2>
                <span>
                    <i>Née le {dateFormatDDMMYYYY(user.birthDate.toString())}</i> <br></br><br></br>
                    <label>Email : <input type="text" value={user.email || ""} readOnly /> </label> <br></br> <br></br>
                </span>
                <Link 
                    to="/historique" 
                    style={{ 
                    display: 'block', 
                    marginBottom: '10px', 
                    color: '#1976D2', 
                    textDecoration: 'underline' 
                    }}
                    >
                        🧾 Consulter mes commandes
                    </Link>
                <button onClick={signingOut}>Se déconnecter</button>
                </>
                )}
                {!user && <p>Récupération du profil...</p>}
            </Box>
        );
    else {
        return (
            <Box sx={style}>
                {error ? <p style={{ color: "red" }}>{error}</p> : null}
                <h2>Connexion :</h2>
                <form action={signingIn}>
                    <label>Email : <input required type="email" name="email" /> </label> <br></br>
                    <label>Mot de passe : <input required type="password" name="password" /> </label> <br></br> <br></br>

                    <button>Se connecter</button>
                </form>

                <h2>Inscription :</h2>
                <form action={signingUp}>
                    <label>Prénom : <input required type="text" name="firstname" /> </label> <br></br>
                    <label>Nom : <input required type="text" name="lastname" /> </label> <br></br>
                    <label>Email : <input required type="email" name="email" /> </label> <br></br>
                    <label>Mot de passe : <input required type="password" name="password" /> </label> <br></br> <br></br>
                    <label>Anniversaire : <input required type="date" name="birthDate" /> </label> <br></br>

                    <button>S'inscrire</button>
                </form>
            </Box>
        );
    };
}