# SEO Improvement Analysis
## Backlinking & Crosslinking Opportunities

### Summary
This analysis identifies opportunities to improve SEO through strategic backlinking and crosslinking between lacymorrow.com and related sites/projects.

---

## 🔗 Cross-Site Linking Opportunities

### Sites to Link TO from Portfolio Site

#### 1. **Build And Serve** (buildandserve.com)
- **Current**: Linked in `currently_working.tsx`, mentioned in README
- **Opportunities**:
  - Add link in About page: "I run [Build And Serve](https://buildandserve.com), a digital development agency."
  - Add to footer links
  - Link from work section if Build And Serve clients are featured

#### 2. **Uibrary** (uibrary.com)
- **Current**: Linked in `past_projects.tsx` and `brick-marquee.tsx`, mentioned in README
- **Opportunities**:
  - Add link in About page: "I run [uibrary](https://uibrary.com), a collection of UI components."
  - Link from play section if any components are showcased

#### 3. **Shipkit** (shipkit.io)
- **Current**: Linked in `past_projects.tsx` and `brick-marquee.tsx`, mentioned in README and theme banner
- **Opportunities**:
  - Add link in About page: "I run [shipkit](https://shipkit.io), the best starter kit for building MVPs."
  - Already in banner, but could add to About section

#### 4. **Hitchhiker's Galaxy.guide** (hitchhikersgalaxy.guide)
- **Current**: Linked in `past_projects.tsx` and `brick-marquee.tsx`, mentioned in README
- **Opportunities**:
  - Add link in About page: "I made the _real_ Hitchhiker's Guide at [hitchhikersgalaxy.guide](https://hitchhikersgalaxy.guide)."
  - Create dedicated play page for this project

#### 5. **Juno** (junebug.ai)
- **Current**: Linked in `currently_working.tsx` and `brick-marquee.tsx`
- **Opportunities**:
  - Add description in About page
  - Link from work section if appropriate

#### 6. **Vibe Rehab** (vibe.rehab)
- **Current**: Linked in `currently_working.tsx`
- **Opportunities**:
  - Add description in About page
  - Link from work section if appropriate

#### 7. **Cloud0** (cloud0.dev)
- **Current**: Linked in `past_projects.tsx` and `brick-marquee.tsx`
- **Opportunities**:
  - Add description in About page
  - Create dedicated play page

#### 8. **Fly5** (fly5.live)
- **Current**: Linked in nav, `_meta.json`, and mentioned in drone work pages
- **Opportunities**:
  - Add link in About page: "I started a company focused on aerial cinematography, [Fly5](https://fly5.live)."
  - Link from drone work pages more prominently
  - Add to footer links

#### 9. **Casper WordPress Theme** (casper.lacymorrow.com)
- **Current**: Linked in `play/casper.mdx`
- **Opportunities**:
  - Add link in About page: "I created [Casper](https://casper.lacymorrow.com), a WordPress theme."
  - Link from past projects section

#### 10. **Hackpack** (hackpack.cc)
- **Current**: Linked in `work/companies/twilio.mdx` and mentioned in README
- **Opportunities**:
  - Add link in About page: "I helped create hardware devices such as the [hackpack](https://hackpack.cc/)."
  - Link from work section more prominently

#### 11. **Additional Sites** (in brick-marquee but not explained)
- **bones.sh** - Needs explanation and link
- **thneed.ai** - Needs explanation and link
- **lacy.sh** - Needs explanation and link
- **lacy.is** - Needs explanation and link

---

## 🔄 Internal Linking Opportunities

### 1. **Cross-Reference Work & Play Sections**
- Link from work pages to related play projects (e.g., Twilio → XSPF Jukebox if relevant)
- Link from play pages to work experience (e.g., React projects → company work)

### 2. **Project Pages → Portfolio**
- Add "View more projects" links on individual project pages
- Link from project pages to About page
- Link from project pages to Work section

### 3. **About Page Improvements**
- Link to specific work pages when mentioning companies
- Link to play pages when mentioning projects
- Add "Learn more" sections with links to work/play sections

### 4. **Home Page Enhancements**
- Add "View all work" link from Currently Working section
- Add "View all projects" link from Past Projects section
- Link project cards to detailed pages when they exist

### 5. **Play Section Cross-Linking**
- Link related projects (e.g., XSPF projects link to each other)
- Link from Flash section to React section if using react-ruffle
- Link from JavaScript projects to React projects

### 6. **Work Section Cross-Linking**
- Link from company pages to client work
- Link from client pages to related companies
- Link from drone pages to Fly5

---

## 📝 Content-Based Linking Opportunities

