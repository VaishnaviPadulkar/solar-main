import Contact from "../models/Contact.js";

export const submitContact = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        const newContact = await Contact.create({ name, email, phone, message });

        res.status(201).json(newContact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Delete contact
export const deleteContact = async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Contact deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
