import Employee from "../../models/Employee.model";
import Complaint from "../../models/Complaint.model";

async function assignComplaintOnDate(complaintType, selectedDate) {
    const employees = await Employee.find({}); // Fetch all employees
    const serviceDuration = getServiceDuration(complaintType);
    const complaintDate = new Date(selectedDate);
    
    for (const employee of employees) {
        const workHoursLeft = calculateWorkHoursLeftOnDate(employee, complaintDate);

        // Check if the employee has enough hours left on the selected date (considering travel time)
        if (workHoursLeft >= serviceDuration + 2) { // 2 hours for travel
            // Assign complaint to this employee for the selected date
            await assignToEmployeeOnDate(employee, complaintType, complaintDate);
            return; // Exit once the complaint is assigned
        }
    }

    // If no employee is found, handle the case (e.g., queue the complaint or notify the admin)
    console.log("No available employees to assign the complaint on the selected date.");
}

function calculateWorkHoursLeftOnDate(employee, selectedDate) {
    const workStart = new Date(selectedDate);
    workStart.setHours(9, 0, 0, 0); // Start at 9 AM
    const workEnd = new Date(workStart);
    workEnd.setHours(17, 0, 0, 0); // End at 5 PM

    const assignedTasksOnDate = employee.assignedTasks.filter(task => 
        task.date.toDateString() === selectedDate.toDateString()
    );

    const assignedHours = assignedTasksOnDate.reduce((total, task) => total + task.duration, 0); // Sum of assigned tasks' durations

    return 8 - assignedHours; // 8 hours work day minus the hours already assigned
}

function getServiceDuration(complaintType) {
    switch (complaintType) {
        case 'Installation': return 4;
        case 'Maintenance': return 2;
        case 'Repair': return 3;
        case 'Inspection': return 1;
        default: return 0;
    }
}

async function assignToEmployeeOnDate(employee, complaintType, complaintDate , userID , description) {
    const complaint = new Complaint({
        ComplaintID: generateUniqueID(),
        UserID: userID,
        Status: "In Progress",
        Description: description,
        AssignedTo: employee._id,
        SubmissionDate: new Date(),
        AssignedDate: complaintDate, // New field to indicate the scheduled date
        // Additional fields as required
    });

    await complaint.save(); // Save the complaint to the database

    // Optionally update the employee's task list for the selected date
    employee.assignedTasks.push({ 
        complaintType, 
        duration: getServiceDuration(complaintType), 
        date: complaintDate 
    });
    await employee.save(); // Save the employee's updated info
}

function generateUniqueID() {
    return uuidv4(); // Generate a unique ID for the complaint
}
