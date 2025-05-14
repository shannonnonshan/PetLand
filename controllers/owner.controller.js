import UserService from '../services/user.service.js';
import bcrypt from 'bcryptjs';

export default {
    async createStaff(req, res) {
        try {
            const { username, password, name, email, phone, gender } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);

            const staffData = {
                username,
                password: hashedPassword,
                name,
                email,
                phone,
                gender: gender || 'none',
                role: "Staff",
            };

            await UserService.add(staffData);
            res.send({ message: 'Staff created successfully' });
        } catch (error) {
            console.error("Error creating staff:", error);
            res.send({ message: 'Failed to create staff' });
        }
    },

    async updateStaff(req, res) {
        try {
            const { id } = req.params;
            const { username, name, email, phone, gender } = req.body;

            const staffData = {
                username,
                name,
                email,
                phone,
                gender: gender || 'none',
                role: "Staff",
            };

            const updatedStaff = await UserService.updateStaff(id, staffData);

            if (!updatedStaff) {
                return res.send({ message: 'Staff not found' });
            }

            res.send({ message: 'Staff updated successfully' });
        } catch (error) {
            console.error('Error updating staff:', error);
            res.send({ message: 'Failed to update staff' });
        }
    },

    async deleteStaff(req, res) {
        try {
            const staffId = req.params.id;
            
            const result = await UserService.deleteStaff(staffId);

            if (!result) {
                return res.send({ message: 'Staff not found' });
            }
            
            res.send({ message: 'Staff deleted successfully' });
        } catch (error) {
            console.error('Error deleting staff:', error);
            res.send({ message: 'Error deleting staff' });
        }
    },
};
