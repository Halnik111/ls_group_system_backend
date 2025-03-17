import vision from "@google-cloud/vision";
import {Storage} from "@google-cloud/storage";
import path from 'path';
import OpenAI from "openai";


const client = new vision.ImageAnnotatorClient({
    keyFilename: './key.json'
});

const storage = new Storage({
    keyFilename: './key.json'
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

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
};

const readImage = async (fileUrl) => {
    try {
        const [result] = await client.textDetection(fileUrl);
        return result.textAnnotations;
    }
    catch (err) {
        throw err;
    }
};

const findIdWithAi = async (imageUrl, detections) => {
    
    const res = await fetch(imageUrl);
    const buffer = await res.arrayBuffer();
    const base64Image  = Buffer.from(buffer).toString("base64");

    
    const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
            { role: "system", content: "You are an AI that extracts product IDs from product labels. Return a JSON with the product ID." },
            { role: "user", content: "Analyze this image and return the 'productID' in JSON format." },
            {
                role: "user",
                content: [
                    { type: "text", text: "Analyze this image and return the product ID" },
                    { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}`} }
                ]
            }
        ],
        max_tokens: 200,
        response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0]?.message?.content || "{}");
    
    detections.map(detection => {
        if (detection.description === result.productID) {
            result.productIDLocation = detection.boundingPoly
        }
    });
    
    console.log(result);
    return result
}

export const test = async (req, res) => {
    try {
        
        const idAndLocation = await findIdWithAi("https://storage.googleapis.com/ls-group-files/1740593034196")
     
        res.status(200).json(idAndLocation)
    }
    catch (err) {
        res.status(409).json("message: " + err.message);
    }
};

export const uploadImage = async (req, res) => {
    try {
        const fileUrl = await uploadToCloud(req.file);
        const detections = await readImage(fileUrl);
        const aiDetection = await findIdWithAi(fileUrl, detections);
        
        res.json({
            message: "File uploaded and scanned successfully",
            url: fileUrl,
            detections: detections,
            product: aiDetection
        })
    }
    catch (err) {
        res.status(500).json("message: " + err.message);
    }
}