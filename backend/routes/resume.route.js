import express from "express";
import path from "path";
import fs from "fs";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.get("/:filename", isAuthenticated, (req, res) => {
    try {
        const filePath = path.join(process.cwd(), 'uploads', 'resumes', req.params.filename);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: "Resume not found"
            });
        }

        // Set proper headers for PDF viewing
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${req.params.filename}"`);
        
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching resume"
        });
    }
});

export default router;