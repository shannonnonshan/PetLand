import UserService from '../services/user.service.js';
import bcrypt from 'bcryptjs';

export default {
    async createStaff(req, res) {
        try {
            const { username, password, name, email, phone, gender } = req.body;
            const avatar = req.file ? req.file.filename : null; // Handle avatar upload (optional)

            const hashedPassword = await bcrypt.hash(password, 10);

            const staffData = {
                username,
                password: hashedPassword,
                name,
                email,
                phone,
                gender: gender || 'none', // fallback to 'none' if not selected
                avatar,
                role: "Staff",
            };

            const newStaff = await UserService.add(staffData);
            return res.status(201).json({ message: "Staff created successfully", staff: newStaff });
        } catch (error) {
            console.error("Error creating staff:", error);
            return res.status(500).json({ message: "Failed to create staff" });
        }
    },

    async updateStaff(req, res) {
        try {
            const { id } = req.params;
            const { name, email, phone } = req.body;

            const updatedStaff = await UserService.updateUserforShift(id, name, phone, email);
            if (!updatedStaff) {
                return res.status(404).json({ message: "Staff not found" });
            }

            return res.status(200).json({ message: "Staff updated successfully", staff: updatedStaff });
        } catch (error) {
            console.error("Error updating staff:", error);
            return res.status(500).json({ message: "Failed to update staff" });
        }
    },

    async deleteStaff(req, res) {
        try {
            const { id } = req.params;

            const deletedStaff = await UserService.deleteStaff(id);
            if (!deletedStaff) {
                return res.status(404).json({ message: "Staff not found" });
            }

            return res.status(200).json({ message: "Staff deleted successfully" });
        } catch (error) {
            console.error("Error deleting staff:", error);
            return res.status(500).json({ message: "Failed to delete staff" });
        }
    },
};
