<div align="center">
  <img src="assets/ui/favicon.webp" alt="Love and Deepspace" width="120" />
  <br><br>
  <a href="https://haniluvr.github.io/lads-simulator/index.html"><img src="https://img.shields.io/badge/Play%20Now!-28a745.svg?style=flat"></a>
  <a href="https://ko-fi.com/haniluvr"><img src="https://img.shields.io/badge/Ko--fi-F16061.svg?logo=ko-fi&logoColor=white"></a>
  <a href="https://x.com/hvnibun"><img src="https://img.shields.io/badge/X-black.svg?logo=X&logoColor=white"></a>
  <a href="https://discordapp.com/users/914445892180906005"><img src="https://img.shields.io/badge/Discord-%237289DA.svg?logo=discord&logoColor=white"></a>
  <a href="https://instagram.com/hvniluvr"><img src="https://img.shields.io/badge/Instagram-%23E4405F.svg?logo=Instagram&logoColor=white"></a>
</div>

# Love and Deepspace Wish Simulator

A fan-made, beautifully crafted wish (gacha) simulator for the game **Love and Deepspace**. Test your luck without spending real money! 

This project aims to recreate the authentic summoning experience from the game, featuring dynamic animations, a pity system, character collections, and a gorgeous, responsive UI built entirely with vanilla web technologies.

## ✨ Features

- **Authentic Wish System:** Pull on both Standard and Limited banners with realistic gacha rates.
- **Pity Mechanics:** Features a soft pity system starting at 60 pulls and a hard guarantee at 70 pulls, accurate to the game.
- **Dynamic Animations:** Enjoy immersive 5-star character reveal videos for Xavier, Zayne, Rafayel, Sylus, Caleb, and Valko followed by seamless CSS-based card reveal animations.
- **Collection & Memories:** View all the cards you've collected in the "Memories" modal. Track duplicates through a visual Rank-Up cube system with real-time red badge notifications.
- **`[NEW]` Photobooth Studio:** Take custom photos with your favorite memories! Decorate your photostrips with stickers, drag to swap frames, and export your creations.
- **`[NEW]` Arcade Hub:** Access interactive minigames designed to test your luck and skills.
    - **Kitty Cards:** A card game where you play against your favorite companions (both normal and advanced).
    - **Claw Paradise:** A claw machine game where you can win plushies with various designs to complete your collection.
    - **Wishfall Frenzy:** A fast-paced rhythm game where you must collect falling wishes while avoiding bombs. The more you collect, the more wishes you get for your pulls!
    - **FLAMES Calculator:** A nostalgic game used to playfully predict relationship compatibility between you and your bias based on your names.
    - **M.A.S.H. Future Predictor:** A classic fortune-telling game to predict your future with your favorite characters.
- **`[NEW]` Multi-language Support:** Added full support for Simplified Chinese UI translation, dynamically loading languages and region-specific web fonts.
- **Persistent Data:** Your pity count, collection, and settings are saved locally in your browser so you don't lose progress when you refresh or close the tab.
- **Global Audio & Settings:** A unified Settings and FAQ system across all pages to toggle background music, sound effects, and custom character-themed mouse cursors.
- **Responsive UI:** A premium, space-themed user interface heavily utilizing glassmorphism, CSS grid/flexbox, and micro-animations.

## 🚀 Tech Stack

- **HTML5:** Semantic, accessible structure, including Canvas API for image rendering and interactions.
- **CSS3:** Advanced styling using CSS Variables, Flexbox, Grid, keyframe animations, and backdrop filters for glassmorphism. (No external CSS frameworks!)
- **JavaScript (Vanilla):** DOM manipulation, state management (via `localStorage`), Canvas drawing/drag-and-drop, and core game logic.

## 🎮 How to Play

### Wish Simulator
1. **Choose your banner:** Click on the "Standard" or "Limited" banner cards on the home screen.
2. **Wish!** Click the "1 Wish" or "10 Wishes" button to try your luck.
3. **Skip or Watch:** Watch the authentic 5-star animations play out, or click the skip button in the top right corner.
4. **Check your Collection:** Go back to the home screen and click the "Memories" button to view your pulled cards and their rank status.

