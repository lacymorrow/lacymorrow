# README Template for External Repos
## Add This to Your GitHub Repository READMEs

Add this section near the top of your README files (after the title and description):

```markdown
## Created by

This project is created and maintained by [Lacy Morrow](https://lacymorrow.com).

[View my portfolio →](https://lacymorrow.com) | [View my work →](https://lacymorrow.com/work) | [View my projects →](https://lacymorrow.com/play)
```

---

## Alternative Shorter Version

```markdown
Created by [Lacy Morrow](https://lacymorrow.com)
```

---

## For Package.json Files

Add this to your `package.json`:

```json
{
  "author": {
    "name": "Lacy Morrow",
    "url": "https://lacymorrow.com"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/lacymorrow/[repo-name]"
  }
}
```

---

## For Footer Links (HTML)

```html
<footer>
  <p>Created by <a href="https://lacymorrow.com" rel="author">Lacy Morrow</a></p>
</footer>
```

---

## For React/Next.js Components

```tsx
<footer>
  <p>
    Created by{' '}
    <a href="https://lacymorrow.com" rel="author">
      Lacy Morrow
    </a>
  </p>
</footer>
```

---

## Key Repositories That Need Updates

1. **lacymorrow/crossover** - Add README link
2. **lacymorrow/casper** - Add README link
3. **lacymorrow/album-art** - Add README link
4. **lacymorrow/movie-art** - Add README link
5. **lacymorrow/movie-trailer** - Add README link
6. **lacymorrow/react-github-readme-md** - Add README link
7. **lacymorrow/react-ruffle** - Add README link
8. **lacymorrow/xspf-jukebox** - Add README link
9. **lacymorrow/xspf-playlist** - Add README link
10. **shipkit-io/bones** - Add README link

---

## Usage Tips

- **Placement**: Put attribution near the top (after title) or in footer
- **Visibility**: Make it easy to find but not intrusive
- **Consistency**: Use the same format across all repos
- **Rel Attribute**: Use `rel="author"` for semantic HTML

