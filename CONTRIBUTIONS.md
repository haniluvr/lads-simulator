# Contributing to Love and Deepspace Wish Simulator

First off, thank you for considering contributing to the Love and Deepspace Wish Simulator! It's people like you that make this fan project such a wonderful resource for the community.

The following is a set of guidelines for contributing to this project. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## General Guidelines

- **Vanilla Web Technologies:** This project strictly uses vanilla HTML, CSS, and JavaScript. Please avoid introducing external dependencies, CSS frameworks (like Tailwind or Bootstrap), or UI libraries (like React or Vue) unless absolutely necessary and agreed upon.
- **Glassmorphism & Aesthetics:** Ensure that any new UI elements follow the existing space-themed glassmorphic design language. Use the CSS variables defined in the `style.css` files.
- **Performance & Caching:** We use image assets heavily. Be sure to optimize `.webp` or `.png` files before adding them to the repository. The project uses local caching mechanisms (e.g., `localStorage`) to save user states (pity, collection). When modifying states, ensure backward compatibility so users don't lose their data on refresh.
- **Responsive Design:** Ensure your changes look good on both desktop and mobile viewports.

## Adding Missing or New Memories (Cards)

If a new banner drops or a memory is missing from the collection, you can add it easily by following these steps:
1. **Prepare the Visual Asset:** 
   - Source the raw video or image file of the card.
   - Place the raw file in the corresponding character's directory within `assets/cards/` (e.g., `assets/cards/zayne/five-star/solar/`).
2. **Compress the Asset:** 
   - For performance, we use PowerShell scripts to compress and optimize these assets.
   - Open your terminal and navigate to the `scripts/` directory.
   - Run `.\compress_videos.ps1` for video files or `.\compress_images.ps1` for images. This will automatically convert them to highly compressed `.mp4` or `.webp` formats.
   - Alternatively, you can run `.\finalize_new_assets.ps1` to batch process everything automatically.
3. **Rebuild the Catalog:**
   - After the assets are compressed and placed in their final directories, you MUST update the `cards.js` database.
   - Instead of updating it manually, simply run `node scripts/build_catalog.js` from the project root.
   - This script will walk through the `assets/cards` folder, automatically read the new files, extract their metadata (rarity, character, solar/lunar), fetch their Chinese translations, and cleanly rebuild the `CARDS_DB` array in `cards.js`.
4. **Update Pity Pools (Optional):** 
   - If the new card belongs to the Standard banner, ensure it is correctly mapped into the respective Standard pool in `app.js` or `collection.js` so users can pull it in the gacha simulator.

## Adding Poses in Photobooth

To add new character poses to the Photobooth Studio:
1. **Prepare the Sprite:** 
   - Export the character pose with a transparent background.
   - Place the raw file in the character's sprite directory (e.g., `assets/valko/sprites/`).
2. **Compress the Asset:**
   - Go to the `scripts/` directory and run `.\compress_images.ps1`.
   - This script will automatically convert your raw image into a high-quality, lightweight `.webp` file, preserving transparency while significantly reducing file size.
3. **Update Data Objects:** 
   - Open `photobooth/booth.js` and locate the `CHARACTERS` object near the top of the file. 
   - Add your new pose to the `poses` array under the specific character.
   - Use the base name of your `.webp` file (without the extension) for the `id`.
   ```javascript
   { id: 'your_pose_filename_without_ext', label: 'Display Name for the UI' }
   ```
4. **Verify:** 
   - Start the local server, navigate to the Photobooth Studio, and ensure the pose renders correctly on the canvas and in the character accordion panel.

## Adding a New Language (Translation Guide)

We use a custom, lightweight i18n system powered by JSON files.
1. **Create the Locale File:** Create a new JSON file in the `locales/` directory (e.g., `es.json` for Spanish). You can duplicate `en.json` to use as a baseline.
2. **Translate:** Provide translations for all keys. Make sure to keep the keys exactly the same.
3. **Register the Language:** Open `i18n.js` (or the global settings script) and add the new language code to the available languages array.
4. **Update the UI:** If the new language requires specific fonts (e.g., CJK languages), update `photobooth/booth.js` and `booth.html` to load and apply those Google Fonts dynamically when the language changes.

## Adding New Features or Minigames

If you have a brilliant idea for a new feature or an Arcade minigame (like the Claw Machine!):
- **Let's Talk First:** Please open an Issue or reach out to me directly before starting major work. This ensures your efforts align with the project's direction and prevents overlapping work.
- Once agreed upon, you can create a new subdirectory for your minigame (similar to `arcade/`), link it to the hub, and follow the general aesthetic guidelines.

## Reporting Issues

If you find a bug, a missing translation, or a typo:
- Use the GitHub Issues tab to report it.
- Include clear steps to reproduce the issue.
- If it's a visual bug, please include screenshots and mention your browser/device!

## Pull Requests

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, ensure it doesn't break the existing summoning or collection logic.
3. Make sure your code lints and is formatted consistently with the rest of the project.
4. Issue a pull request!

Thank you again for your interest in improving the Love and Deepspace Wish Simulator!
