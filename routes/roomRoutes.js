const express = require('express');
const router = express.Router();
const pool = require('../db');
// Fetch pending bed requests
router.get('/pendingBedRequests', (req, res) => {
    const fetchPendingRequestsQuery = `
        SELECT h.name, b.user_id, b.hostel_id, b.room_number, b.bed_number, b.status
        FROM beds b
        left join hostels h on h.id=b.hostel_id
        WHERE b.status = 'pending'
    `;

    console.log('Executing query:', fetchPendingRequestsQuery); // Log the query
    pool.query(fetchPendingRequestsQuery, (err, results) => {
        if (err) {
            console.error('Error fetching pending bed requests:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        console.log('Query executed successfully');
        console.log('Results:', results); // Log the results
        res.status(200).json(results);
    });
});
// Fetch pending bed requests
router.get('/approvedRequests', (req, res) => {
    const fetchPendingRequestsQuery = `
        SELECT h.name, b.user_id, b.room_number, b.bed_number, b.status
        FROM beds b
        left join hostels h on h.id=b.hostel_id
        WHERE b.status = 'confirmed'
    `;

    console.log('Executing query:', fetchPendingRequestsQuery); // Log the query
    pool.query(fetchPendingRequestsQuery, (err, results) => {
        if (err) {
            console.error('Error fetching confirmed bed requests:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        console.log('Query executed successfully');
        console.log('Results:', results); // Log the results
        res.status(200).json(results);
    });
});
// Fetch pending bed requests
router.get('/rejectedRequests', (req, res) => {
    const fetchPendingRequestsQuery = `
        SELECT h.name, b.user_id, b.room_number, b.bed_number, b.status
        FROM beds b
        left join hostels h on h.id=b.hostel_id
        WHERE b.status = 'rejected'
    `;

    console.log('Executing query:', fetchPendingRequestsQuery); // Log the query
    pool.query(fetchPendingRequestsQuery, (err, results) => {
        if (err) {
            console.error('Error fetching rejected bed requests:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        console.log('Query executed successfully');
        console.log('Results:', results); // Log the results
        res.status(200).json(results);
    });
});

// Handle student login via POST request
router.post('/student_login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    pool.query('SELECT * FROM student WHERE username = ? AND password = ?', [username, password], (error, results) => {
        if (error) {
            console.error('Error executing MySQL query:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const loggedInUser = results[0].username;
        res.status(200).json({ message: 'Student login successful', username: loggedInUser });
    });
});


router.post('/admin_login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    pool.query('SELECT * FROM admin WHERE username = ? AND password = ?', [username, password], (error, results) => {
        if (error) {
            console.error('Error executing MySQL query:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const loggedInUser = results[0].username;
        res.status(200).json({ message: 'Admin login successful', username: loggedInUser });
    });
});

function sanitizeInput(input) {
    return input.replace(/['"]/g, '').trim();
}

// Handle bed selection
router.post('/selectBed', (req, res) => {
    const { room_number, bed_number, hostel_id, user_id } = req.body;

    if (!room_number || !bed_number || !hostel_id || !user_id) {
        return res.status(400).json({ message: 'Room number, bed number, hostel ID, and user ID are required' });
    }

    const sanitizedRoomNumber = sanitizeInput(room_number);
    const sanitizedBedNumber = sanitizeInput(bed_number);
    const sanitizedHostelId = sanitizeInput(hostel_id);
    const sanitizedUserId = sanitizeInput(user_id);

    // Check if the user has already selected a bed
    const checkUserQuery = `
        SELECT * FROM beds WHERE user_id = ? 
    `;

    pool.query(checkUserQuery, [sanitizedUserId], (err, userResults) => {
        if (err) {
            console.error('Error checking user:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (userResults.length > 0) {
            return res.status(400).json({ message: 'You have already selected a bed previously' });
        }

        // Check if the bed is available
        const checkBedQuery = `
            SELECT * FROM beds WHERE hostel_id = ? AND room_number = ? AND bed_number = ? 
        `;

        pool.query(checkBedQuery, [sanitizedHostelId, sanitizedRoomNumber, sanitizedBedNumber], (err, bedResults) => {
            if (err) {
                console.error('Error checking bed:', err);
                return res.status(500).json({ message: 'Database error' });
            }

            // If the bed is already booked or pending
            if (bedResults.length > 0 && bedResults[0].status !== 'empty' && bedResults[0].status !== 'rejected') {
                return res.status(400).json({ message: 'Bed is already booked or pending' });
            }

            // Book the bed
            const bookBedQuery = `
                INSERT INTO beds (hostel_id, room_number, bed_number, user_id, status, booked_at)
                VALUES (?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP)
                ON DUPLICATE KEY UPDATE user_id = VALUES(user_id), status = 'pending', booked_at = CURRENT_TIMESTAMP
            `;

            pool.query(bookBedQuery, [sanitizedHostelId, sanitizedRoomNumber, sanitizedBedNumber, sanitizedUserId], (err, result) => {
                if (err) {
                    console.error('Error booking bed:', err);
                    return res.status(500).json({ message: 'Database error' });
                }

                res.status(200).json({ message: 'Bed selected successfully' });
            });
        });
    });
});


const getNumberOfBedsForHostel = (hostelId) => {
    const hostelBedCounts = {
        1: 3,  // Hostel 1 has 3 beds
        2: 4, 
        3: 3,
        4: 3,
        5: 4 // Hostel 2 has 4 beds
        // Add other hostels as needed
    };
    return hostelBedCounts[hostelId] || 3; // Default to 3 beds if the hostel is not listed
};


router.get('/rooms', (req, res) => {
    const hostelId = req.query.hostel_id;
    const numberOfBeds = getNumberOfBedsForHostel(hostelId);

    const getRoomsQuery = `
        SELECT room_number, bed_number, status
        FROM beds
        WHERE hostel_id = ?
    `;

    pool.query(getRoomsQuery, [hostelId], (err, results) => {
        if (err) {
            console.error('Error fetching rooms:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        const rooms = {};

        results.forEach(bed => {
            if (bed.status === 'rejected') {
                return; // Skip rejected beds
            }
            if (!rooms[bed.room_number]) {
                rooms[bed.room_number] = {
                    room_number: bed.room_number,
                    beds: []
                };
            }

            // Only process confirmed and pending beds
            if (bed.status === 'confirmed' || bed.status === 'pending') {
                // Determine bed color
                let bedColor;
                switch (bed.status) {
                    case 'confirmed':
                        bedColor = 'red';
                        break;
                    case 'pending':
                        bedColor = 'orange';
                        break;
                    default:
                        bedColor = 'grey'; // Default color for unknown statuses
                }

                rooms[bed.room_number].beds.push({
                    bed_number: bed.bed_number,
                    status: bed.status,
                    color: bedColor
                });
            }
        });

        // Process rooms
        const processedRooms = Object.values(rooms).map(room => {
            const allConfirmedOrPending = room.beds.length === numberOfBeds && room.beds.every(bed => bed.status === 'confirmed' || bed.status === 'pending');

            // Determine room color based on beds status
            const roomColor = allConfirmedOrPending ? 'red' : 'orange';

            // Update each bed's color based on the room color
            const updatedBeds = room.beds.map(bed => {
                let bedColor;
                switch (bed.status) {
                    case 'confirmed':
                        bedColor = 'red';
                        break;
                    case 'pending':
                        bedColor = 'orange';
                        break;
                    default:
                        bedColor = 'grey'; // Default color for unknown statuses
                }
                return {
                    ...bed,
                    color: bedColor
                };
            });

            return {
                room_number: room.room_number,
                beds: updatedBeds,
                color: roomColor
            };
        });

        // Log each room and its beds explicitly
        processedRooms.forEach(room => {
            console.log(`Room Number: ${room.room_number}`);
            room.beds.forEach(bed => {
                console.log(`  Bed Number: ${bed.bed_number}, Status: ${bed.status}, Color: ${bed.color}`);
            });
            console.log(`  Room Color: ${room.color}`);
        });

        // Log the entire processedRooms object
        console.log('Processed Rooms:', JSON.stringify(processedRooms, null, 2));

        res.status(200).json(processedRooms);
    });
});



// Approve bed request
router.post('/approveRequest', (req, res) => {
    const { application_number } = req.body;
    console.log('Approving request for application_number:', application_number);
    
    const approveQuery = `
        UPDATE beds
        SET status = 'confirmed'
        WHERE user_id = ?
    `;
    
    pool.query(approveQuery, [application_number], (err, results) => {
        if (err) {
            console.error('Error approving request:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        
        console.log('approveQuery:', approveQuery);
        console.log('Query results:', results);
        
        if (results.affectedRows > 0) {
            return res.status(200).json({ message: 'Request approved successfully' });
        } else {
            return res.status(404).json({ message: 'Request not found' });
        }
    });
});

// Reject bed request
router.post('/rejectRequest', (req, res) => {
    const { application_number } = req.body;
    const rejectQuery = `
        UPDATE beds
        SET status = 'rejected'
        WHERE user_id = ?
    `;
    pool.query(rejectQuery, [application_number], (err, results) => {
        if (err) {
            console.error('Error rejecting request:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.status(200).json({ message: 'Request rejected successfully' });
    });
});

// Get the bed details for the logged-in user
router.get('/user_bed_status', (req, res) => {
    const username = req.query.username;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    const getUserBedDetailsQuery = `
        SELECT h.name, b.user_id, b.room_number, b.bed_number, b.status,b.booked_at
        FROM beds b
        left join hostels h on h.id=b.hostel_id
        WHERE b.user_id = ?
    `;

    pool.query(getUserBedDetailsQuery, [username], (err, results) => {
        if (err) {
            console.error('Error fetching user bed details:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No bed details found for this user' });
        }

        res.status(200).json(results);
    });
});

// Delete a bed detail for the logged-in user
router.delete('/delete_bed', (req, res) => {
    const { username, bed_number } = req.body;

    if (!username || !bed_number) {
        return res.status(400).json({ message: 'Username and bed number are required' });
    }

    const deleteBedDetailQuery = `
        DELETE FROM beds
        WHERE user_id = ? AND bed_number = ?
    `;

    pool.query(deleteBedDetailQuery, [username, bed_number], (err, results) => {
        if (err) {
            console.error('Error deleting bed detail:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'No bed detail found for this user' });
        }

        res.status(200).json({ message: 'Bed detail deleted successfully' });
    });
});
module.exports = router;