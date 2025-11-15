import { useEffect, useState } from "react";
import { getTeams } from "../serviceAPI/dataRetriever";
import type { Team } from "../types/team";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Container,
  CircularProgress,
  Alert,
} from "@mui/material";

export default function TeamList() {
  const PATH_IMG_FLAGS = "/assets/flags/";

  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterContinents, setFilterContinents] = useState<string[]>([]);

  useEffect(() => {
    getTeams()
      .then((res) => setTeams(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  //éviter l'apparition de la barre de scroll horizontale
  useEffect(() => {
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = "auto";
    };
  }, []);

  if (loading)
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );

  if (error)
    return (
      <Container sx={{ mt: 4, fontFamily: "Montserrat, sans-serif" }}>
        <Alert severity="error">Erreur : {error}</Alert>
      </Container>
    );

  const fc_Options = Array.from(new Set(teams.map((t) => t.continent))).sort();

  const filteredTeams = teams.filter(
    (team) =>
      filterContinents.length === 0 || filterContinents.includes(team.continent)
  );

  return (
    <Box
      sx={{
        py: 4,
        px: "4vw",
        fontFamily: "Montserrat, sans-serif",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Typography variant="h4" gutterBottom textAlign="center">
        Liste des équipes participantes
      </Typography>

      {/*pour le filtre*/}
      <Box
        sx={{
          mb: 5,
          p: 3,
          bgcolor: "rgba(255,255,255,0.9)",
          borderRadius: 3,
          boxShadow: 3,
          width: "100%",
          maxWidth: 1100,
          mx: "auto",
          textAlign: "center",
          backdropFilter: "blur(8px)",
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{ color: "rgba(0, 0, 0, 0.8)" }}
        >
          Filtre par continent
        </Typography>

        <Chip
          label={`${filteredTeams.length} équipe(s) correspondante(s)`}
          color="primary"
          sx={{
            mb: 2,
            backgroundColor: "rgba(4, 86, 148, 0.8)",
            fontFamily: "Montserrat, sans-serif",
          }}
        />

        <FormControl
          fullWidth
          size="medium"
          sx={{
            mt: 2,
            backgroundColor: "white",
            borderRadius: 2,
          }}
        >
          <InputLabel>Continent(s)</InputLabel>
          <Select
            multiple
            value={filterContinents}
            onChange={(e) =>
              setFilterContinents(e.target.value as string[])
            }
            label="Continent(s)"
            renderValue={(selected) => (selected as string[]).join(", ")}
          >
            {fc_Options.map((continent) => (
              <MenuItem key={continent} value={continent}>
                {continent}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/*la liste des équipes*/}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2.5vw",
          justifyItems: "center",
          width: "100%",
          maxWidth: 1100,
          mx: "auto",
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        {filteredTeams.map((t) => (
          <Card
            key={t.id}
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: 380,
              minHeight: 220,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textAlign: "center",
              backgroundColor: "rgba(255, 255, 255, 1)",
              borderRadius: 3,
              boxShadow: 3,
            }}
          >
            <Chip
              label={`Equipe n°${t.id}`}
              size="small"
              color="primary"
              sx={{
                position: "absolute",
                top: 12,
                left: 12,
                backgroundColor: "rgba(4, 86, 148, 0.85)",
              }}
            />

            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  width: "100%",
                }}
              >
                <Box
                  component="img"
                  src={`${PATH_IMG_FLAGS}${t.code}.png`}
                  alt={t.name}
                  sx={{
                    width: 48,
                    height: 36,
                    objectFit: "contain",
                    borderRadius: 1,
                  }}
                />
                <Typography variant="h6" fontWeight="bold">
                  {t.name}
                </Typography>
              </Box>
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" fontWeight="medium">
                  Continent : {t.continent}
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                Confédération : {t.confederation}
              </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}