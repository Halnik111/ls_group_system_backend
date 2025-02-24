import vision from "@google-cloud/vision";
import { Storage } from "@google-cloud/storage";
import path from 'path';

const client = new vision.ImageAnnotatorClient({
    keyFilename: './key.json'
});

const storage = new Storage({
    keyFilename: './key.json'
});

const bucketName = 'ls-group-files';
const bucket = storage.bucket(bucketName);

const uploadToCloud = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) return reject("No file provided");

        const blob = bucket.file(Date.now() + path.extname(file.originalname));
        const blobStream = blob.createWriteStream({
            resumable: false,
            metadata: {
                contentType: file.mimetype,
            },
        });

        blobStream.on("finish", async () => {
            //await blob.makePublic();
            const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
            resolve(publicUrl);
        });

        blobStream.on("error", (err) => {
            reject(err);
        });

        blobStream.end(file.buffer);
    });
}

export const test = async (req, res) => {
    try {
        // db.select('*').from('run')
        //     .then(data => {
        //         console.log(data);
        //     })

        //

    // Performs text detection on the local file
    //     const [result] = await client.textDetection(fileName);
    //     const detections = result.textAnnotations;
    //     console.log('Text:');
    //     detections.forEach(text => console.log(text));
    //
    //     res.status(200).json(detections)

        // res.status(200).json('1')

// Creates a client
        
            await storage.bucket(bucketName).makePublic();
            console.log(`Bucket ${bucketName} is now publicly readable`);
        
    }
    catch (err) {
        res.status(409).json("message: " + err.message);
    }
};

export const readImage = async (req, res) => {
    try {
        
    }
    catch (err) {
        res.status(409).json("message: " + err.message);
    }
}

export const uploadImage = async (req, res) => {
    try {
        console.log(req.file);

        const fileUrl = await uploadToCloud(req.file);

        console.log("+ " + fileUrl)
        res.json({
            message: "File uploaded successfully", url: fileUrl
        })
    }
    catch (err) {
        res.status(500).json("message: " + err.message);
    }
}