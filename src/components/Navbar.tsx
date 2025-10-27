import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Badge, { badgeClasses } from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonIcon from '@mui/icons-material/Person';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { useNavigate } from 'react-router-dom';

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
    ? React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
      })
    : null;
}

export default function Navbar(props: Props) {
  const navigate = useNavigate();

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
            onClick={() => navigate('/matchs')}
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

          <IconButton>
            <PersonIcon fontSize="medium" />
            <CartBadge color="primary" overlap="circular" />
          </IconButton>

        </Toolbar>
      </AppBar>
    </ElevationScroll>
  );
}