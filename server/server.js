const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2');
const { Result } = require('postcss');
const crypto = require("crypto");
const bcrypt = require('bcryptjs');
const { error } = require('console');
const app = express(); 
const port = 5000;
const fs = require('fs');
app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000', // Client origin
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(bodyParser.json());
// Serve static files from the "client" folder
app.use(express.static(path.join(__dirname, 'src')));
app.use(express.json());

// Database connection setup
const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'rentaware',
});


// Handle request to retrieve details of purchases
app.get('/api/purchaseinfo', (req, res) => {
    const getInfoForPurchases = 'SELECT purchase_id, product_name, selected_quantity, purchase_email FROM purchases'; 
    db.query(getInfoForPurchases, (err, results) => {
        if(err){
            console.error('Unable to get purchases data'); 
        }
        res.json(results); 
        console.log('Data successfully retrieved from purchases table'); 
    })
})


// Handle request to retrieve rental purchases details 
app.get('/api/rentalinfo', (req, res) => {
    const getInfoForRentals = 'SELECT rental_id, product_name, selected_quantity, rental_email FROM rental_purchases'
    db.query(getInfoForRentals, (err, result) => {
        if(err) {
            console.error('Unable to get rentals data'); 
        }
        res.json(result); 
        console.log('Data successfully retrieved from rental_purchases table'); 
    })

})


// Handle request to retrieve account info
app.get('/api/accountinfo', (req, res) => {
    const getInfoFromQuotation = `SELECT quotation_id, date_of_creation, productid_combination, quotation_quantity, quotation_email FROM quotation`;
    db.query(getInfoFromQuotation, (err, results) => {
        if (err) {
            console.error('Unable to get id data: ', err);
        }
        res.json(results);
        console.log('Data successfully retrieved from quotation list.');
    })

})


