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

Lisäsin koodiin virheellisen päivämäärän tarkistuksen. Koodi on seuraava: 

```javascript
  // input-päivämäärän tarkistus
  if (isNaN(start.getTime()) || isNaN(end.getTime())) 
    return res.status(400).json({
        error: 'alkuaika tai loppuaika ei ole kelvollisia'
    });
```

debugasin validointia bashilla, mutta varaus menee kuitenkin läpi startTimen ollessa väärä. Onko koodin pätkä sijoitettu väärän kohtaan? curl -i -X POST http://localhost:3000/reservations   -H "Content-Type: application/json"   -d '{
    "roomId": "101",
    "roomTitle": "Neuvotteluhuone",
    "startTime": "asdasdasd",
    "endTime": "2026-01-10T11:00:00Z",
    "userName": "Matti Meikäläinen"
  }' curl http://localhost:3000/rooms/101/reservations


Koodin sijainti vaikuttaa oikealta! Ongelma on todennäköisesti siinä, että JavaScript `new Date()` on liian salliva – se voi palauttaa "Invalid Date" -objektin, joka ei välttämättä aiheuta `NaN`:ia `getTime()`-kutsulla kaikissa tapauksissa.

Kokeilin koodiasi, ja huomasin että validointi pitäisi toimia. Tarkistetaan muutama asia:

1. **Onko validointi oikeassa kohdassa?** Sen pitäisi olla heti `new Date()` -kutsujen jälkeen, ennen muita tarkistuksia:

```javascript
const start = new Date(startTime);
const end = new Date(endTime);

// input-päivämäärän tarkistus
if (isNaN(start.getTime()) || isNaN(end.getTime())) {
  return res.status(400).json({
    error: 'alkuaika tai loppuaika ei ole kelvollisia'
  });
}

const now = new Date();
// ... loput tarkistukset
```

2. **Testaa validointia suoraan:**

```bash
# Tämän pitäisi antaa virhe
curl -i -X POST http://localhost:3000/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "101",
    "roomTitle": "Neuvotteluhuone",
    "startTime": "asdasdasd",
    "endTime": "2026-01-10T11:00:00Z",
    "userName": "Matti"
  }'
```

Jos varaus menee silti läpi, tarkista:
- Oletko käynnistänyt palvelimen uudelleen muutosten jälkeen?
- Onko validointi varmasti POST-endpointin sisällä oikeassa kohdassa?

Voisitko näyttää koko POST-endpointtisi koodi, niin voin tarkistaa missä järjestyksessä validoinnit ovat?
