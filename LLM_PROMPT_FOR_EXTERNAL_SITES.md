# LLM Prompt: Add Backlink to lacymorrow.com
## For Use with AI Assistants (ChatGPT, Claude, etc.)

This prompt can be used when working on external sites to add backlinks to lacymorrow.com.

---

## 🤖 Copy-Paste Prompt for LLM Agents

```
I need to add SEO backlinks to https://lacymorrow.com from this website/repository.

CONTEXT:
- This website/project is created and maintained by Lacy Morrow
- Lacy's portfolio is at https://lacymorrow.com
- We need to add backlinks for SEO purposes
- The links should be visible but not intrusive

REQUIREMENTS:
1. Add a footer link saying "Created by Lacy Morrow" linking to https://lacymorrow.com
2. Add a mention in the About/README section linking to the portfolio
3. Use semantic HTML with rel="author" attribute where appropriate
4. Ensure links are crawlable (not behind JavaScript-only interactions)
5. Use descriptive anchor text (not just "click here")

SPECIFIC LOCATIONS TO UPDATE:
- Footer component/page
- About page/section
- README.md file (if applicable)
- package.json author field (if applicable)

CODE EXAMPLES:

For HTML/React footer:
```html
<footer>
  <p>Created by <a href="https://lacymorrow.com" rel="author">Lacy Morrow</a></p>
</footer>
```

For README.md:
```markdown
## Created by

