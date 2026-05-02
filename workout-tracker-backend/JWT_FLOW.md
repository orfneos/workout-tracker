JWT Authentication Flow

Πως λειτουργεί το auth.js (middleware)

1. Login & Έκδοση Token
Ο χρήστης στέλνει email/password. Ο Server τα ελέγχει και φτιάχνει ένα JWT (JSON Web Token) χρησιμοποιώντας το `JWT_SECRET`. Αυτό το token περιέχει το `userId`.

2. Αποθήκευση στο Frontend.
To Frontend παίρνει το token και το αποθηκεύει (π.χ. στο LocalStorage).

3. Αποστολή Request με Token.
Σε κάθε επόμενη κλήση (πχ. αποθήκευση προπόνησης), το Front στέλνει το token στο header:
`Authorization: Bearer <token_string>`

4. Έλεγχος από το Middleware (auth.js) 
Όταν το αίτημα φτάνει στον Server, το Middleware:
* **Εξάγει (Extract):** Παίρνει το token από το header.
* **Επαληθεύει (Verify):** Χρησιμοποιεί το `JWT_SECRET` για να δει αν η υπογραφή είναι έγκυρη.
* **Αποκωδικοποιεί (Decode):** Μετατρέπει το ακαταλαβίστικο token στο αντικείμενο `decoded` (που περιέχει το `userId`).
* **Εκχωρεί (Assign):** Βάζει το `decoded` στο `req.user`.

5. Πρόσβαση στον Controller
Αν όλα είναι σωστά, καλείται η `next()`. Ο Controller πλέον ξέρει ποιος είναι ο χρήστης διαβάζοντας το `req.user.userId`.