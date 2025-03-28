document.addEventListener("DOMContentLoaded", function(){

    //DOM Element References

    
    const searchButton = document.getElementById("searchButton")
    const form = document.getElementById("register")
    const total = document.getElementById("totals")
    const results = document.getElementById("results")
    let tableBody =document.querySelector("#studentTable tbody")
    



    
    //function to fetch students from the db

    function fetchAllStudents(){

        fetch('http://localhost:3000/students')
        .then((resp) => resp.json())
        .then((students) => {
            displayStudents(students)
        })

        .catch((error) => console.error("Error fetching students:", error));
    }
    


    //function to search for students
    function searchForStudent(){

        searchButton.addEventListener('click', function(e){

            e.preventDefault()

            const search = document.getElementById("search").value.trim()
         

            fetch(`http://localhost:3000/students/?id=${search}`,{

                headers:{
                    "Content-Type": "application/json",

                }
            })

            .then((resp) => resp.json())
            .then((students)=> {

                //confirm that it is an array
                if (!Array.isArray(students)) students = [students];

                // Clear previous search results
                tableBody.innerHTML = "";

                // If no student is found
                if (students.length === 0) {
                    tableBody.innerHTML = `<tr><td colspan="3">No student found</td></tr>`
                    return
                }
               

                //loop through student data
                students.forEach(student => {renderStudentRow(student)})

                
            })

            
        })

        
    }

    //function to display all students in the table
    function displayStudents(students){

        //Clears the previous data
        tableBody.innerHTML = ''

        if(students.length === 0){
            tableBody.innerHTML = `<tr><td colspan="3">No student found</td></tr>`
            return
        }

    

        students.forEach(student => {renderStudentRow(student)})
    }

    //function to display rows

    function renderStudentRow(student){

        let row = document.createElement("tr")

        //create and append id cell
        let idCell = document.createElement("td")
        idCell.textContent = student.id
        row.appendChild(idCell)

        //create and append namecell
        let nameCell = document.createElement("td")
        nameCell.textContent = student.name
        row.appendChild(nameCell)

        //create and append class cell
        let classCell = document.createElement("td")
        classCell.textContent = student.class
        row.appendChild(classCell)

        //create and append the status cell

        let statusCell = document.createElement("td")
        //create the present button
        let presentButton = document.createElement("button");
        presentButton.textContent="present"
        presentButton.classList.add("btn")
        presentButton.addEventListener("click", function(){
            markAttendance(student.id, "Present", presentButton, absentButton)
        })
        statusCell.appendChild(presentButton)

       
        //create the absent button
        let absentButton = document.createElement("button");
        absentButton.textContent = "Absent"
        absentButton.classList.add("absent-btn")
        absentButton.addEventListener('click', function(){
            markAttendance(student.id, "Absent", presentButton, absentButton)
        })
        statusCell.appendChild(absentButton)
       
        row.appendChild(statusCell)


        tableBody.appendChild(row)



    }



    //function to mark attendance(disable buttons after selection)
    function markAttendance(student, status, presentBtn, absentbtn){

        // Prepare attendance data
        const attendanceData = {
            studentId: student.id,
            studentName: student.name,
            class: student.class,
            status: status,
            date: new Date().toISOString().split('T')[0] // Current date in YYYY-MM-DD format
        }

        // Post attendance to the database
        fetch('http://localhost:3000/attendance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(attendanceData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            return response.json()
        })
        .then(data => {
            console.log('Attendance recorded successfully:', data)

            //Disable both buttons after successful posting
            presentBtn.disabled = true
            absentbtn.disabled = true

            // Add visual feedback
            if (status === "Present") {
                presentBtn.classList.add("selected")
            } else {
                absentbtn.classList.add("selected")
            }
        })
        .catch(error => {
            console.error('Error recording attendance:', error)
            // Optionally show an error message to the user
            alert('Failed to record attendance. Please try again.')
        })
        
        

    }

    //function to post new student details 

    function generateNextStudentId(existingStudents) {
        // Find the maximum existing integer ID
        const maxIntegerId = existingStudents
            .filter(student => typeof student.id === 'number')
            .reduce((max, student) => Math.max(max, student.id), 0);
    
        // Return the next sequential integer
        return maxIntegerId + 1;
    }
    
    // Usage in the newStudentDetails function would look like:
    function newStudentDetails(){
        form.addEventListener('submit', function(e){
            e.preventDefault()
    
            const name = document.getElementById("name").value.trim()
            const className = document.getElementById("className").value.trim()
    
            // Fetch existing students to get the next ID
            fetch('http://localhost:3000/students')
            .then(response => response.json())
            .then(existingStudents => {
                // Generate the next sequential ID
                const newStudentId = generateNextStudentId(existingStudents)
    
                // Prepare student data object
                const studentData = {
                    id: newStudentId,
                    name: name,
                    class: className
                }
    
                // Post the new student
                return fetch('http://localhost:3000/students', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(studentData)
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                return response.json()
            })
            .then(data => {
                // Clear the form
                document.getElementById("name").value = ''
                document.getElementById("className").value = ''
    
                // Optional: Refresh the student list or add the new student to the table
                renderStudentRow(data)
    
                // Show success message
                alert('Student added successfully!')
            })
            .catch(error => {
                console.error('Error adding student:', error)
                alert('Failed to add student. Please try again.')
            })
        })
    }



    fetchAllStudents()
    searchForStudent()
    newStudentDetails()

















})