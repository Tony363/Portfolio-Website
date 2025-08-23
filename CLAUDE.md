# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a portfolio website for Tony Siu, built as a static site using HTML5, CSS3, JavaScript, and jQuery. The site showcases professional experience, projects, and skills for an AI Engineer/Researcher specializing in Generative AI and Data Engineering.

## Architecture and Structure

### Data-Driven Content System
The website uses a JSON-based content management approach where dynamic content is stored in JSON files and loaded via JavaScript:

- **experience.json** - Timeline data for work experience (company, title, period, icon)
- **projects.json** - Project showcase data (name, description, category, links, image)
- **skills.json** - Technical skills listing with icon references

### Page Structure
- **Main Page** (`index.html`) - Hero section with particles.js animation, about section, skills grid, education timeline, experience timeline, and contact section
- **Projects Page** (`projects/index.html`) - Filterable project gallery with categories
- **Experience Page** (`experience/index.html`) - Detailed work experience timeline
- **404 Page** - Custom error page with animated graphics

### Component System
- **Partials** (`partials/`) - Reusable header and footer components loaded dynamically via fetch
- **Dynamic Loading** - Content is injected into placeholder divs using JavaScript fetch API

## Commands

### Local Development
```bash
# Start a local server (Python 3)
python3 -m http.server 8000

# Or using Node.js http-server
npx http-server

# Or using VS Code Live Server extension
# Right-click on index.html and select "Open with Live Server"
```

### Deployment
The site is currently deployed on Netlify. Any changes pushed to the main branch will trigger automatic deployment.

## Key Technical Details

### JavaScript Libraries Used
- **jQuery** - DOM manipulation and event handling
- **Particles.js** - Animated particle background on hero section
- **Typed.js** - Typing animation for dynamic text
- **VanillaTilt.js** - 3D tilt effect on project cards
- **ScrollReveal** - Scroll-triggered animations
- **Tawk.to** - Live chat integration
- **Isotope** - Project filtering and layout

### Dynamic Content Loading Pattern
All dynamic content follows this pattern:
1. Fetch JSON data from `/assets/data/` or relative paths
2. Parse JSON response
3. Generate HTML using template literals
4. Insert into DOM via innerHTML or jQuery methods

### Project Filtering System
Projects page uses Isotope.js with categories defined in projects.json:
- Categories: `cv` (Computer Vision), `mult` (Multimodal), `mern`, `android`, `lamp`, `basicweb`
- Filter buttons trigger Isotope's filter method

### Responsive Design Breakpoints
- Mobile: < 450px
- Tablet: 450px - 768px  
- Desktop: > 768px

## Important Files to Modify

### Content Updates
- `/assets/data/experience.json` - Add/edit work experience
- `/projects/projects.json` - Add/edit projects
- `/skills.json` - Update technical skills
- `/index.html` - Modify static content like hero text, about section
- `/assets/images/` - Add project screenshots and company logos

### Styling
- `/assets/css/style.css` - Main stylesheet with all custom styles
- `/projects/style.css` - Project page specific styles
- `/experience/style.css` - Experience page specific styles

### Functionality
- `/assets/js/script.js` - Main JavaScript file with core functionality
- `/projects/script.js` - Project page interactions and filtering
- `/experience/script.js` - Experience page specific scripts

## Adding New Content

### Adding a Project
1. Add project image to `/assets/images/projects/`
2. Update `/projects/projects.json` with project details
3. Ensure category matches existing filter buttons or add new category

### Adding Work Experience  
1. Add company logo to `/assets/images/companies/`
2. Update `/assets/data/experience.json` with new entry
3. Specify `side: "left"` or `side: "right"` for timeline position

### Adding Skills
1. Update `/skills.json` with skill name and icon URL
2. Icons use external URLs (icons8.com, etc.) - consider hosting locally for reliability

## Notes

- The site disables right-click context menu and developer tools (F12) for basic protection
- Tawk.to chat widget is embedded - update or remove the chat ID in script files if needed
- All external font icons use Font Awesome 5.15.3 via CDN
- The site uses absolute paths starting with `/` - ensure proper server configuration for deployment