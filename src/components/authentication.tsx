import { Box, Typography } from "@mui/material";
import { useState, type MouseEventHandler } from "react";
import { signInGET, signInPOST, signUp } from "../serviceAPI/authenticator";
import type { User } from "../types/user";
import { dateFormatDDMMYYYY } from "./toolBox";


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


export default function Authentification () {
    // info recup de la connexion, jsp quoi mettre
    const [hasAttemptedConnection, setHasAttemptedConnection] = useState<boolean>(false);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [user, setUser] = useState<User>({ 
            firstname: "", 
            lastname: "", 
            email: "", 
            password: "", 
            birthDate: new Date(), 
        });
    
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    async function signingIn(data) {
        setHasAttemptedConnection(true);
        signInPOST(data.get("email"), data.get("password"))
            .then(async res => {
                setIsConnected(res);
                if (res) {
                    const profil = await signInGET();
                    setUser(profil); // récupère le profil
                }
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));

    }

    async function signingUp(data) {
        const buffer: User = { 
            firstname: data.get("firstname"), 
            lastname: data.get("lastname"), 
            email: data.get("email"), 
            password: data.get("password"), 
            birthDate: data.get("birthDate"), 
        }
        signUp(buffer)
            .then(async res => {
                setIsConnected(res);
                if (res) setUser(buffer); // récupère le profil
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }

    if (hasAttemptedConnection && loading) return <Box sx={style}><p>Chargement...</p></Box>;
    
    if (isConnected) 
        return (
            <Box sx={style}>
                <h2>Ravi de vous voir,<br></br> {user.firstname} {user.lastname} !</h2>
                <i>Née le {user.birthDate.toString()}</i> <br></br><br></br>
                <span>
                    <label>Email : <input type="text" value={user.email||""} readOnly/> </label> <br></br>
                </span>
            </Box>
        );
    else {
        return (
            <Box sx={style}>
                {error? <p style={{color: "red"}}>{error}</p> : null}
                <h2>Connexion :</h2>
                <form action={signingIn}>
                    <label>Email : <input required type="email" name="email"/> </label> <br></br>
                    <label>Mot de passe : <input required type="password" name="password"/> </label> <br></br> <br></br>

                    <button>Se connecter</button>
                </form>

                <h2>Inscription :</h2>
                <form action={signingUp}>
                    <label>Prénom : <input required type="text" name="firstname"/> </label> <br></br>
                    <label>Nom : <input required type="text" name="lastname"/> </label> <br></br>
                    <label>Email : <input required type="email" name="email"/> </label> <br></br>
                    <label>Mot de passe : <input required type="password" name="password"/> </label> <br></br> <br></br>
                    <label>Anniversaire : <input required type="date" name="birthDate"/> </label> <br></br>

                    <button>Se connecter</button>
                </form>
            </Box>
    );
    };
}