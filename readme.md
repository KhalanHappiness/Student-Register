### Student Register


This is a simple web based student register that allows users to register students, search for students and mark attendance. The system interacts with a backend server to manage student records

### Features
- Fetch and display all students from the database
- Search for students by ID
- Add new students with a unique ID
- Display the total number of students and their attendance summary

### Technologies used
- Frontend : HTML & CSS 
- Backend: JSON server 

### How it works
1. fetching all students

- The function fetchAllStudents() retrieves the list of students from the backend and displays them in an HTML table

2. Search for a student
- Users can search for a student by entering their ID. The function searchForStudent() makes a GET request and updates the table with the result.

3. Adding a new Student

- The function newStudentDetails() allows users to register a new student by submitting a form. A unique student ID is generated dynamically using the generateNextStudentId(). The new student is then stored in the backend database

4. Marking attendance 
-Each student row has "Present" and "Absent" buttons. Clicking a button sends a POST request recording the attendance status and disabling both buttons to prevent multiple submissions

5. Updating student totals
- The funciton updateStudentTotals() fetches student and attendance data, calculates the number of present and absent students for the current day, and updates the UI accordingly


### API Endpoints

GET /students → Fetch all students.

GET /students/?id={id} → Search for a student by ID.

POST /students → Add a new student.

POST /attendance → Mark student attendance.

GET /attendance → Fetch attendance record

### Future enhancements 
- Date selection for viewing past attendance records
- implement a more dynamic UI with real time updates
- improve on the mark attendance functionality
- Bulk attendance marking
- add more filtering and sorting options
- Attendance reports and exports



### Author 
Happiness Khalan