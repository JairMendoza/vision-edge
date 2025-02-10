<script>
  let generatedImage1 = null;
  let generatedImage2 = null;
  let loading = false;
  let errorMessage = "";

  let color = "white";
  let promptBase = "Well lit, modernist, minimalist, geometric shapes, soft colors, clean lines and the walls are painted {color}.";
  let prompt = promptBase.replace("{color}", color);
  let scale = 8;
  let a_prompt = "best quality, extremely detailed, photorealistic, realistic lighting, soft shadows";
  let n_prompt = "extra digit, fewer digits, cropped, worst quality, low quality, blurry, unrealistic, distorted, out of focus, surreal, bizarre, noisy, overly saturated, incorrect perspective, window";
  let ddim_steps = 25;
  let num_samples = "1";
  let value_threshold = 0.5;
  let detect_resolution = 512;
  let distance_threshold = 0.2;
  let image_resolution = "512";
  let file = '';

  function updatePrompt() {
    prompt = promptBase.replace("{color}", color);
  }

  async function generateImage() {
    if (!file) {
      errorMessage = "Por favor, sube una imagen antes de generar.";
      return;
    }

    loading = true;
    errorMessage = "";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("prompt", prompt);
    formData.append("scale", scale);
    formData.append("a_prompt", a_prompt);
    formData.append("n_prompt", n_prompt);
    formData.append("ddim_steps", ddim_steps);
    formData.append("num_samples", num_samples);
    formData.append("value_threshold", value_threshold);
    formData.append("detect_resolution", detect_resolution);
    formData.append("distance_threshold", distance_threshold);
    formData.append("image_resolution", image_resolution);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      generatedImage1 = data.output[0];
      generatedImage2 = data.output[1];

    } catch (error) {
      errorMessage = "Hubo un error al generar la imagen.";
    } finally {
      loading = false;
    }
  }
</script>

<main class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex flex-col items-center p-6">
  <h1 class="text-3xl font-bold mb-6 text-center">Generador de Imágenes con ControlNet-Hough</h1>

  <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full max-w-2xl">
    <label class="block font-semibold text-lg mb-2">Subir Imagen:</label>
    <input type="text" bind:value={file} class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md mb-4 text-gray-600" placeholder="URL o archivo de imagen" />

    <label class="block font-semibold text-lg mb-2">Color de las Paredes:</label>
    <input type="text" bind:value={color} on:input={updatePrompt} class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md mb-4 text-gray-600" placeholder="Ejemplo: blue, red, beige..." />

    <label class="block font-semibold text-lg mb-2">Descripción Generada:</label>
    <textarea bind:value={prompt} rows="3" readonly class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-200 dark:bg-gray-700"></textarea>

    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
      <div>
        <label class="block text-sm font-medium">Escala:</label>
        <input type="number" bind:value={scale} min="1" max="10" class="w-full p-2 border rounded-md text-gray-600" />
      </div>
      <div>
        <label class="block text-sm font-medium">Muestras:</label>
        <input type="number" bind:value={num_samples} min="1" max="5" class="w-full p-2 border rounded-md text-gray-600" />
      </div>
      <div>
        <label class="block text-sm font-medium">DDIM Steps:</label>
        <input type="number" bind:value={ddim_steps} min="1" max="50" class="w-full p-2 border rounded-md text-gray-600" />
      </div>
      <div>
        <label class="block text-sm font-medium">Umbral de Valor:</label>
        <input type="number" bind:value={value_threshold} step="0.1" min="0" max="1" class="w-full p-2 border rounded-md text-gray-600" />
      </div>
      <div>
        <label class="block text-sm font-medium">Resolución:</label>
        <input type="number" bind:value={image_resolution} min="128" max="1024" class="w-full p-2 border rounded-md text-gray-600" />
      </div>
      <div>
        <label class="block text-sm font-medium">Detección:</label>
        <input type="number" bind:value={detect_resolution} min="128" max="1024" class="w-full p-2 border rounded-md text-gray-600" />
      </div>
    </div>

    <button on:click={generateImage} disabled={loading}
      class="w-full mt-6 py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition disabled:bg-gray-400">
      {loading ? "Generando..." : "Generar Imagen"}
    </button>

    {#if loading}
      <p class="text-center text-gray-500 mt-2">🔄 Generando imagen, por favor espera...</p>
    {/if}

    {#if errorMessage}
      <p class="text-center text-red-500 mt-2">⚠️ {errorMessage}</p>
    {/if}
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full max-w-full">
    {#if file}
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold text-center mb-2">Imagen Base</h2>
        <img src={file} alt="Imagen base" class="w-full rounded-md" />
      </div>
    {/if}
    {#if generatedImage2}
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold text-center mb-2">Imagen Generada</h2>
        <img src={generatedImage2} alt="Resultado de ControlNet" class="w-full rounded-md" />
      </div>
    {/if}
    {#if generatedImage1}
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold text-center mb-2">Imagen Generada</h2>
        <img src={generatedImage1} alt="Resultado de ControlNet" class="w-full rounded-md" />
      </div>
    {/if}
  </div>
</main>