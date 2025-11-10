import { useEffect, useState } from "react";
import { getGroups } from "../serviceAPI/dataRetriever";
import type { Group } from "../types/group";
import { Card, CardContent, Typography, Box, Select, MenuItem, FormControl, InputLabel, Chip, Container, CircularProgress, Alert, } from "@mui/material";

export default function GroupList() {
  const PATH_IMG_FLAGS = "/assets/flags/";

  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterGroup, setFilterGroup] = useState("");

  useEffect(() => {
    getGroups()
      .then((res) => setGroups(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  //comme sur teamList, on évite le scroll horizontal (présent sur toutes les pages)
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

  const filteredGroups = groups.filter(
    (g) =>
      filterGroup === "" ||
      g.name.toLowerCase().includes(filterGroup.toLowerCase())
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
        Liste des groupes
      </Typography>

      {/*l'ui du filtre (comme d'hab)*/}
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
          Filtre par nom de groupe
        </Typography>

        <Chip
          label={`${filteredGroups.length} groupe(s) correspondant(s)`}
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
          <InputLabel>Nom du groupe</InputLabel>
          <Select
            value={filterGroup}
            label="Nom du groupe"
            onChange={(e) => setFilterGroup(e.target.value)}
          >
            <MenuItem value="">Tous les groupes</MenuItem>
            {groups.map((g) => (
              <MenuItem key={g.id} value={g.name}>
                Groupe {g.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/*les card pour lister les diff groupes*/}
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
        {filteredGroups.map((g) => (
          <Card
            key={g.id}
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
              label={`Groupe ${g.name}`}
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
                  flexDirection: "column",
                  gap: 1.5,
                  alignItems: "flex-start",
                }}
              >
                {g.teams.map((team) => (
                  <Box
                    key={team.code}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      width: "100%",
                    }}
                  >
                    <Box
                      component="img"
                      src={`${PATH_IMG_FLAGS}${team.code}.png`}
                      alt={team.name}
                      sx={{
                        width: 36,
                        height: 26,
                        objectFit: "contain",
                        borderRadius: 1,
                      }}
                    />
                    <Typography variant="body1" fontWeight="bold">
                      {team.name}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
