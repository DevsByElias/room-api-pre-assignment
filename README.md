# Kokoushuoneiden varaus-API

Yksinkertainen REST API kokoushuoneiden varauksien hallintaan. Toteutettu Node.js, Express & Claude-AI

## Ominaisuudet

- ✅ Varausten luominen
- ✅ Varausten peruminen
- ✅ Huoneen varausten listaus
- ✅ Päällekkäisten varausten esto
- ✅ Validointi (ei menneisyyteen, alkuaika ennen loppuaikaa)
- ✅ In-memory tietokanta

## Asennus ja käynnistys
```bash
# Asennukset
npm install express

# Käynnistä palvelin
node server.js
```

API käynnistyy osoitteeseen `http://localhost:3000`

## Esimerkki
```bash
# Luo varaus
curl -X POST http://localhost:3000/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "101",
    "roomTitle": "Neuvotteluhuone 22",
    "startTime": "2026-01-21T10:00:00Z",
    "endTime": "2026-01-21T11:00:00Z",
    "userName": "Elias"
  }'

# Listaa varaukset
curl http://localhost:3000/rooms/101/reservations

# Peru varaus
curl -X DELETE http://localhost:3000/reservations/1
```
## Huomioita
- Tiedot tallennetaan in-memory eli katoaa kun palvelin sammutetaan
- Päivämäärät tallennetaan UTC-muodossa