This project is created and maintained by [Lacy Morrow](https://lacymorrow.com).

[View my portfolio →](https://lacymorrow.com) | [View my work →](https://lacymorrow.com/work) | [View my projects →](https://lacymorrow.com/play)
```

For package.json:
```json
{
  "author": {
    "name": "Lacy Morrow",
    "url": "https://lacymorrow.com"
  }
}
```

TASK:
1. First, analyze the current codebase structure
2. Identify where footer/about/README files are located
3. Add the appropriate backlinks following the examples above
4. Ensure the links are consistent with the site's design/style
5. Verify the implementation is correct

Please proceed with adding these backlinks to the codebase.
```

---

## 📋 Site-Specific Variations

### For Build And Serve (buildandserve.com)

```
I need to add SEO backlinks to https://lacymorrow.com from buildandserve.com.

CONTEXT:
- Build And Serve is a digital development agency run by Lacy Morrow
- Lacy's portfolio is at https://lacymorrow.com
- We need to add backlinks for SEO purposes

REQUIREMENTS:
1. Add footer link: "Built by [Lacy Morrow](https://lacymorrow.com)"
2. Add to About page: "Build And Serve is run by [Lacy Morrow](https://lacymorrow.com), a full-stack web developer..."
3. Add to Contact page if appropriate

[Rest of prompt...]
```

### For Shipkit (shipkit.io)

```
I need to add SEO backlinks to https://lacymorrow.com from shipkit.io.

CONTEXT:
- Shipkit is a Next.js boilerplate created by Lacy Morrow
- Lacy's portfolio is at https://lacymorrow.com
- We need to add backlinks for SEO purposes

REQUIREMENTS:
1. Add footer link: "Created by [Lacy Morrow](https://lacymorrow.com)"
2. Add to About/README: "Shipkit is created and maintained by [Lacy Morrow](https://lacymorrow.com)"
3. Add to documentation if there's a contributors/about section

[Rest of prompt...]
```

### For Uibrary (uibrary.com)

```
I need to add SEO backlinks to https://lacymorrow.com from uibrary.com.

CONTEXT:
- Uibrary is a collection of UI components created by Lacy Morrow
- Lacy's portfolio is at https://lacymorrow.com
- We need to add backlinks for SEO purposes

REQUIREMENTS:
1. Add footer link: "Created by [Lacy Morrow](https://lacymorrow.com)"
2. Add to About page: "Uibrary is a collection of UI components created by [Lacy Morrow](https://lacymorrow.com)"
3. Consider adding attribution to component pages

[Rest of prompt...]
```

### For GitHub Repositories

```
I need to add SEO backlinks to https://lacymorrow.com to this GitHub repository's README.md and package.json.

CONTEXT:
- This repository is created and maintained by Lacy Morrow
- Lacy's portfolio is at https://lacymorrow.com
- We need to add backlinks for SEO purposes

REQUIREMENTS:
1. Add to README.md near the top (after title/description):
   ```markdown
   ## Created by
   
   This project is created and maintained by [Lacy Morrow](https://lacymorrow.com).
   ```

2. Update package.json author field:
   ```json
   {
     "author": {
       "name": "Lacy Morrow",
       "url": "https://lacymorrow.com"
     }
   }
   ```

3. If there's a CONTRIBUTORS file, add Lacy's name with link

TASK:
1. Analyze the current README.md structure
2. Add the "Created by" section in an appropriate location
3. Update package.json with author information
4. Ensure formatting is consistent with existing README style

Please proceed with adding these backlinks.
```

---

## 🎯 Generic Prompt Template

```
I need to add SEO backlinks to https://lacymorrow.com from [WEBSITE_NAME].

CONTEXT:
- [WEBSITE_NAME] is [brief description] created by Lacy Morrow
- Lacy's portfolio is at https://lacymorrow.com
- We need to add backlinks for SEO purposes
- The links should be visible but not intrusive

REQUIREMENTS:
1. Add footer link: "Created by [Lacy Morrow](https://lacymorrow.com)"
2. Add to About page: "[WEBSITE_NAME] is created by [Lacy Morrow](https://lacymorrow.com)"
3. Use semantic HTML with rel="author" attribute where appropriate
4. Ensure links are crawlable (not behind JavaScript-only interactions)
5. Use descriptive anchor text (not just "click here")

SPECIFIC LOCATIONS TO UPDATE:
- Footer component/page
- About page/section
- README.md file (if applicable)
- package.json author field (if applicable)

CODE EXAMPLES:

For HTML/React footer:
```html
<footer>
  <p>Created by <a href="https://lacymorrow.com" rel="author">Lacy Morrow</a></p>
</footer>
```

For README.md:
```markdown
## Created by

This project is created and maintained by [Lacy Morrow](https://lacymorrow.com).

[View my portfolio →](https://lacymorrow.com) | [View my work →](https://lacymorrow.com/work) | [View my projects →](https://lacymorrow.com/play)
```

For package.json:
```json
{
  "author": {
    "name": "Lacy Morrow",
    "url": "https://lacymorrow.com"
  }
}
```

TASK:
1. First, analyze the current codebase structure
2. Identify where footer/about/README files are located
3. Add the appropriate backlinks following the examples above
4. Ensure the links are consistent with the site's design/style
5. Verify the implementation is correct

Please proceed with adding these backlinks to the codebase.
```

---

## 📝 Instructions for Use

### Step 1: Choose the Right Prompt
- Use the **generic template** for most websites
- Use **site-specific variations** for Build And Serve, Shipkit, or Uibrary
- Use **GitHub repository prompt** for GitHub repos

### Step 2: Customize
Replace `[WEBSITE_NAME]` and `[brief description]` with actual site information

### Step 3: Paste into LLM
- Copy the entire prompt
- Paste into ChatGPT, Claude, Cursor, or any LLM agent
- The agent will analyze the codebase and add the backlinks

### Step 4: Review
- Review the changes before committing
- Verify links work correctly
- Ensure formatting matches site style

---

## ✅ Verification Checklist

After the LLM completes the task:

- [ ] Footer link is visible and working
- [ ] About page has mention with link
- [ ] README.md updated (if applicable)
- [ ] package.json updated (if applicable)
- [ ] Links use descriptive anchor text
- [ ] Links have rel="author" attribute (HTML)
- [ ] Links are crawlable (not JS-only)
- [ ] Styling matches site design
- [ ] No broken links
- [ ] Changes are committed and pushed

---

## 🔄 Follow-up Prompt (If Needed)

If the LLM needs more guidance:

```
The backlinks need to be added in these specific locations:

1. [FILE_PATH]/footer.tsx - Add link in footer component
2. [FILE_PATH]/about.mdx - Add link in about section
3. [FILE_PATH]/README.md - Add "Created by" section

Please make the changes and show me the updated code.
```

---

## 📊 Expected Output

The LLM should:
1. ✅ Identify relevant files
2. ✅ Add footer link
3. ✅ Add about page link
4. ✅ Update README (if applicable)
5. ✅ Update package.json (if applicable)
6. ✅ Show code changes
7. ✅ Explain what was changed

---

## 🚀 Quick Start

1. **For a website**: Use the generic template, customize `[WEBSITE_NAME]`
2. **For GitHub repo**: Use the GitHub repository prompt
3. **For specific sites**: Use site-specific variations

Copy → Paste → Review → Deploy!

