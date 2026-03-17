This Design System documentation is reverse-engineered from the provided "Murph AI" landing screen code.

# Design System: Murph AI (Ethereal Dark Mode)

## 1. Core Principles
*   **Futuristic Minimalism**: A clean, high-contrast aesthetic that prioritizes negative space and sharp typography.
*   **Atmospheric Depth**: The use of "Ethereal Glows," noise textures, and glassmorphism to create a sense of digital three-dimensionality.
*   **Immersive Experience**: Designed as a full-viewport experience (`overflow: hidden`, `100vh`) rather than a traditional scrolling page.
*   **Tech-Forward**: Utilizes geometric sans-serif typography and vibrant neon accents against a near-black background to evoke an advanced AI persona.

## 2. Color Palette

### Base Colors
| Name | Hex / Value | Tailwind Class (Equivalent) | Usage |
| :--- | :--- | :--- | :--- |
| **Deep Background** | `#050505` | `bg-[#050505]` | Primary page background |
| **Pure White** | `#FFFFFF` | `text-white` | Primary text and high-contrast elements |

### Accent Colors
| Name | Hex / Value | Usage |
| :--- | :--- | :--- |
| **Electric Blue** | `#00E0FF` | Primary accent, radial gradients, interactive states |
| **Deep Purple** | `#7000FF` | Secondary accent, depth gradients |

### Glassmorphism (Surfaces)
| Name | Value | Usage |
| :--- | :--- | :--- |
| **Glass Surface** | `rgba(255, 255, 255, 0.03)` | Card backgrounds, navigation bars |
| **Glass Border** | `rgba(255, 255, 255, 0.08)` | Subtle borders for containers |

## 3. Typography
*   **Primary Font Family**: `Outfit`, sans-serif (Geometric, modern).
*   **Weights**: 100 (Thin), 300 (Light), 400 (Regular), 500 (Medium), 700 (Bold), 900 (Black).
*   **Scale**:
    *   **Headings**: High weight (700-900) with tight letter spacing.
    *   **Body**: Regular weight (400) with optimized legibility against dark backgrounds.

## 4. Spacing & Layout
*   **Container**: Full-screen layout (`min-height: 100vh`) with content typically centered or structured within a flex/grid system.
*   **Layering (Z-Index)**:
    *   `z-0`: Background glows and gradients.
    *   `z-10 to z-40`: Main content and interactive elements.
    *   `z-50`: Noise overlay (global texture).
*   **Visual Texture**: A fractal noise SVG overlay is used globally to soften gradients and add a "film grain" premium feel.

## 5. Components

### Atmospheric Elements
*   **Ethereal Glow**: Large, blurred radial gradients (`600px` x `600px`) using `blur(80px)` to create soft lighting behind content.
*   **Noise Overlay**: A fixed, low-opacity (4%) SVG filter that provides a tactile texture to the flat digital surface.

### Containers (Glassmorphism)
*   **Glass Card**: Uses `var(--glass)` background and `var(--glass-border)` for a semi-transparent, frosted-look container.

### Animations
*   **Murph Float**: A keyframe animation (`float`) used to give UI elements a subtle, weightless movement (6s duration, ease-in-out).

## 6. Iconography
*   **Style**: While specific icons aren't in the snippet, the aesthetic dictates thin-stroke, monolinear icons (e.g., Lucide, Phosphor, or Heroicons) to match the `Outfit` typeface and the minimalist theme.

---

## Reference HTML

```html
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Murph AI | Curiosity Starts Here</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100;300;400;500;700;900&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --bg-deep: #050505;
            --electric-blue: #00E0FF;
            --deep-purple: #7000FF;
            --glass: rgba(255, 255, 255, 0.03);
            --glass-border: rgba(255, 255, 255, 0.08);
        }

        body {
            font-family: 'Outfit', sans-serif;
            background-color: var(--bg-deep);
            color: white;
            overflow: hidden;
            min-height: 100vh;
        }

        .ethereal-glow {
            position: absolute;
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, rgba(0, 224, 255, 0.15) 0%, rgba(112, 0, 255, 0.05) 50%, transparent 70%);
            filter: blur(80px);
            z-index: 0;
            pointer-events: none;
        }

        .noise-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            opacity: 0.04;
            pointer-events: none;
            z-index: 50;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3BaseFilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/feFilter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        .murph-float {
            animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            5
```