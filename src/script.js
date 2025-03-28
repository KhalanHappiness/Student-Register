document.addEventListener("DOMContentLoaded", function(){

    //DOM Element References

    
    const searchButton = document.getElementById("searchButton")
    const form = document.getElementById("register")
    const name = document.getElementById("name")
    const className = document.getElementById("className")
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
         

            fetch(`http://localhost:3000/students/${search}`,{

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
               

                //loop through student data
                students.forEach(student => {

                    let row = document.createElement("tr")

                    //create and append id cell
                    let idCell = document.createElement("td")
                    idCell.textContent = student.id
                    row.appendChild(idCell)

                    //create and append name cell
                    let nameCell = document.createElement("td")
                    nameCell.textContent = student.name
                    row.appendChild(nameCell)

                     //create and append class cell
                     let classCell = document.createElement("td")
                     classCell.textContent = student.class
                     row.appendChild(classCell)

                     //create and append status cell
                     let statusCell = document.createElement("td")
                    statusCell.createElement("button")

                    //create and append row to the tbody
                    tableBody.appendChild(row)

                   
                    
                })

                // If no student is found
                if (students.length === 0) {
                    tableBody.innerHTML = `<tr><td colspan="3">No student found</td></tr>`;
                }
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

    

        students.forEach(student => {

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
            presentButton.classList.add("present-btn")
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





        })
    }

    //function to mark attendance(disable buttons after selection)
    function markAttendance(studentId, status, presentBtn, absentbtn){

        console.log(`Student ID: ${studentId}, Status: ${status}`)

        //Disable both buttons after one is clicked
        presentBtn.disabled =true;
        absentbtn.disabled = true;

    }



    fetchAllStudents()
    searchForStudent()

















})