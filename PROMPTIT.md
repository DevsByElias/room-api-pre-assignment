Toteuta yksinkertainen kokoushuoneiden varaus-API node.js ja Express. Muutamat tekniset vaatimukset: POST /reservations (tällä luodaan varaus), DELETE /reservations/{id} (varauksen peruminen) ja GET /rooms/{room_id}/reservations (varausten listaus). Liiketoiminnaliset vaatimukset: Varaukset eivät saa mennä päällekkäin, varaukset eivät saa olla menneisyydessä sekä varausten alkuaika täytyy olla ennen loppuaikaa. Lisäksi toteutuksessa haluaisin käyttää in-memory-tietokantaa. Muista, että toteutus pitää olla yksinkertainen.

Tässä yksinkertainen kokoushuoneiden varaus-API:Toteutin yksinkertainen kokoushuoneiden varaus-API:n. Tässä pääominaisuudet:

**Tekniset endpointit:**
- `POST /reservations` - Luo uusi varaus
- `DELETE /reservations/:id` - Peruu varauksen
- `GET /rooms/:roomId/reservations` - Listaa huoneen varaukset

**Liiketoimintalogiikka:**
- ✅ Ei päällekkäisiä varauksia samaan huoneeseen
- ✅ Ei varauksia menneisyyteen
- ✅ Alkuajan täytyy olla ennen loppuaikaa

**Testaus:**

```bash
# Luo varaus
curl -X POST http://localhost:3000/reservations \
  -H "Content-Type: application/json" \
  -d '{"roomId":"101","startTime":"2026-01-20T10:00:00","endTime":"2026-01-20T11:00:00","userName":"Matti"}'

# Listaa huoneen varaukset
curl http://localhost:3000/rooms/101/reservations

# Peru varaus
curl -X DELETE http://localhost:3000/reservations/1
```

API käyttää in-memory taulukkoa tietojen tallennukseen, joten data katoaa kun palvelin sammutetaan.

Lisää http-pyyntöön POST /reservations uusi muuttuja roomTitle. Refaktoroi koodi toimimaan uudella muuttujalla

Valmis! Lisäsin `roomTitle`-kentän POST-pyyntöön. Nyt varauksen luominen vaatii huoneen nimen lisäksi myös huoneen otsikon.

**Päivitetty testaus:**

```bash
# Luo varaus uudella roomTitle-kentällä
curl -X POST http://localhost:3000/reservations \
  -H "Content-Type: application/json" \
  -d '{"roomId":"101","roomTitle":"Neukkarisali","startTime":"2026-01-20T10:00:00","endTime":"2026-01-20T11:00:00","userName":"Matti"}'
```

Vastaus sisältää nyt myös `roomTitle`-kentän:

```json
{
  "id": 1,
  "roomId": "101",
  "roomTitle": "Neukkarisali",
  "startTime": "2026-01-20T10:00:00",
  "endTime": "2026-01-20T11:00:00",
  "userName": "Matti"
}
```