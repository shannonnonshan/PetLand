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
                password: hashedPassword,
                name,
                email,
                phone,
                gender: gender || 'none',
            };
            const updatedStaff = await UserService.updateStaff(id, staffData);

            if (!updatedStaff) {
                return res.send({ message: 'Staff not found' });
            }
            res.redirect('back');
        } catch (error) {
            console.error('Error updating staff:', error);
        }
    },

    async deleteStaff(req, res) {
        try {
            const staffId = req.params.id;
            
            const result = await UserService.deleteStaff(staffId);

            if (!result) {
                return res.send({ message: 'Staff not found' });
            }
            
            res.send({ success: true, message: 'Staff deleted successfully' });
        } catch (error) {
            console.error('Error deleting staff:', error);
            res.send({ success: false, message: 'Error deleting staff' });
        }
    },
};
