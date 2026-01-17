const express = require('express');
const app = express();

app.use(express.json());

// In-memory tietokanta
const reservations = [];
let nextId = 1;

// POST /reservations - Luo uusi varaus
app.post('/reservations', (req, res) => {
  const { roomId, roomTitle, startTime, endTime, userName } = req.body;

  // Validoi että kaikki kentät on annettu
  if (!roomId || !roomTitle || !startTime || !endTime || !userName) {
    return res.status(400).json({ 
      error: 'roomId, roomTitle, startTime, endTime ja userName ovat pakollisia' 
    });
  }

  const start = new Date(startTime);
  const end = new Date(endTime);
  const now = new Date();

  // Tarkista että alkuaika on ennen loppuaikaa
  if (start >= end) {
    return res.status(400).json({ 
      error: 'Alkuajan täytyy olla ennen loppuaikaa' 
    });
  }

  // Tarkista että varaus ei ole menneisyydessä
  if (start < now) {
    return res.status(400).json({ 
      error: 'Varaus ei voi olla menneisyydessä' 
    });
  }

  // Tarkista päällekkäisyydet
  const hasConflict = reservations.some(current => {
    if (current.roomId !== roomId) return false;
    
    const currentStart = new Date(current.startTime);
    const currentEnd = new Date(current.endTime);
    
    return (start < currentEnd && end > currentStart);
  });

  if (hasConflict) {
    return res.status(409).json({ 
      error: 'Huone on jo varattu tälle ajanjaksolle' 
    });
  }

  // Luo varaus
  const reservation = {
    id: nextId++,
    roomId,
    roomTitle,
    startTime,
    endTime,
    userName
  };

  reservations.push(reservation);
  res.status(201).json(reservation);
});

// DELETE /reservations/:id - Peru varaus
app.delete('/reservations/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = reservations.findIndex(r => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Varausta ei löytynyt' });
  }

  reservations.splice(index, 1);
  res.status(204).send();
});

// GET /rooms/:roomId/reservations - Listaa huoneen varaukset
app.get('/rooms/:roomId/reservations', (req, res) => {
  const { roomId } = req.params;
  const roomReservations = reservations.filter(r => r.roomId === roomId);
  
  // Järjestä alkuajan mukaan
  roomReservations.sort((a, b) => 
    new Date(a.startTime) - new Date(b.startTime)
  );

  res.json(roomReservations);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API käynnissä portissa ${PORT}`);
});