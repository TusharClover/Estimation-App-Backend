const mysql = require('mysql2/promise');

const pool = require('../config/db');

createProposedScheduleByEstnId = async(req) => {
    console.log(req, "request");
    try {
        // Extracting the array of proposed schedules from the request
        const { proposedSchedule } = { "proposedSchedule": req }; // `proposedSchedule` is expected to be an array of objects
        console.log(proposedSchedule, "proposedSchedule");

        if (!Array.isArray(proposedSchedule) || proposedSchedule.length === 0) {
            throw new Error("No data provided for bulk insert");
        }

        // Insert proposed schedules into the estimation_proposed_schedules table
        const scheduleValues = proposedSchedule.map(schedule => `(
            ${schedule.phase_id},
            "${schedule.phase_name}",
            ${schedule.site_id},
            "${schedule.site_name}",
            ${schedule.profile_id},
            "${schedule.profile_name}",
            ${schedule.schedule_order},
            ${schedule.estimation_id}
        )`).join(',');

        const scheduleQuery = `
            INSERT INTO estimation_proposed_schedules (
                phase_id,
                phase_name,
                site_id,
                site_name,
                profile_id,
                profile_name,
                schedule_order,
                estimation_id
            ) VALUES ${scheduleValues}
        `;

        // Execute the query to insert proposed schedules
        const [scheduleRows] = await pool.execute(scheduleQuery);
        console.log(scheduleRows, "Proposed Schedules Inserted");

        // After inserting the proposed schedules, we need to retrieve the inserted schedule ids
        const insertedScheduleIds = Array.from({ length: proposedSchedule.length }, (_, i) => scheduleRows.insertId + i);
        console.log(insertedScheduleIds, "Inserted Schedule IDs");

        // Insert weeks data linked to the newly inserted proposed schedules
        const weekValues = proposedSchedule.flatMap((schedule, index) =>
            schedule.weeks.map(week => `(
                ${week.days_count},
                ${week.week_order},
                ${week.estimation_id},
                ${insertedScheduleIds[index]}  -- Proposed schedule ID from the phases insert
            )`)
        ).join(',');

        const weekQuery = `
            INSERT INTO weeks (
                days_count,
                week_order,
                estimation_id,
                proposed_schedule_id
            ) VALUES ${weekValues}
        `;

        // Execute the query to insert weeks
        const [weekRows] = await pool.execute(weekQuery);
        console.log(weekRows, "Weeks Inserted");

        // Return the rows from the week insert operation with the correct ids
        return weekRows;
    } catch (error) {
        console.error(error);
        throw new Error("Error while creating proposed schedules and weeks");
    }
};

getProposedScheduleByEstnId = async(req) => {
    try {
        // Step 1: Fetch proposed schedules based on estimation_id
        const proposedSchedulesQuery = `
            SELECT * FROM estimation_proposed_schedules 
            WHERE estimation_id = ?;
        `;
        const [proposedSchedules] = await pool.execute(proposedSchedulesQuery, [req.id]);

        // Step 2: Fetch the associated weeks for each proposed schedule
        const weeksQuery = `
            SELECT * FROM weeks 
            WHERE estimation_id = ?;
        `;
        const [weeks] = await pool.execute(weeksQuery, [req.id]);

        // Step 3: Map the weeks data to the respective proposed schedule
        const schedulesWithWeeks = proposedSchedules.map(schedule => {
            // Filter the weeks corresponding to the current proposed schedule
            const scheduleWeeks = weeks.filter(week => week.proposed_schedule_id === schedule.id);

            // Sort the weeks by week_order in ascending order
            scheduleWeeks.sort((a, b) => a.week_order - b.week_order);

            // Add the sorted weeks to the schedule
            schedule.weeks = scheduleWeeks;
            return schedule;
        });

        // Step 4: Sort the proposed schedules by schedule_order in ascending order
        schedulesWithWeeks.sort((a, b) => a.schedule_order - b.schedule_order);

        // Return the schedules with the mapped and sorted weeks data
        return schedulesWithWeeks;
    } catch (error) {
        throw error; // Re-throw for handling in the controller
    }
};


updateProposedScheduleByEstnId = async(req) => {
    console.log(req, "request");
    try {
        // Extracting the array of proposed schedules from the request
        const { proposedSchedule } = { "proposedSchedule": req }; // `proposedSchedule` is expected to be an array of objects
        console.log(proposedSchedule, "proposedSchedule");

        if (!Array.isArray(proposedSchedule) || proposedSchedule.length === 0) {
            throw new Error("No data provided for bulk update");
        }

        // Update proposed schedules in the estimation_proposed_schedules table
        for (let schedule of proposedSchedule) {
            const scheduleUpdateQuery = `
                UPDATE estimation_proposed_schedules
                SET 
                    phase_id = ${schedule.phase_id},
                    phase_name = "${schedule.phase_name}",
                    site_id = ${schedule.site_id},
                    site_name = "${schedule.site_name}",
                    profile_id = ${schedule.profile_id},
                    profile_name = "${schedule.profile_name}",
                    schedule_order = ${schedule.schedule_order}
                WHERE estimation_id = ${schedule.estimation_id} AND id = ${schedule.id}
            `;

            // Execute the query to update the proposed schedule
            await pool.execute(scheduleUpdateQuery);
            console.log(`Updated schedule with ID: ${schedule.id}`);
        }

        // Update weeks data linked to the proposed schedules
        for (let schedule of proposedSchedule) {
            // Delete existing weeks linked to the schedule before updating
            const deleteWeekQuery = `
                DELETE FROM weeks
                WHERE proposed_schedule_id = ${schedule.id}
            `;
            await pool.execute(deleteWeekQuery);

            // Insert new weeks data for the updated schedule
            const weekValues = schedule.weeks.map(week => `(
                ${week.days_count},
                ${week.week_order},
                ${week.estimation_id},
                ${schedule.id}  -- Proposed schedule ID
            )`).join(',');

            const weekUpdateQuery = `
                INSERT INTO weeks (
                    days_count,
                    week_order,
                    estimation_id,
                    proposed_schedule_id
                ) VALUES ${weekValues}
            `;

            // Execute the query to insert weeks data
            await pool.execute(weekUpdateQuery);
            console.log(`Updated weeks for schedule ID: ${schedule.id}`);
        }

        // Return success message or relevant information
        return { success: true, message: "Proposed schedules and weeks updated successfully" };
    } catch (error) {
        console.error(error);
        throw new Error("Error while updating proposed schedules and weeks");
    }
};




module.exports = { createProposedScheduleByEstnId, getProposedScheduleByEstnId, updateProposedScheduleByEstnId };