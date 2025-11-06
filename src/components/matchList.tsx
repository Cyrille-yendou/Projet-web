import { useEffect, useState } from "react";
import { getGroups, getMatches, getTeams } from "../serviceAPI/dataRetriever";
import type { Match } from "../types/match";
import type { Team } from "../types/team";
import type { Group } from "../types/group";
import { Link } from "react-router-dom";
import { dateFormatDDMMYYYY } from "./toolBox";
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Container,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Stadium, CalendarToday, AccessTime } from "@mui/icons-material";

export default function MatchList() {

  //Chemin vers les png des drapeaux, dans le dossier public assets car sinon fallait tout importer à la main
  const PATH_IMG_FLAGS = "/assets/flags/"; //Dans le dossier public, on peut direct "lire" le contenu, pas d'import

  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [fd_Boundary, set_fd_Boundary] = useState<string[]>([]);
  const [fg_Options, set_fg_Options] = useState<Group[]>([]);
  const [ft_Options, set_ft_Options] = useState<Team[]>([]);

  const [filterDate, setFilterDate] = useState<string>("");
  const [filterGroups, setFilterGroups] = useState<string[]>([]);
  const [filterTeams, setFilterTeams] = useState<string[]>([]);

  let filteredMatches = matches
    .filter(
      (match) =>
        filterTeams.length === 0 ||
        filterTeams.includes(match.homeTeam.name) ||
        filterTeams.includes(match.awayTeam.name)
    )
    .filter(
      (match) =>
        filterGroups.length === 0 ||
        filterGroups.includes(match.homeTeam.groupId.toString())
    )
    .filter(
      (match) =>
        filterDate.length === 0 ||
        filterDate.includes(match.date.toString().substring(0, 10))
    );

  const getMatchTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const controller = new AbortController();
    getMatches()
      .then((res) => {
        const cleanedMatches = res.data.filter(
          (match: { status: string }) => match.status === "scheduled"
        );
        const min: string = cleanedMatches[0].date.substring(0, 10);
        const max: string =
          cleanedMatches[cleanedMatches.length - 1].date.substring(0, 10);
        set_fd_Boundary([min, max]);
        setMatches(cleanedMatches);
      })
      .catch((err) => setError(err.message));

    getTeams()
      .then((res) => set_ft_Options(res.data))
      .catch((err) => setError(err.message));

    getGroups()
      .then((res) => set_fg_Options(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    return () => {
      controller.abort();
    };
  }, []);

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
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Erreur : {error}</Alert>
      </Container>
    );

  return (
    <Box
      sx={{
        py: 4,
        width: "100%",
        px: "4vw",
        overflowX: "hidden",
      }}
    >
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{
          mb: 4,
          textAlign: "center",
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        Liste des matchs
      </Typography>

      {/*filtres (groupes, équipes, dates) */}
      <Box
        sx={{
          mb: 5,
          p: 3,
          bgcolor: "rgba(255,255,255,0.9)",
          borderRadius: 3,
          boxShadow: 3,
          width: "100%",
          backdropFilter: "blur(8px)",
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          color="black"
          sx={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Filtres
        </Typography>
        <Chip
          label={`${filteredMatches.length} match(s) correspondant(s)`}
          color="primary"
          sx={{
            mb: 2,
            backgroundColor: "rgba(4, 86, 148, 0.8)",
            fontFamily: "Montserrat, sans-serif",
          }}
        />

        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          <TextField
            fullWidth
            type="date"
            onChange={(e) => setFilterDate(e.target.value)}
            sx={{ flex: 1, minWidth: "250px" }}
          />
          <FormControl fullWidth sx={{ flex: 1, minWidth: "250px" }}>
            <InputLabel>Groupe(s)</InputLabel>
            <Select
              multiple
              value={filterGroups}
              onChange={(e) => setFilterGroups(e.target.value)}
              label="Groupe(s)"
              renderValue={(selected) =>
                selected
                  .map(
                    (s) =>
                      `Groupe ${
                        fg_Options.find((g) => g.id.toString() === s)?.name
                      }`
                  )
                  .join(", ")
              }
            >
              {fg_Options.map((g) => (
                <MenuItem key={g.id} value={g.id.toString()}>
                  Groupe {g.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ flex: 1, minWidth: "250px" }}>
            <InputLabel>Équipe(s)</InputLabel>
            <Select
              multiple
              value={filterTeams}
              onChange={(e) => setFilterTeams(e.target.value)}
              label="Équipe(s)"
              renderValue={(selected) => selected.join(", ")}
            >
              {ft_Options.map((t) => (
                <MenuItem key={t.id} value={t.name}>
                  <Box
                    component="img"
                    src={`${PATH_IMG_FLAGS}${t.code}.png`}
                    alt={t.name}
                    sx={{
                      width: 24,
                      height: 18,
                      objectFit: "contain",
                      mr: 1,
                    }}
                  />
                  {t.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/*les cartes pour les matchs*/}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
          gap: "2.5vw",
          justifyItems: "center",
          width: "100%",
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        {filteredMatches.map((m) => (
          <Card
            key={m.id}
            component={Link}
            to={`/matches/${m.id}`}
            sx={{
              width: "100%",
              maxWidth: 500,
              minHeight: 280,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              textDecoration: "none",
              transition: "transform 0.2s, box-shadow 0.2s",
              backgroundColor: "rgba(255, 255, 255, 1)",
              borderRadius: 3,
              boxShadow: 3,
              "&:hover": {
                transform: "translateY(-6px)",
                boxShadow: 6,
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Chip label={`Match n°${m.id}`} size="small" color="primary" />
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CalendarToday sx={{ fontSize: 16 }} />
                  <Typography variant="body2" color="rgba(102, 102, 102, 1)">
                    {dateFormatDDMMYYYY(m.date)}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  my: 3,
                }}
              >
                {/* le contenu de l'équipe à domicile */}
                <Box sx={{ textAlign: "center", flex: 1 }}>
                  <Box
                    component="img"
                    src={`${PATH_IMG_FLAGS}${m.homeTeam.code}.png`}
                    alt={m.homeTeam.name}
                    sx={{
                      width: 64,
                      height: 48,
                      objectFit: "contain",
                      mb: 0.5,
                    }}
                  />
                  <Typography variant="body1" fontWeight="bold">
                    {m.homeTeam.name}
                  </Typography>
                </Box>

                <Typography variant="h6" sx={{ mx: 2, color: "rgba(153, 153, 153, 1)" }}>
                  VS
                </Typography>

                {/*pour l'équipe qui vient (extérieur)*/}
                <Box sx={{ textAlign: "center", flex: 1 }}>
                  <Box
                    component="img"
                    src={`${PATH_IMG_FLAGS}${m.awayTeam.code}.png`}
                    alt={m.awayTeam.name}
                    sx={{
                      width: 64,
                      height: 48,
                      objectFit: "contain",
                      mb: 0.5,
                    }}
                  />
                  <Typography variant="body1" fontWeight="bold">
                    {m.awayTeam.name}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ borderTop: 1, borderColor: "divider", pt: 2, mt: 2 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <AccessTime sx={{ fontSize: 18, color: "text.secondary" }} />
                  <Typography variant="body2" color="#666">
                    {getMatchTime(m.date)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Stadium sx={{ fontSize: 18, color: "text.secondary" }} />
                  <Typography variant="body2" color="#666">
                    {m.stadium.name}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}