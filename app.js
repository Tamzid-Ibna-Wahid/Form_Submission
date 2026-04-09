const express = require('express');
const app  = express();

const { engine } = require('express-handlebars');
app.engine('handlebars', engine({ defaultLayout: false }));


const connection = require('./database');

// serve static assets from public folder
app.use(express.static('public'));
// middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.set('view engine', 'handlebars');
app.set('views', './views');

// start
app.get('/', (req, res) => {
    res.render('index');
});

// Result show
app.get('/result', (req, res) => {
  connection.query('SELECT * FROM registrations', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching data');
    }
    res.render('result', { data: results });
  });
});

// Form er post handle
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
      
      // show all data
      connection.query('SELECT * FROM registrations', (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error fetching data');
        }

        // Now render ALL data
        res.render('result', { data: results });
      });
    }
  );
});


// update handle
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
        res.redirect('/result'); // Redirect to the result page
      }
    }
  );
});



// Delete handle
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


// Edit handle 
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

// search handle
app.get('/search', (req, res) => {
  const { name } = req.query;

  if (!name || name.trim() === '') {
    return res.redirect('/result');
  }

  const searchQuery = `
    SELECT * FROM registrations
    WHERE name LIKE ?`;
  connection.query(searchQuery, [`%${name}%`], (err, results) => {   // % → any number of characters  
    if (err) {
      console.error(err);
      return res.status(500).send('Error searching data');
    }
    else {
      res.render('result', { data: results, searchTerm: name });
    }
  });
});



module.exports = app;