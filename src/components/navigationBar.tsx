import { cloneElement, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppBar, Backdrop, Badge, badgeClasses, Box, Button, Fade, IconButton, Modal, styled, Toolbar, useScrollTrigger } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';

import Authentification from './authentication';
import type { User } from '../types/user';
import { signInGET } from '../serviceAPI/authenticator';


interface Props {
  window?: () => Window;
  children?: React.ReactElement<{ elevation?: number }>;
}

//Gérer l'UI du panier
const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -12px;
    right: -6px;
  }
`;

//Pour faire en sorte que la navbar reste "au dessus" du contenu
function ElevationScroll(props: Props) { 
  const { children, window } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return children
    ? cloneElement(children, {
        elevation: trigger ? 4 : 0,
      })
    : null;
}

export default function NavigationBar(props: Props) {
  const navigate = useNavigate();
  
  // pour le modal de l'authentification
  const [modal, setModal] = useState(false);
  const handleModal = () => {setModal(!modal)};

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [user, setUser] = useState<User>({ 
    firstname: "", 
    lastname: "", 
    email: "", 
    password: "", 
    birthDate: new Date(), 
  });

  useEffect(() => {
    if (!isConnected) { // si on est pas déjà co avec des variables (=refresh page)
        signInGET()
            .then(res => { // voit si peux recup les infos par cookie
                setIsConnected((res != null)); // (si recup qlque chose, isConnected=true, sinon =false)
                if (res != null) setUser(res); // recup dans variables les infos utilisateurs
            })
    }
  }, []);
  

  return (
    <ElevationScroll {...props}>
      <AppBar sx={{ backgroundColor: 'rgba(61, 72, 221, 0.8)' }}>
        <Toolbar sx={{ gap: '25px' }}>
          <Button
            color="inherit"
            variant="contained"
            size="medium"
            onClick={() => navigate('/')}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                backgroundColor: '#6FB8D8',
              },
            }}
          >
            Accueil
          </Button>

          <Button 
            color="inherit" 
            variant="contained"
            size="medium"
            onClick={() => navigate('/matches')}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                backgroundColor: '#6FB8D8',
              },
            }}
          >
            Matchs
          </Button>

          <Button
            color="inherit"
            variant="contained"
            size="medium"
            onClick={() => navigate('/teams')}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                backgroundColor: '#6FB8D8',
              },
            }}
          >
            Equipes
          </Button>

          <Button
            color="inherit"
            variant="contained"
            size="medium"
            onClick={() => navigate('/groups')}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                backgroundColor: '#6FB8D8',
              },
            }}
          >
            Groupes
          </Button>

          {/* On space pour avoir les icônes tout à droite, là où c'est plus logique */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Attribut badgeContent pour afficher le contenu du panier !! (Utile pour voir les tickets qu'on va acheter !!!!!!!!) ex : badgeContent={2} => affiche le ptit 2*/}
          <IconButton>
            <ShoppingCartIcon fontSize="medium" />
            <CartBadge color="primary" overlap="circular" /> 
          </IconButton>

          <IconButton onClick={handleModal}>
            <PersonIcon fontSize="medium" />
            <CartBadge color="primary" overlap="circular" />
          </IconButton>

          <Modal open={modal} onClose={handleModal} 
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
              backdrop: {
                timeout: 500,
              },
            }}
          >
            <Fade in={modal}>
              <div>                 
                <Authentification user={user} setUser={setUser} isConnected={isConnected} setIsConnected={setIsConnected}></Authentification> 
              </div>
            </Fade>
          </Modal>

        </Toolbar>
      </AppBar>
    </ElevationScroll>
  );
}