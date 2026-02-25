# Food Ordering Web App Technical Assessment (MERN Stack)

## Overview
This is a full-stack food ordering web application built using the MERN stack (MongoDB, Express, React, Node.js). The application consists of a customer-facing app for ordering food and an admin app for managing orders, menu items, and more.

## Features
- User authentication and authorization
- Browse food items
- Add items to the cart and place orders
- Stripe Payment Integration: Secure and reliable payment processing using Stripe.
- Order tracking
- Admin panel to manage menu items, orders
  
## Technologies Used
- **Frontend:** React.js, React Context API, React Router
- **Backend:** Node.js, Express.js
- **Payment Gateway:** Stripe
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Styling:** CSS

### Prerequisites
- Node.js >= v20.14.0
- NPM >= v10.7.0
- MongoDB

## Test Problems
1. **Complete the tasks**:

△ Task 1 - Figure out the authentication issues (For full-stack and back-end only)
- Login: Return 401 Unauthorized if credentials are incorrect (currently returns 200 OK).
- Registration: Return 401 Unauthorized if the user already exists (currently returns 200 OK).

△ Task 2 - UI Enhancement (For front-end)
- Add a zoom-in effect on hover for each menu image.

△ Task 3 - Order UI Fix (For front-end)
- Ensure the “-” (minus) icon in the order section maintains a consistent position when the user interacts with it (e.g., when quantity changes).

2. **Commit Your Changes**:
- Make sure you commit your changes regularly:
    ```bash
    git add .
    git commit -m "Task1 completed!"
    git push origin main
    ```

3. **Submit Your Repository Link**:
- Record a short [Loom video](https://www.loom.com) showing how it works, including the expected and actual behavior if you're testing.
- Once you’ve completed the tasks, send the result to https://forms.gle/1E2z5713vGV9vhr4A.
- Please make sure that your repository is **public** or share access if it's private.

4. **Deadline**:
  30 ~ 45 mins