document.addEventListener("DOMContentLoaded", function(){

    console.log("The page has been loaded")

    // JSONbin.io Configuration
    const JSONBIN_URL = 'https://api.jsonbin.io/v3/b/67e6df3b8a456b79667e86bf';
    const JSONBIN_HEADERS = {
        'Content-Type': 'application/json',
        'X-Master-Key': '$2a$10$OY.M2i6CXGFny7V37WLJUO/sTOXqeBUou0orKz7SAKYY8cSeJ2.CS'
    };

    //DOM Element References

    
    const searchButton = document.getElementById("searchButton")
    const form = document.getElementById("register")
    const results = document.getElementById("results")
    let tableBody =document.querySelector("#studentTable tbody")
    



    
    //function to fetch students from the db

    function fetchAllStudents(){

        fetch(`${JSONBIN_URL}/latest`, {
            headers: JSONBIN_HEADERS
        })
        .then((resp) => resp.json())
        .then((data) => {

            //JSONbin returns data in a specific format with record and metadata
            const students = data.record.students || [];
            displayStudents(students)
        })

        .catch((error) => console.error("Error fetching students:", error));
    }
    


    //function to search for students
    function searchForStudent(){

        searchButton.addEventListener('click', function(e){

            e.preventDefault()

            const search = document.getElementById("search").value.trim()
         

            fetch(`${JSONBIN_URL}/latest`, {
                headers: JSONBIN_HEADERS
            })

            .then((resp) => resp.json())
            .then((data)=> {

                const students = data.record.students || [];
                // Filter students by ID on the client side
                const filteredStudents = students.filter(student => 
                    student.id.toString() === search);

                // Clear previous search results
                tableBody.innerHTML = "";

                // If no student is found
                if (filteredStudents.length === 0) {
                    tableBody.innerHTML = `<tr><td colspan="3">No student found</td></tr>`
                    return
                }
               

                //loop through student data
                filteredStudents.forEach(student => {renderStudentRow(student)})

                
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
    function markAttendance(studentId, status, presentBtn, absentbtn){

        // Get current data first
        fetch(`${JSONBIN_URL}/latest`, {
            headers: JSONBIN_HEADERS
        })
        .then(response => response.json())
        .then(data => {
            // Get existing data
            let binData = data.record;
            let students = binData.students || [];
            let attendance = binData.attendance || [];
            
            // Find the student
            const student = students.find(s => s.id === studentId);
            
            if (!student) {
                throw new Error('Student not found');
            }
            

        // Prepare attendance data
        const attendanceData = {
            studentId: student.id,
            studentName: student.name,
            class: student.class,
            status: status,
            date: new Date().toISOString().split('T')[0] // Current date in YYYY-MM-DD format
        }

        // Add to attendance array
        attendance.push(attendanceData)
        binData.attendance = attendance

        // Update the bin with new data
        return fetch(JSONBIN_URL, {
            method: 'PUT',
            headers: JSONBIN_HEADERS,
            body: JSON.stringify(binData)
        });
    })

        .then(response => response.json())
            
        .then(data => {
            alert('Attendance recorded successfully:', data)

            //Disable both buttons after successful posting
            presentBtn.disabled = true
            absentbtn.disabled = true

            // Add visual feedback
            if (status === "Present") {
                presentBtn.classList.add("selected")
            } else {
                absentbtn.classList.add("selected")
            }

            // Update totals after successful attendance marking
              updateStudentTotals()
        })
        .catch(error => {
            console.error('Error recording attendance:', error)
            //show an error message to the user
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

            if(name === "" && className === ""){

                alert("name and class cannot be empty")
            }
            else if(name === "" || className === ""){

                alert("fill in the required field")
            }

            else{
                
                // First get the current data
                fetch(`${JSONBIN_URL}/latest`, {
                    headers: JSONBIN_HEADERS
                })
                .then(response => response.json())
                .then(data => {

                    // Get existing data
                    let binData = data.record;
                    let students = binData.students || [];

                    // Generate the next sequential ID
                    const newStudentId = generateNextStudentId(students);

                    // Create a new student
                    const newStudent = {
                        id: newStudentId,
                        name: name,
                        class: className
                    }

                    //add student to array
                    students.push(newStudent);
                    binData.students = students;

                    // Post the new student
                    // Update the bin with new data
                    return fetch(JSONBIN_URL, {
                        method: 'PUT',
                        headers: JSONBIN_HEADERS,
                        body: JSON.stringify(binData)
                    })
                })
                .then(response => response.json())
                .then(data => {
                    // Clear the form
                    document.getElementById("name").value = ''
                    document.getElementById("className").value = ''

                    // Find the new student in the updated data
                    const newStudentData = data.record.students;
                    const newStudent = newStudentData[newStudentData.length - 1];

                    //Render the new student
                    renderStudentRow(newStudent)

                    // Show success message
                    alert('Student added successfully!')

                    // Refresh the student list
                    fetchAllStudents();
                })
                .catch(error => {
                    console.error('Error adding student:', error)
                    alert('Failed to add student. Please try again.')
                })
            }
    
            
        })
    }

    function updateStudentTotals() {
        // Fetch students and attendance data
        fetch(`${JSONBIN_URL}/latest`, {
            headers: JSONBIN_HEADERS
        })
        .then(response => response.json())
        .then(data => {

            const binData = data.record;
            const students = binData.students || [];
            const attendanceRecords = binData.attendance || [];

            // Total number of students
            const totalStudents = students.length
    
            // Get today's date
            const today = new Date().toISOString().split('T')[0]
    
            // Filter attendance records for today
            const todaysAttendance = attendanceRecords.filter(record => 
                record.date === today
            )
    
            // Count present and absent students
            const presentStudents = todaysAttendance.filter(record => 
                record.status === "Present"
            ).length
    
            const absentStudents = todaysAttendance.filter(record => 
                record.status === "Absent"
            ).length
    
            // Display totals
            const total = document.getElementById("totals")
            if (total) {
                total.innerHTML = `
                    <p>Total Students: ${totalStudents}</p>
                    <p>Present Students: ${presentStudents}</p>
                    <p>Absent Students: ${absentStudents}</p>
                `
            }
    
            
        })
        .catch(error => {
            console.error("Error fetching student or attendance data:", error)
            
            // Display error message
            const totalsElement = document.getElementById("totals")
            if (totalsElement) {
                totalsElement.innerHTML = `<p>Unable to load student totals</p>`
            }
        })
    }



    fetchAllStudents()
    searchForStudent()
    newStudentDetails()
    updateStudentTotals()

















})