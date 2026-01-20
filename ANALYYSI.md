## Mitä Tekoäly teki hyvin?
Käytin tehtävässä Claude AI:ta. API:n endpointit olivat oikein toteutettu (POST, DELETE, GET).
HTTP-koodit olivat myös oikein, toki jouduin tarkistamaan ne netistä, koska en ollut varma kaikista.
Päällekkäisyystarkistus toimii oikein. Yleisesti tehtävänannossa vaaditut toimintalogiikat täyttyvät.
Halusin käyttää tehtävässä localstoragea ja AI toteutti myös sen.

## Mitä tekoäly teki huonosti?
Ehdotti monimutkaista refaktorointia, tehtävä on mielestäni lyhyt eikä vaadi sitä. Päivämäärän käsittely oli aluksi hieman puutteellista.
Tyylillisiä virheitä löytyi esim. if-lauseesta.
Muuttujien nimet olivat mielestäni hieman epäselviä useammassa kohdassa.

## Mitkä olivat tärkeimmät parannukset, jotka teit tekoälyn tuottamaan koodiin ja miksi?
**Päivämäärän validointi**: Lisäsin `isNaN(start.getTime())` ja `isNaN(end.getTime())` tarkistuksen estämään virheelliset päivämäärät, koska Javascriptin `new Date()`on liian salliva. Ilman tarkistusta virheelliset päivämäärät menevät läpi ja sitä myötä aiheuttaisi ongelmia myöhemmin.

**Päivämäärän normalisointi UTC-aikaan**: Lisäsin `toISOString()` muunnoksen ennen kantaan tallentamista (`startIso`, `endIso`). Tämä varmistaa että päivämäärät tallennetaan yhtenäisessä UTC-muodossa riippumatta siitä, missä aikavyöhykkeessä käyttäjä on.

**Selkeämmät muuttujanimet**: Muutin globaalin `id` muuttujan nimeksi `nextReservationId` ja DELETE-endpointin `id`:n nimeksi `reservationId`. Tämä poistaa konfliktit ja tekee koodista helpommin ymmärrettävän. Heti näkee että kyseessä on varauksen ID, ei esimerkiksi huoneen ID.

**roomIdValue tyyppimuunnos**: Lisäsin `String(roomId)` tyyppimuunnoksen varmistaakseni että roomId on aina string-tyyppiä vertailuissa.

**Yksinkertaisuus**: Tekoäly ehdotti validointien erottamista omiin funktioihin, mutta pidin koodin yksinkertaisena ilman erillistä refaktorointia. Mielestäni tälläinen lyhyempi koodi on helpompi ymmärtää kokonaisuutena.

**Oppiminen**: Tärkein oppini tässä oli että tekoäly antaa hyvän perustan, mutta kriittinen ajattelu on välttämätöntä. Tekoäly ehdotti "best practice" ratkaisuja jotka eivät sopineet tähän yksinkertaiseen tehtävään.