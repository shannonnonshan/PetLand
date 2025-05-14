import UserService from '../services/user.service.js';
import bcrypt from 'bcryptjs';
import moment from 'moment';

export default {
    // Create new staff
    async createStaff(req, res) {
        try {
            const { username, password, name, email, phone, gender } = req.body;
            const avatar = req.file ? req.file.filename : null;

            const hashedPassword = await bcrypt.hash(password, 10);

            const staffData = {
                username,
                password: hashedPassword,
                name,
                email,
                phone,
                gender: gender || 'none',
                avatar,
                role: "Staff",
            };

            const newStaff = await UserService.add(staffData);
            res.json({ success: true, message: 'Staff created successfully' });
        } catch (error) {
            console.error("Error creating staff:", error);
            res.json({ success: false, message: "Failed to create staff" })
        }
    },

    async updateStaff(req, res) {
        try {
            const { id } = req.params;
            const { username, password, name, email, phone, gender } = req.body;
            const avatarPath = req.file ? req.file.path : null;
            const hashedPassword = await bcrypt.hash(password, 10);

            const staffData = {
                username,
                password: hashedPassword,
                name,
                email,
                phone,
                gender: gender || 'none',
                avatar : avatarPath,
                role: "Staff",
            };
            
            const updatedStaff = await UserService.updateStaff(id, staffData);

            if (!updatedStaff) {
                return res.json({ success: false, message: 'Staff not found' });
            }

            res.json({ success: true, message: 'Staff updated successfully' });
        } catch (error) {
            console.error('Error updating staff:', error);
            res.json({ success: false, message: 'Failed to update staff' });
        }
    },

    async deleteStaff(req, res) {
        try {
            const staffId = req.params.id;
            
            const result = await UserService.deleteStaff(staffId);

            if (!result) {
                return res.json({ success: false, message: 'Staff not found' });
            }
            
            res.json({ success: true, message: 'Staff deleted successfully' });
        } catch (error) {
            console.error('Error deleting staff:', error);
            res.json({ success: false, message: 'Error deleting staff' });
        }
    },
};
