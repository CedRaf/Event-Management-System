# App Dev Event Management System

Group Members and Contribution:
- Cedric Rafanan (Backend)
- Rhenz Largo (Frontend)
- Sakura Kano (Frontend & CSS)

#Application Stack and Dependencies
- ReactJS Frontend
- Express API
- Prisma ORM
- MySQL Database

#ENV File Requirements
##To simulate a working app environment, the following should be included in your .env file
- DATABASE_URL="mysql://username:password@localhost:3306/database_name"
- TOKEN=CIS3105APPDEV (can be anything)
- USER_EMAIL= "valid email address" (responsible for sending reset-password link)
- USER_PASSWORD= "application password" (valid application password provided by google)

#Additional Notes
- Frontend and Backend are run on separate ports
- "npm run dev" and "npm run server" for frontend and backend respecitvely
- To properly utilize google sign-in, setup for [Google Cloud Console](https://console.cloud.google.com/welcome?inv=1&invt=AbkSOA&project=careful-record-443303-n0) environment is needed

