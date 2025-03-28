document.addEventListener("DOMContentLoaded", function(){

    //DOM Element References

    
    const searchButton = document.getElementById("searchButton")
    const form = document.getElementById("register")
    const name = document.getElementById("name")
    const className = document.getElementById("className")
    const total = document.getElementById("totals")
    const results = document.getElementById("results")
    let tableBody =document.querySelector("#studentTable tbody")


    //create html elements
    let row = document.createElement("tr")
    let idCell = document.createElement("td")
    let nameCell = document.createElement("td")
    let classCell = document.createElement("td")


    


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

                    

                    //append id cell
                    idCell.textContent = student.id
                    row.appendChild(idCell)

                    //append name cell
                    nameCell.textContent = student.name
                    row.appendChild(nameCell)

                     //append class cell
                     classCell.textContent = student.class
                     row.appendChild(classCell)
 

                    //append row to the tbody
                    tableBody.appendChild(row)

                   
                    
                })

                // If no student is found
                if (students.length === 0) {
                    tableBody.innerHTML = `<tr><td colspan="3">No student found</td></tr>`;
                }
            })

            
        })

        
    }

    function displayStudents(){

        //Clears the previous data
        tableBody.innerHTML = ''

        if(student.length === 0){
            tableBody.innerHTML = `<tr><td colspan="3">No student found</td></tr>`
            return
        }

        

        students.forEach(student => {

            //append id cell
            idCell.textContent = student.id
            row.appendChild(idCell)

            //append namecell
            nameCell.textContent = student.name
            row.appendChild(nameCell)

            //append class cell
            classCell.textContent = student.class
            row.appendChild(classCell)

            tableBody.appendChild(row)





        })
    }




    searchForStudent()

















})