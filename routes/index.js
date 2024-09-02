import express from "express";
const router = express.Router();
import { sql } from "../db.js"

router.get('/years', async (req, res) => {
    try{
        const years = await sql`SELECT DISTINCT year FROM recap order by year`;
        res.status(200).json(years);
    }catch(err){console.log(err.message)}
});

router.get('/semester/:year', async (req, res) => {
    try{
        const semester = await sql`SELECT DISTINCT semester FROM recap WHERE year = ${req.params.year} order by semester`;
        res.status(200).json(semester);
    }catch(err){console.log(err.message)}
});

router.get('/batch/:year/:semester', async(req, res) => {
    try{
        const year = req.params.year;
        const semester = req.params.semester;
        const batches = await sql`
            SELECT DISTINCT class 
            FROM recap 
            WHERE year = ${year} AND semester = ${semester}
            ORDER BY class`;
        res.status(200).json(batches);
    }catch(err){console.log(err.message)}
});

router.get('/probation/:year/:semester/:batch', async(req, res) => {
    try{
        const year = req.params.year;
        const semester = req.params.semester;
        const batch = req.params.batch;
        const probations = await sql `
        WITH student_avg_marks AS (
            SELECT
                r.class,
                AVG(m.marks) AS avg_marks
            FROM
                marks m
            INNER JOIN recap r ON m.rid = r.rid
            WHERE
                r.year = ${year}
                AND r.semester = ${semester}
                AND r.class = ${batch}
            GROUP BY
                r.class, m.regno
        )
        SELECT
            class,
            COUNT(*) AS total_students,
            SUM(CASE WHEN avg_marks < 50 THEN 1 ELSE 0 END) AS students_on_probation,
            ROUND((SUM(CASE WHEN avg_marks < 50 THEN 1 ELSE 0 END) * 100.0 / COUNT(*)), 2) AS probation_rate
        FROM
            student_avg_marks
        GROUP BY
            class;
        ` ;
        res.status(200).json(probations);
    console.log(probations);

    }catch(err){console.log(err.message)}
})

// router.get('/recap/:year/:semester/:batch', async(req, res) => {
//     try{
        // const year = req.params.year;
        // const semester = req.params.semester;
        // const batch = req.params.batch;
//         const recaps = await sql`
//         select DISTINCT title from course c inner join recap r on c.cid=r.cid where year=${year} AND semester=${semester} AND class=${batch}`;
//         res.status(200).json(recaps);
//     }catch(err){console.log(err.message)}
// })


export default router;