### Arcade Minigames
1. **Enter Arcade:** Click the "Arcade" button on the home screen to access the arcade selection.
2. **Claw Paradise:** A claw machine game where you can win plushies with various designs to complete your collection.
3. **Wishfall Frenzy:** A rhythm-based catching game where you must collect falling wishes while avoiding bombs.
4. **M.A.S.H. Future Predictor:** A nostalgic fortune-telling game to predict your future with your favorite characters.
5. **FLAMES Calculator:** Discover your relationship compatibility through this classic name-matching game.

### Photobooth
1. **Enter Photobooth:** Click the "Photobooth" image button on the home screen.
2. **Select Template & Photos:** Choose a photostrip template and select up to 4 photos from your collection.
3. **Customize:** Add stickers, drag to swap photo frames, and personalize your photostrip!
4. **Print:** Save or print your photostrip and turn it into a bookmark as your very own memento!

## 🛠️ Installation & Local Setup

Since this application uses modules and assets, a local server is required to avoid CORS policy errors.

1. Clone the repository:
   ```bash
   git clone https://github.com/haniluvr/pseudo-gacha.git
   ```
2. Navigate to the directory:
   ```bash
   cd lads-simulator
   ```
3. Start a local server:
   ```bash
   python -m http.server 8080
   ```
4. Open your browser and navigate to `http://localhost:8080`.

## ⚠️ Disclaimer

This is an **unofficial, fan-made web application** and is not affiliated with, endorsed, sponsored, or approved by Papergames or Infold Games. Love and Deepspace, its characters, artwork, audio, and all associated intellectual property are the exclusive property of their respective copyright holders. 

This project is created strictly for entertainment and fan purposes, with absolutely no commercial intent. No copyright infringement is intended.

## 👨‍💻 Credits

- Code and Design © 2026 haniluvr
- All game assets (images, videos, audio) belong to **Infold Games / Papergames**.

### Acknowledgement
- Thank you to [Chey](https://x.com/SkylusRose), [Tasha](https://x.com/Tashter), and [Yuhina](https://x.com/YuhinaSan) for helping me gather the missing memories in my collection.

### Fanart Artists
- **Kitty Cards Template:** [8eter8](https://www.reddit.com/r/LoveAndDeepspace/comments/1jrvri4/kitty_cards_fanmade_template/)
- **Cards:** [Cee](https://x.com/celh0_0), [Mephisto](https://x.com/Harlock_Mephistokitten), [KC_7385](https://x.com/KC_7385), [uulyaax](https://x.com/uulyaax), [SpiritFucker93](https://x.com/SpiritFucker93), [salad](https://x.com/SALADYUMI), [jin](https://x.com/starsxav), [b](https://x.com/beejawing), [Meimei](https://x.com/okojyomeimei), [Kihaiu](https://x.com/Thekawacookiie), [Aagknorr](https://x.com/Aagknorr), [Syer](https://x.com/imuyumiii), [Nika](https://x.com/WanderingNika), [ASH](https://x.com/OrangeTart_), [godzileen](https://x.com/godzileen), [Cereza_cristal](https://x.com/Cereza_cristal), [raonnni](https://x.com/raonnni), [zeitvon](https://x.com/zeitvon), [Lottie](https://x.com/Starry_Lottie), [very_octoink](https://x.com/very_octoink), [n0niiiiii](https://x.com/n0niiiiii), [Acolyptic](https://x.com/acolyptic), [Chel](https://x.com/PencintaApelll), [c0axyz](https://x.com/c0axyz), [solisweirdddd](https://x.com/solisweirdddd), [pinkieplum](https://instagram.com/pinkieplum), [Yuhina.san](https://x.com/YuhinaSan), [Auniméa](https://x.com/Aunimea), [CELYNSICAL](https://x.com/CELYNSICAL), [bones](https://x.com/bonesandchocos), [Morgenty](https://x.com/fine_fiction), [Ayu](https://x.com/ayushnz_/), [NheaLonn](https://x.com/NheaLonn), [KonekoHoshi](https://x.com/koneko_hoshi), [BellaVictoria](https://bsky.app/profile/bellavictoria.bsky.social)
- **Stickers:** [_Valko_](https://xhslink.cn/m/8NTZMgjK6NN), [Rei](https://x.com/Astareion), [Bento](https://x.com/smallbento), [Ellie](https://x.com/fantasyartist26)
