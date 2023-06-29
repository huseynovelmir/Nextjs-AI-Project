const REPLICATE_MODEL_VERSION =
    "db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf";
// f178fa7a1ae43a9a9af01b833b9d2ecf97b1bcb0acfd2dc5dd04895e042863f1


const startGeneration = async (prompt) => {
    const response = await fetch(`${process.env.API_URL}/predictions`, {
        headers: {
            Authorization: `Token ${process.env.API_TOKEN}`,
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
            version: REPLICATE_MODEL_VERSION,
            input: { prompt },
        }),
    });

    return response.json();
};




const getGeneration = async (url) => {
    const result = await fetch(url, {
        headers: {
            Authorization: `Token ${process.env.API_TOKEN}`,
            "Content-Type": "application/json",
        },
    });

    return result.json();
};



export default async function handler (request, response) {
    const {prompt } = request.body;

    if (!prompt) {
        response.status(400).json("No prompt")

        
    }
    const predictions = await startGeneration(prompt);
    let generatedImage;

    while (!generatedImage) {
            const result = await getGeneration(predictions.urls.get);

        if (result.status === "succeeded") {
                [generatedImage] = result.output;
            } else if (result.status === "failed") {
                break;
            } else {
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }

    }

    response.status(200).json(generatedImage ? generatedImage : "Failed to generate the image");



}