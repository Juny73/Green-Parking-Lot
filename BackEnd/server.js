const app = require('./app');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Green Parking Lot en http://localhost:${PORT}`);
});
