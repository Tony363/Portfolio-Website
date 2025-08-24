#!/usr/bin/env node

/**
 * Script to download skill icons from external URLs and save them locally
 * This eliminates dependency on external services and improves loading performance
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Read the skills.json file
const skillsData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'skills.json'), 'utf8'));

// Create skills directory if it doesn't exist
const skillsDir = path.join(__dirname, '..', 'assets', 'images', 'skills');
if (!fs.existsSync(skillsDir)) {
    fs.mkdirSync(skillsDir, { recursive: true });
}

// Function to sanitize filename
function sanitizeFilename(name) {
    return name.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/--+/g, '-')
        .replace(/^-|-$/g, '');
}

// Function to get file extension from URL or default to .png
function getExtension(url) {
    const urlPath = new URL(url).pathname;
    const ext = path.extname(urlPath);
    if (ext && ['.png', '.jpg', '.jpeg', '.svg', '.webp'].includes(ext.toLowerCase())) {
        return ext;
    }
    return '.png'; // default to png
}

// Function to download image
function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        
        const file = fs.createWriteStream(filepath);
        
        protocol.get(url, (response) => {
            // Handle redirects
            if (response.statusCode === 301 || response.statusCode === 302) {
                file.close();
                fs.unlinkSync(filepath);
                return downloadImage(response.headers.location, filepath)
                    .then(resolve)
                    .catch(reject);
            }
            
            if (response.statusCode !== 200) {
                file.close();
                fs.unlinkSync(filepath);
                reject(new Error(`Failed to download: ${response.statusCode}`));
                return;
            }
            
            response.pipe(file);
            
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlinkSync(filepath);
            reject(err);
        });
    });
}

// Process all skills
async function downloadAllIcons() {
    console.log('Starting download of skill icons...\n');
    
    const results = {
        success: [],
        failed: [],
        skipped: []
    };
    
    for (const skill of skillsData) {
        const filename = sanitizeFilename(skill.name) + getExtension(skill.icon);
        const filepath = path.join(skillsDir, filename);
        
        // Skip if file already exists
        if (fs.existsSync(filepath)) {
            console.log(`✓ Skipped ${skill.name} - already exists`);
            results.skipped.push({ name: skill.name, filename });
            continue;
        }
        
        try {
            console.log(`⬇ Downloading ${skill.name}...`);
            await downloadImage(skill.icon, filepath);
            console.log(`✓ Downloaded ${skill.name} as ${filename}`);
            results.success.push({ 
                name: skill.name, 
                filename,
                originalUrl: skill.icon 
            });
        } catch (error) {
            console.error(`✗ Failed to download ${skill.name}: ${error.message}`);
            results.failed.push({ 
                name: skill.name, 
                error: error.message,
                originalUrl: skill.icon 
            });
        }
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Generate updated skills.json with local paths
    const updatedSkills = skillsData.map(skill => {
        const filename = sanitizeFilename(skill.name) + getExtension(skill.icon);
        const filepath = path.join(skillsDir, filename);
        
        if (fs.existsSync(filepath)) {
            return {
                name: skill.name,
                icon: `/assets/images/skills/${filename}`,
                originalUrl: skill.icon // Keep original URL as backup
            };
        }
        return skill; // Keep original if download failed
    });
    
    // Save updated skills data
    fs.writeFileSync(
        path.join(__dirname, '..', 'skills-local.json'),
        JSON.stringify(updatedSkills, null, 2)
    );
    
    // Print summary
    console.log('\n========= Summary =========');
    console.log(`✓ Successfully downloaded: ${results.success.length}`);
    console.log(`⊘ Skipped (already exist): ${results.skipped.length}`);
    console.log(`✗ Failed: ${results.failed.length}`);
    
    if (results.failed.length > 0) {
        console.log('\nFailed downloads:');
        results.failed.forEach(item => {
            console.log(`  - ${item.name}: ${item.error}`);
            console.log(`    URL: ${item.originalUrl}`);
        });
    }
    
    console.log('\n✓ Created skills-local.json with updated paths');
    console.log('  Review and rename to skills.json when ready');
}

// Run the download
downloadAllIcons().catch(console.error);