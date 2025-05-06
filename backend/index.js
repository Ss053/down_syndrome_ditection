const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { PythonShell } = require("python-shell");
const path = require("path");

const app = express();
app.use(cors());

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// POST route to upload image and get prediction from Python model
app.post("/upload", upload.single("image"), (req, res) => {
  const imagePath = path.join(__dirname, req.file.path);
  console.log("Image path sent to Python:", imagePath);

  // PythonShell options
  let options = {
    args: [imagePath],
  };

  // Run the Python script and handle results
  PythonShell.run("model_script.py", options).then(result =>{
    console.log(result)
    let report = result[2]
    console.log
    res.status(200).json({"prediction":report})
  });
    
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
