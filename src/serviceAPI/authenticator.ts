import { Password } from "@mui/icons-material";
import type { User } from "../types/user";


const API_REST  = "https://worldcup2026.shrp.dev"; 

// Connexion au compte et recup de token
export async function signInPOST(email: string, password: string): Promise<boolean> {
    console.log("Appel API - signInPOST() ");
    const res = await fetch(`${API_REST}/auth/signin`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email: email, password: password})
    });
    if (!res.ok) throw new Error("Erreur HTTP "+ res.status); // erreur lors du chargement
    const data = await res.json();
    //console.log(data);
    return data.success;
}

// Recup infos du compte 
export async function signInGET(): Promise<User> {
    console.log("Appel API - signInGET() ");
    const res = await fetch(`${API_REST}/auth/me`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        }
    });
    //if (!res.ok) throw new Error("Erreur HTTP "+ res.status); // erreur lors du chargement
    const data = await res.json();
    //console.log(data);
    //await new Promise(resolve => setTimeout(resolve, 5000)); test chargement
    return data.data;
}

// Création de compte
export async function signUp(user: User): Promise<boolean> {
  console.log("Appel API - signUp() "+user.password);
  const res = await fetch(`${API_REST}/auth/signup`, {
    method: "POST",
    credentials: "include",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    },
    body: JSON.stringify({
        firstname: user.firstname, 
        lastname: user.lastname, 
        email: user.email, 
        password: user.password, 
        birthDate: user.birthDate
    })
  });
  if (!res.ok) throw new Error("Erreur HTTP "+ res.status); // erreur lors du chargement
  const data = await res.json();
  return data.success;
}


// Déconnexion au compte
export async function signOut(): Promise<boolean> {
    console.log("Appel API - signOut() ");
    const res = await fetch(`${API_REST}/auth/signout`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        }
    });
    if (!res.ok) throw new Error("Erreur HTTP "+ res.status); // erreur lors du chargement
    const data = await res.json();
    return data.success;
}