// Handle purchase request 
app.post('/api/purchase', (req, res) => {
    console.log('Received /api/purchase with body: ', req.body);

    const { email, productId, productName, productPrice, selectedQty, totalAmount, companyName, contactNumber, addressLine1, addressLine2 } = req.body;

    if (!email || !productId || !productName || !totalAmount || !companyName || !contactNumber || !addressLine1 || !addressLine2 || !selectedQty || !productPrice) {
        console.error('Missing some data');
        return res.status(400).send('Missing some data');
    }

    // Code to further process the received data 
    const newEmail = email.slice(1, -1);

    const purchase = `INSERT INTO purchases(product_id, product_name, product_price, selected_quantity, total_amount, company_name, contact_number, address_line_1, address_line_2, purchase_email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(purchase, [productId, productName, productPrice, selectedQty, totalAmount, companyName, contactNumber, addressLine1, addressLine2, newEmail], (err, results) => {
        if (err) {
            console.error('Unable to insert data into purchase table: ', err);
            return res.status(500).send('Cannot insert data into purchase table');
        }
        console.log('Data successfully inserted into purchase table');


        // Get latest id from purchase table 
        const getLatestIdForPurchase = `SELECT id FROM purchases ORDER BY id DESC LIMIT 1`;
        db.query(getLatestIdForPurchase, (err, result) => {
            if (err) {
                console.error('Unable to get id data: ', err);
            }

            console.log('Data successfully obtained from purchases table');

            const latestId = result[0].id;

            // Function to change id into rental_id
            function createRentalId(id) {
                return 'PU' + id.toString().padStart(3, '0');
            }

            let purchaseId;
            if (result.length > 0) {
                purchaseId = createRentalId(latestId);
            }

            console.log('This is the latest purchase_id generated: ', purchaseId);

            // Update purchase table with purchase_id 
            const updatePurchaseTable = `UPDATE purchases SET purchase_id = ? WHERE id = ?`;
            db.query(updatePurchaseTable, [purchaseId, latestId], (err, results) => {
                if (err) {
                    console.error("Unable to update purchases table.");
                } else {
                    console.log("Updated purchases table successfully!");
                }
            })


        })


    })

})


// Handle rental request
app.post('/api/rentalrequest', (req, res) => {
    console.log('Received /api/rentalrequest with body: ', req.body);

    // Get data from request body 
    const { email, productId, productName, startDate, endDate, numberOfDays, costPerDay, totalCosts, companyName, contactNumber, addressLine1, addressLine2, selectedQty } = req.body;

    if (!email || !productId || !productName || !startDate || !endDate || !numberOfDays || !costPerDay || !totalCosts || !companyName || !contactNumber || !addressLine1 || !addressLine2 || !selectedQty) {
        console.error('Missing some data');
        return res.status(400).send('Missing some data');
    }

    // Code to further handle received data: 

    let newStartDate = new Date(startDate);
    let newEndDate = new Date(endDate);

    var year1 = newStartDate.getUTCFullYear();
    var month1 = String(newStartDate.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    var day1 = String(newStartDate.getUTCDate()).padStart(2, '0');

    var year2 = newEndDate.getUTCFullYear();
    var month2 = String(newEndDate.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    var day2 = String(newEndDate.getUTCDate()).padStart(2, '0');

    const formattedStartDate = `${year1}-${month1}-${day1}`;
    const formattedEndDate = `${year2}-${month2}-${day2}`;

    const rentalRequest = `INSERT INTO rental_purchases(rental_email, product_id, product_name, start_date, end_date, number_of_days, cost_per_day, total_cost, company_name, contact_number, address_line_1, address_line_2, selected_quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(rentalRequest, [email, productId, productName, formattedStartDate, formattedEndDate, numberOfDays, costPerDay, totalCosts, companyName, contactNumber, addressLine1, addressLine2, selectedQty], (err, results) => {
        if (err) {
            console.error('Error inserting data into rental_purchases table: ', err);
            return res.status(500).send('Error inserting data into rental_purchases table');
        }
        console.log('Data inserted successfully into rental_purchases table');
        res.status(200).send('Rental purchase data updated successfully');

        // Get latest id from rental_purchases table 
        let latestIdRental;
        const getLatestId = `SELECT id FROM rental_purchases ORDER BY id DESC LIMIT 1`;
        db.query(getLatestId, (err, result) => {
            if (err) {
                console.error('Error retrieving data from rental_purchases: ', err);
                return res.status(500).send('Error retrieving latest id.');
            }

            if (result.length > 0) {
                latestIdRental = result[0].id;
                console.log("Latest id for rental_purchases: ", latestIdRental);
            }

            // Function to change id into rental_id
            function createRentalId(id) {
                return 'R' + id.toString().padStart(3, '0');
            }

            // Update rental_purchases table 
            const updateRentalPurchases = `UPDATE rental_purchases SET rental_id = ? WHERE id = ?`;
            db.query(updateRentalPurchases, [createRentalId(latestIdRental), latestIdRental], (err, results) => {
                if (err) {
                    console.error('Unable to update rental_purchases table: ', err);
                } else {
                    console.log('rental_purchases table successfully updated with rental_id.');
                }

            })

        })

    });

})


// Handle quotation request 
app.post('/api/quote', (req, res) => {
    console.log('Received /api/quote request with body:', req.body);

    // Get data from the request body 
    const { wishlist, email } = req.body;

    if (!wishlist || !email) {
        console.error('Missing wishlist or email data');
        return res.status(400).send('Missing wishlist or email data');
    }

    const wishlistLength = wishlist.length;

    // Current timestamp const 
    let currentTimestamp = new Date();

    let wishlistProductid = [];
    wishlist.forEach(element => {
        wishlistProductid.push(element.productID);
    });

    console.log('Wishlist Product IDs:', wishlistProductid);

    const checkProductidCombiExist = `SELECT productid_combination FROM quotation WHERE quotation_email = ? ORDER BY id DESC LIMIT 5`;
    db.query(checkProductidCombiExist, [email], (err, results) => {
        if (err) {
            console.error('Error checking combination:', err);
            return res.status(500).send('Internal server error');
        }

        const wishlistProductIds = [];
        wishlist.forEach(element => wishlistProductIds.push(element.productID));
        console.log(wishlistProductIds);

        // Extract the productid_combination values into an array
        const productidCombinations = results.map(row => row.productid_combination);
        console.log(productidCombinations);


        function arraysEqual(arr1, arr2) {
            if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
            if (arr1.length !== arr2.length) return false;
            for (let i = 0; i < arr1.length; i++) {
                if (arr1[i] !== arr2[i]) return false;
            }
            return true;
        }

        let flag = false;

        if (productidCombinations.length > 0) {
            productidCombinations.forEach(combination => {
                if (Array.isArray(combination) && arraysEqual(combination, wishlistProductIds)) {
                    flag = true;
                }
            });
        }

        console.log('Product ID Combinations:', productidCombinations);
        console.log('Flag:', flag);


        if (flag === true) {
            console.log('Quotation for identical products already requested');
            return res.status(400).send('Quotation for identical products already requested.');
        } else {


            const quotes = `INSERT INTO quotation(quotation_email, quotation_quantity, date_of_creation, productid_combination) VALUES (?,?,?,?)`;
            db.query(quotes, [email, wishlistLength, currentTimestamp, JSON.stringify(wishlistProductIds)], (err, result) => {
                if (err) {
                    console.error('Error inserting data into q table:', err);
                    return res.status(500).send('Error inserting data into q table');
                }
                console.log('Data inserted successfully');
                res.status(200).send('Quotation requested successfully');


                // Get latest id from quotation table 
                let latestId;
                const getLatestId = `SELECT id FROM quotation ORDER BY id DESC LIMIT 1`;
                db.query(getLatestId, (err, results) => {
                    if (err) {
                        console.error('Error getting data id:', err);
                        return res.status(500).send('Error getting id');
                    }

                    if (results.length > 0) {
                        latestId = results[0].id;
                        console.log('Testing whether it reaches here.')
                        console.log('Latest id:', latestId);


                        function createQuotationId(id) {
                            return 'Q' + id.toString().padStart(3, '0');
                        }


                        const updateQuotationTable = `UPDATE quotation SET quotation_id = ? WHERE id = ?`;
                        db.query(updateQuotationTable, [createQuotationId(latestId), latestId], (err, results) => {
                            if (err) {
                                console.error('Error updating quotation table:', err);
                            } else {
                                console.log('Quotation table updated successfully:', results);


                                const getIdFromQuotationTable = `SELECT quotation_id FROM quotation WHERE quotation_email = ? ORDER BY id DESC LIMIT 1`;
                                db.query(getIdFromQuotationTable, [email], (err, result) => {
                                    if (err) {
                                        console.error('Error getting data Qxxx:', err);
                                        return res.status(500).send('Error getting Qxxx data');
                                    }
                                    console.log('Data Qxxx retrieved successfully');


                                    const quotationIdForQpTable = result[0].quotation_id;
                                    const quoteProducts = `INSERT INTO quotation_products(quotation_id, quotation_email, product_id, product_name) VALUES ?`;
                                    const values = wishlist.map(element => [quotationIdForQpTable, email, element.productID, element.productName]);
                                    db.query(quoteProducts, [values], (err, results) => {
                                        if (err) {
                                            console.error('Error inserting data into q_p table:', err);
                                            return res.status(500).send('Error inserting data into q_p table');
                                        }
                                        console.log('Data inserted successfully into qp table');
                                        res.status(200).send('Quotation data updated successfully');
                                    });



                                });

                            }
                        });


                    }

                })



            });

        }


    });

});



// Handle request to login 
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Missing data');
    }

    const sql = `SELECT user_password FROM user_account WHERE user_email = ?`;
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).send('Internal server error');
        }

        if (results.length === 0) {
            return res.status(400).send('User not found');
        }

        const storedHash = results[0].user_password;

        bcrypt.compare(password, storedHash, (err, match) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).send('Internal server error');
            }
            if (match) {

                const getUsername = `SELECT user_username FROM user_account WHERE user_email = ?`;
                db.query(getUsername, [email], (err, results) => {
                    if (err) {
                        console.error('Error fetching username:', err);
                        return res.status(500).send('Internal server error');
                    }
                    const username = results[0].user_username;
                    res.status(200).json({ message: 'Login successful', username: username });
                });

            } else {
                res.status(400).send('Invalid credentials');
            }
        });
    });

})