### 1. **README.md** (GitHub Profile)
- **Current**: Lists projects but doesn't link to portfolio
- **Opportunities**:
  - Add link: "View my [portfolio](https://lacymorrow.com) for more details."
  - Link each project to its portfolio page instead of just GitHub
  - Add "More projects at [lacymorrow.com](https://lacymorrow.com/play)"

### 2. **GitHub Repository READMEs**
- Add "Created by [Lacy Morrow](https://lacymorrow.com)" to major repos
- Link to portfolio page for each project

### 3. **About Page Enhancements**
- Add "Projects" section linking to play section
- Add "Work" section linking to work section
- Link companies mentioned to their work pages

### 4. **Contact Page**
- Add link to work section: "See my [work](/work)"
- Add link to projects: "Check out my [projects](/play)"

---

## 🎯 Specific File Improvements Needed

### High Priority

1. **`src/pages/about/index.mdx`**
   - Add links to Build And Serve, Uibrary, Shipkit
   - Add link to Fly5
   - Add link to Hackpack
   - Add "Projects" section with links to play section
   - Add "Work" section with links to work section

2. **`src/components/pages/home/past_projects.tsx`**
   - Fix crossover link (currently placeholder: `/crossover/` should be `/play/crossover`)
   - Fix xspf jukebox link (currently placeholder: `/xspf/` should be `/play/flash/xspf`)
   - Add more descriptive text linking to project pages

3. **`src/components/pages/home/currently_working.tsx`**
   - Add more context/linking to About page
   - Consider adding links to work section if these are client projects

4. **`src/components/layout/footer.tsx`**
   - Add links to Build And Serve, Uibrary, Shipkit
   - Add link to Fly5

5. **`README.md`**
   - Add portfolio link
   - Link projects to portfolio pages

### Medium Priority

6. **`src/pages/work/companies/twilio.mdx`**
   - Add link to Fly5 if relevant
   - Add link to Hackpack page if exists

7. **`src/pages/work/drones/*.mdx`**
   - Add prominent link to Fly5
   - Link between drone pages

8. **`src/pages/play/crossover.mdx`**
   - Add link back to portfolio home
   - Add "More projects" section

9. **`src/pages/play/casper.mdx`**
   - Add link back to portfolio home
   - Add "More projects" section

10. **`src/pages/play/flash/xspf.mdx`**
    - Add link to related XSPF projects
    - Add link back to portfolio

### Low Priority

11. **All play pages**
    - Add consistent footer with "View more projects" link
    - Add link to About page

12. **All work pages**
    - Add consistent footer with "View more work" link
    - Add link to About page

---

## 🔍 Missing Internal Links

### Projects Mentioned But Not Linked
- Many GitHub repos mentioned but no link to portfolio page
- Projects in README not linked to portfolio pages
- Projects in brick-marquee not explained or linked properly

### Opportunities to Create Pages
- bones.sh - needs explanation page
- thneed.ai - needs explanation page
- lacy.sh - needs explanation page
- lacy.is - needs explanation page (might be redirect/alias?)
- Hitchhiker's Galaxy - create dedicated play page

---

## 📊 SEO Meta Improvements

### 1. **Structured Data**
- Add Person schema to About page
- Add Project schema to play pages
- Add Organization schema for companies

### 2. **Alt Text & Descriptions**
- Ensure all images have descriptive alt text
- Add meta descriptions to all pages

### 3. **Internal Anchor Text**
- Use descriptive anchor text instead of "here", "this", etc.
- Use keywords in anchor text (e.g., "View my React projects" instead of "here")

---

## 🚀 Implementation Priority

### Phase 1: Quick Wins (Do First)
1. Fix placeholder links in past_projects.tsx
2. Add links to About page for Build And Serve, Uibrary, Shipkit
3. Add portfolio link to README.md
4. Add footer links to main sites

### Phase 2: Content Enhancement (Do Next)
1. Enhance About page with project/work sections
2. Add cross-linking between work and play sections
3. Add "More projects" sections to play pages
4. Add "More work" sections to work pages

### Phase 3: Advanced (Do Later)
1. Create pages for missing sites (bones.sh, thneed.ai, etc.)
2. Add structured data
3. Enhance GitHub repo READMEs
4. Create comprehensive cross-linking strategy

---

## 📋 Checklist

- [ ] Fix placeholder links in past_projects.tsx
- [ ] Add Build And Serve link to About page
- [ ] Add Uibrary link to About page
- [ ] Add Shipkit link to About page
- [ ] Add Fly5 link to About page
- [ ] Add Hackpack link to About page
- [ ] Add portfolio link to README.md
- [ ] Add footer links to main sites
- [ ] Add cross-linking between work and play sections
- [ ] Add "More projects" to play pages
- [ ] Add "More work" to work pages
- [ ] Create pages for missing sites
- [ ] Add structured data
- [ ] Enhance GitHub repo READMEs

