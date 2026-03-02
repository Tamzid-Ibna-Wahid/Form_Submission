const express = require('express');
const app  = express();

const connection = require('./database');

// serve static assets from public folder
app.use(express.static('public'));
// middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/result', (req, res) => {
  connection.query('SELECT * FROM registrations', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching data');
    }
    res.render('result', { data: results });
  });
});

app.post('/result', (req, res) => {
  const { name, classRoll, department, year, semester, address } = req.body;

  const insertQuery = `
    INSERT INTO registrations 
    (name, classRoll, department, year, semester, address) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    insertQuery, 
    [name, classRoll, department, year, semester, address],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error inserting data');
      }

      // After insert → fetch all data
      connection.query('SELECT * FROM registrations', (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error fetching data');
        }

        // Now render result.pug with ALL data
        res.render('result', { data: results });
      });
    }
  );
});

app.post('/result/update/:id', (req, res) => {
  const id = req.params.id;
  const { name, classRoll, department, year, semester, address } = req.body;

  const updateQuery = `
    UPDATE registrations 
    SET name = ?, classRoll = ?, department = ?, year = ?, semester = ?, address = ? 
    WHERE id = ?
  `;

  connection.query(
    updateQuery, 
    [name, classRoll, department, year, semester, address, id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error updating data');
      } 
      else {
        res.redirect('/result'); // Redirect to the result page to see updated data
      }
    }
  );
});



// Delete route
app.post('/delete/:id', (req, res) => {
  const id = req.params.id;

  const deleteQuery = 'DELETE FROM registrations WHERE id = ?';
  connection.query(deleteQuery, [id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error deleting data');
    } 
    else {
      res.redirect('/result'); // Redirect to the result page to see updated data
    }
  });
});


// Edit route - to fetch data for the specific id and render the edit form
app.post('/edit/:id', (req, res) => {
  const id = req.params.id;

  const selectQuery = 'SELECT * FROM registrations WHERE id = ?';
  connection.query(selectQuery, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching data for edit');
    } 
    else {
      res.render('edit', { item: results[0] });
    }
  });
});


module.exports = app;