// Handle POST request to register a new user
app.post('/api/register', (req, res) => {

    const { username, email, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).send('Missing data');
    }

    // Check if email already exists
    const checkEmailSql = 'SELECT user_email FROM user_account WHERE user_email = ?';
    db.query(checkEmailSql, [email], (err, results) => {
        if (err) {
            console.error('Error checking email:', err);
            return res.status(500).send('Internal server error');
        }

        if (results.length > 0) {
            return res.status(400).send('Email already registered');
        }

        // Hash the password using bcrypt
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).send('Internal server error');
            }

            const sql = `INSERT INTO user_account(user_email, user_username, user_password) VALUES (?, ?, ?)`;
            db.query(sql, [email, username, hashedPassword], (err, result) => {
                if (err) {
                    console.error('Error inserting data:', err);
                    return res.status(500).send('Error inserting data');
                }
                console.log('Data inserted successfully');
                res.status(200).send('User registered');
            });
        });

    });

});



db.connect(function (err) {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');

    // Create a table if it doesn't exist
    const user_account = `
        CREATE TABLE IF NOT EXISTS user_account (
            user_email VARCHAR(255) NOT NULL,
            user_username VARCHAR(255) NOT NULL, 
            user_password VARCHAR(255) NOT NULL, 
            PRIMARY KEY (user_email)
        );
    `;

    // Execute the SQL statement to create the table
    db.query(user_account, function (err, results) {
        if (err) {
            console.error('Error creating user_account:', err);
            return;
        }
        console.log('user_account table created or already exists');
    });


    const quotation = `
        CREATE TABLE IF NOT EXISTS quotation (
            id INT AUTO_INCREMENT PRIMARY KEY, 
            quotation_id VARCHAR(255) UNIQUE, 
            quotation_email VARCHAR(255) NOT NULL, 
            quotation_quantity INT(10) NOT NULL,
            date_of_creation TIMESTAMP, 
            productid_combination JSON
        );
    `;

    db.query(quotation, function (err, results) {
        if (err) {
            console.error('Error creating quotation:', err);
            return;
        }
        console.log('quotation table created or already exists');

    });


    const quotation_products = `
        CREATE TABLE IF NOT EXISTS quotation_products (
            quotation_id VARCHAR(255) NOT NULL, 
            quotation_email VARCHAR(255) NOT NULL, 
            product_id VARCHAR(255) NOT NULL, 
            product_name VARCHAR(255) NOT NULL,
            FOREIGN KEY (quotation_id) REFERENCES quotation(quotation_id) ON DELETE CASCADE
        );
    `;

    db.query(quotation_products, function (err, results) {
        if (err) {
            console.error('Error creating quotation_products:', err);
            return;
        }
        console.log('quotation_products table created or already exists');
    });


    const rental_purchases = `
    CREATE TABLE IF NOT EXISTS rental_purchases (
        id INT AUTO_INCREMENT PRIMARY KEY, 
        rental_id VARCHAR(255) UNIQUE, 
        rental_email VARCHAR(255) NOT NULL, 
        product_id VARCHAR(255) NOT NULL, 
        product_name VARCHAR(255) NOT NULL, 
        start_date DATE NOT NULL, 
        end_date DATE NOT NULL, 
        number_of_days INT(10) NOT NULL, 
        cost_per_day DECIMAL(10, 2) NOT NULL, 
        total_cost DECIMAL(10, 2) NOT NULL, 
        payment_method VARCHAR(255) NOT NULL 
    );
`;

    db.query(rental_purchases, function (err, results) {
        if (err) {
            console.error('Error creating rental_purchases table:', err);
            return;
        }
        console.log('rental_purchases table created or already exists');

    });


});


app.listen(port, () =>
    console.log(`Server running on http://localhost:${port}`)
);
