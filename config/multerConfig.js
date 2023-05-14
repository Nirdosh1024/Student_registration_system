const multer = require("multer");
const path = require("path");

// multer setup to upload files to the server
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, path.join(__dirname, '../uploads/document'));
        }
        else if (file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            cb(null, path.join(__dirname, '../uploads/studentData'));
        }
        else {
            cb(null, path.join(__dirname, '../uploads/image'));
        }
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, name);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.mimetype === 'application/pdf') {
        cb(null, true)
    }
    else { cb(null, false) }
}

module.exports = multer({
    storage: storage,
    fileFilter: fileFilter
}).fields([{ name: 'excel', maxCount: 1 }, { name: 'photo_file', maxCount: 1 },
{ name: 'category_file', maxCount: 1 }, { name: 'income_file', maxCount: 1 },
{ name: 'signature_file', maxCount: 1 }, { name: 'highschool_marksheet', maxCount: 1 },
{ name: 'inter_marksheet', maxCount: 1 }, { name: 'enrollment_letter', maxCount: 1 },
{ name: 'academicfee_receipt', maxCount: 1 },
{ name: 'hostelfee_receipt', maxCount: 1 }, { name: 'messfee_receipt', maxCount: 1 },
{ name: 'messsecurityfee_receipt', maxCount: 1 },
{ name: 'maintenancefee_receipt', maxCount: 1 }]);

