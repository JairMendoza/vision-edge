import { json } from "@sveltejs/kit";
import Replicate from "replicate";

export async function POST({ request }) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const prompt = formData.get("prompt");
    const scale = formData.get("scale");
    const ddim_steps = formData.get("ddim_steps");
    const eta = formData.get("eta");
    const value_threshold = formData.get("value_threshold");
    const image_resolution = formData.get("image_resolution");
    const detect_resolution = formData.get("detect_resolution");
    const distance_threshold = formData.get("distance_threshold");

    if (!file) {
      return json({ error: "No se recibió ningún archivo." }, { status: 400 });
    }
    const replicate = new Replicate({
      auth: import.meta.env.VITE_REPLICATE_API_TOKEN
    });
    const description = await replicate.run(
      "salesforce/blip:2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746",
      {
        input: {
          task: "image_captioning",
          image: file
        }
      }
    );
    const descriptionStr = String(description).replace("Caption: ", "").trim().toLowerCase();
    const roomTypes = ["kitchen", "living room", "bedroom", "bathroom", "hallway"];
    let detectedRoom = roomTypes.find(room => descriptionStr.includes(room)) || "general room";
    const hasWindow = descriptionStr.includes("window");
    const hasDoor = descriptionStr.includes("door");
    const structuredDescription = `A ${detectedRoom} with ${hasWindow ? "windows," : "no windows,"} and ${hasDoor ? "doors," : "no doors,"}`;

    function generatePrompts(description = "") {
      let a_prompt = `best quality, extremely detailed, photorealistic, realistic lighting, soft shadows, high resolution, interior of a ${detectedRoom}`;
      let n_prompt = "lowres, bad perspective, distorted, unrealistic shadows, blurry, unnatural lighting";

      if (description.includes("window")) {
        a_prompt += ", large windows with natural light";
      } else {
        n_prompt += ", no windows";
      }
      if (description.includes("door")) {
        a_prompt += ", elegant wooden doors";
      } else {
        n_prompt += ", no visible doors";
      }
      if (description.includes("wooden floor")) {
        a_prompt += ", natural wooden textures";
      } else {
        n_prompt += ", generic floor textures";
      }
      return { a_prompt, n_prompt };
    }

    const { a_prompt, n_prompt } = generatePrompts(structuredDescription);
    const totalDescription = String(description).replace("Caption: ", "").trim() +  " " + prompt;
    console.log(totalDescription)
    const output = await replicate.run(
      "jagilley/controlnet-hough:854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b",
      {
        input: {
          image: file,
          prompt: totalDescription,
          scale: Number(scale),
          a_prompt,
          n_prompt,
          ddim_steps: Number(ddim_steps),
          num_samples: '1',
          value_threshold: Number(value_threshold),
          image_resolution,
          detect_resolution: Number(detect_resolution),
          distance_threshold: Number(distance_threshold),
          eta: Number(eta),
        }
      }
    );
    const output_images = [];
    for (const item of Object.values(output)) {
      const image = item.toString('base64');
      output_images.push(`${image}`);
    }
    return json({ output: output_images });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}