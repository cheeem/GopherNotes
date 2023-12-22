document.getElementById("search-form").addEventListener("submit", function (e) {
	e.preventDefault();

	var courseDepartment = document.getElementById("course-department").value;
	var courseName = document.getElementById("course-name").value;
	var professor = document.getElementById("course-professor").value;
	var year = document.getElementById("course-year").value;

    // Do not know how to write 

	console.log("Form Submitted", {
		courseDepartment,
		courseName,
		professor,
		year,
	});
});
