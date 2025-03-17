
export const getMaterial = async (req, res) => {
    try {

        res.status(200).json()
    }
    catch (err) {
        res.status(500).json("message: " + err.message);
    }
};

export const addMaterial = async (req, res) => {
    try {
        
        res.status(201).json()
    }
    catch (err) {
        res.status(500).json("message: " + err.message);
    }
}

export const deleteMaterial = async (req, res) => {
    try {

        res.status(200).json()
    }
    catch (err) {
        res.status(500).json("message: " + err.message);
    }
};