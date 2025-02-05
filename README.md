# Vision Edge Svelte App

This is a **SvelteKit** based project that uses **ControlNet-Hough** via the **Replicate** API to generate images from edges detected in an input image.

## 🚀 Features
- Upload an image and apply ControlNet-Hough.
- Generate AI-powered images using the Replicate API.
- Interface optimized with **SvelteKit** and **TailwindCSS**.
- Clean code with **TypeScript**, **ESLint** and **Prettier**.

---

## 🛠 Installation and Configuration

### 1️⃣ Clone the repository
```bash
git clone https://github.com/JairMendoza/vision-edge.git
cd vision-edge
```

### 2️⃣ Install dependencies
```bash
pnpm install
```

### 3️⃣ Setting up the Replicate API
Create a `.env` file in the root of your project and add your **Replicate** API key:
```bash
VITE_REPLICATE_API_TOKEN=your_token_here
```

### 4️⃣ Run the project in development mode
```bash
pnpm run dev
```

---

## 📂 Project Structure
```
vision-edge/
│── src/
│   ├── routes/
│   │   ├── +page.svelte   # Main interface
│   │   ├── api/
│   │   │   ├── generate/+server.js   # Replicate API Calls
│   ├── styles/   # Styles with TailwindCSS
│── static/   # Static resources
│── .env   # Environment Variables
│── package.json   # Project setup
```

---

## 📌 Technologies Used
- **SvelteKit** (Frontend Framework)
- **TypeScript** (Static Typing)
- **TailwindCSS** (Fast and flexible styling)
- **Replicate API** (Image generation with ControlNet-Hough)
- **ESLint & Prettier** (Clean and well-formatted code)


