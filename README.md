# Text Search & Highlight App

A lightweight React application that allows users to:

✅ Search through a list of articles  
✅ Highlight matching text in real-time  
✅ Star / favorite articles  
✅ Always show starred articles at the top  
✅ Filter to view only starred articles  
✅ Expand / collapse full article content

No backend — data is stored locally & favorites persist with `localStorage`.

---

## 🚀 Tech Stack

- **React** (Vite)
- **Tailwind CSS**
- Local state + `useMemo` for efficient filtering / highlighting
- Browser `localStorage` for favorite persistence

---

## 🖼️ Features

| Feature            | Description                                 |
| ------------------ | ------------------------------------------- |
| 🔍 Live Search     | Enter keywords to instantly filter articles |
| ✨ Highlighting    | All matching text is highlighted            |
| ⭐ Favorite System | Click star to save favorites                |
| ⬆️ Star Priority   | Starred items always move to the top        |
| 🎚️ Star Filter     | Toggle to show only favorites               |
| 📂 Expand Articles | Click to view full content                  |
| 💾 Persistent      | Favorites saved via localStorage            |

---

## 🛠️ Installation & Setup

### 1. Clone the repo

```bash
git clone https://github.com/RawadKadi/text-search.git
cd text-search
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the app

```bash
npm run dev
```

### Optional: Build for production

```bash
npm run build
```

---

## 📁 Project Structure

```
src/
 ├─ components/
 │   └─ ...
 ├─ data/
 │   └─ ...
 ├─ App.jsx
 ├─ main.jsx
 └─ index.css
```

---

## 💡 How It Works

### Searching

- User input builds a case-insensitive regex
- Articles filtered with `.filter()` + `.test()`

### Highlighting

- Text split by regex → wrap matches in `<mark>`

### Favorites

- Stored in a Set
- Synced to `localStorage`
- UI updates instantly

---

## 🎨 UI Notes

- Clean minimalist UI
- Clear highlight styling
- Icon colors readable in light mode
- Blue states for active filters

---

## 📌 Future Enhancements (nice to have)

- Category filters
- Multi-highlight color themes
- API Fetch mode & offline mode
- Dark mode toggle
- Animations

---

## 👨‍💻 Author

**Rawad Kadi**  
Front-End Developer

---

## 📄 License

This project is open for educational/demo use. Feel free to fork & build on it 🤝
