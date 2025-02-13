<script>
  import 'img-comparison-slider';
  import 'img-comparison-slider/dist/styles.css';
  import classNames from 'classnames';

  

  let generatedImage1 = "";
  let generatedImage2 = "";
  let loading = false;
  let errorMessage = "";

  let color = "white";
  let developerMode = false;
  let promptBase = "Well lit, modernist, minimalist, geometric shapes, soft colors, clean lines and the walls are painted {color}.";
  let prompt = promptBase.replace("{color}", color);
  let scale = 9;
  let aPrompt = "photorealistic, best quality, extremely detailed, realistic lighting, soft shadows";
  let nPrompt = "extra digit, fewer digits, cropped, worst quality, low quality, blurry, unrealistic, distorted, out of focus, surreal, bizarre, noisy, overly saturated, incorrect perspective, window";
  let ddimSteps = 25;
  let eta = 0.5;
  let valueThreshold = 0.25;
  let detectResolution = 512;
  let distanceThreshold = 0.15;
  let imageResolution = "512";
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
    formData.append("scale", String(scale));
    formData.append("a_prompt", aPrompt);
    formData.append("n_prompt", nPrompt);
    formData.append("ddim_steps", String(ddimSteps));
    formData.append("eta", String(eta));
    formData.append("value_threshold", String(valueThreshold));
    formData.append("detect_resolution", String(detectResolution));
    formData.append("distance_threshold", String(distanceThreshold));
    formData.append("image_resolution", imageResolution);
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

<style>
  @keyframes fadeInMagic {
    from {
      opacity: 0;
      transform: scale(0.8);
      filter: blur(10px);
    }
    to {
      opacity: 1;
      transform: scale(1);
      filter: blur(0);
    }
  }

  @keyframes flashEffect {
    0% { opacity: 0.5; transform: scale(1.1); filter: brightness(2); }
    100% { opacity: 1; transform: scale(1); filter: brightness(1); }
  }

  .generated-image-container {
    position: relative;
    animation: fadeInMagic 0.8s ease-out;
  }

  .generated-image-container::before {
    content: "";
    position: absolute;
    width: 120%;
    height: 120%;
    top: -10%;
    left: -10%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 10%, rgba(255, 255, 255, 0) 70%);
    opacity: 0;
    animation: flashEffect 0.5s ease-out;
  }
</style>

<main class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex flex-col items-center p-6">
  <h1 class="text-3xl font-bold mb-6 text-center">Generador de Imágenes con IA</h1>

  <div class="flex items-center space-x-3 mb-6">
    <label for='developerMode' class="text-lg font-semibold">Developer Mode</label>
    <input type="checkbox" bind:checked={developerMode} class="w-6 h-6" />
  </div>

  <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full max-w-full">
    <div class="flex w-full gap-8 min-h-full">
      <div class="w-full">
        <label for="url_image" class="block font-semibold text-lg mb-2">Subir Imagen:</label>
        <input id="image_url" type="text" bind:value={file} class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md mb-4 text-gray-600" placeholder="URL de imagen" />
        <label for="walls_color" class="block font-semibold text-lg mb-2">Color de las Paredes:</label>
        <input id="walls_color" type="text" bind:value={color} on:input={updatePrompt} class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md mb-4 text-gray-600" placeholder="Ejemplo: blue, red, beige..." />
      </div>
      <div class="w-full h-full">
        <label for="prompt" class="block font-semibold text-lg mb-2">Descripción Generada:</label>
        <textarea id="prompt" bind:value={prompt} rows="3" class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-200 dark:bg-gray-700 h-36"></textarea>
      </div>
    </div>

    {#if developerMode}
      <div class="grid grid-cols-3 md:grid-cols-6 gap-4 mt-4">
        <div>
          <label for="scale" class="block text-sm font-medium">Escala:</label>
          <input id="scale" type="number" bind:value={scale} min="1" max="10" class="w-full p-2 border rounded-md text-gray-600" />
        </div>
        <div>
          <label for="eta" class="block text-sm font-medium">ETA:</label>
          <input id="eta" type="number" bind:value={eta} min="0.0" max="1.0" class="w-full p-2 border rounded-md text-gray-600" />
        </div>
        <div>
          <label for="ddimSteps" class="block text-sm font-medium">DDIM Steps:</label>
          <input id="ddimSteps" type="number" bind:value={ddimSteps} min="1" max="50" class="w-full p-2 border rounded-md text-gray-600" />
        </div>
        <div>
          <label for="valueThreshold" class="block text-sm font-medium">Umbral de Valor:</label>
          <input id="valueThreshold" type="number" bind:value={valueThreshold} step="0.1" min="0" max="1" class="w-full p-2 border rounded-md text-gray-600" />
        </div>
        <div>
          <label for="imageResolution" class="block text-sm font-medium">Resolución:</label>
          <input id="imageResolution" type="number" bind:value={imageResolution} min="128" max="1024" class="w-full p-2 border rounded-md text-gray-600" />
        </div>
        <div>
          <label for="detectResolution" class="block text-sm font-medium">Detección:</label>
          <input id="detectResolution" type="number" bind:value={detectResolution} min="128" max="1024" class="w-full p-2 border rounded-md text-gray-600" />
        </div>
      </div>
    {/if}

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
  {#if !loading}
    <div class={classNames(developerMode ? "grid-cols-1 md:grid-cols-3 " : "flex items-center justify-center", "gap-6 mt-6 w-full max-w-full grid")}>
      {#if generatedImage2 && file}
      <div class="generated-image-container bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md w-fit h-fit">
        <h2 class="text-lg font-semibold text-center mb-2">Comparación</h2>
        <img-comparison-slider class="max-w-screen-md w-full">
        <img class="w-full h-full object-cover" alt="origina_file" slot="first" src={file} />
        <img class="w-full h-full object-cover" alt="generated_image2" slot="second" src={generatedImage2} />
      </img-comparison-slider>
    </div>
    {/if}
    {#if generatedImage1 && developerMode}
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold text-center mb-2">Imagen Generada</h2>
        <img src={generatedImage2} alt="Resultado de ControlNet" class="w-full rounded-md" />
      </div>
    {/if}
    {#if generatedImage1 && developerMode}
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold text-center mb-2">Imagen Generada</h2>
        <img src={generatedImage1} alt="Resultado de ControlNet" class="w-full rounded-md" />
      </div>
    {/if}
    </div>
  {/if}
</main>