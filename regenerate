/**
 * regenerate-rss.js
 *
 * Standalone script that ONLY regenerates rss.xml from generated-posts.json.
 * Does NOT call the AI. Does NOT create a new blog post. Does NOT cost anything.
 *
 * Use this when:
 *  - You need to fix a bug in rss.xml without generating a new blog
 *  - You manually deleted/edited a blog post in generated-posts.json
 *  - rss.xml got out of sync with your actual posts
 *
 * How to run:
 *  - Via GitHub Actions: trigger the "Regenerate RSS Feed" workflow manually
 *  - Locally: node regenerate-rss.js
 */

const fs = require('fs');

function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function absoluteImageUrl(img) {
  if (!img) return 'https://savingsclub.com/img/savings-jar.jpg';
  if (img.indexOf('http://') === 0 || img.indexOf('https://') === 0) return img;
  if (img.indexOf('/') === 0) return 'https://savingsclub.com' + img;
  return 'https://savingsclub.com/' + img;
}

function toRFC822(post) {
  try {
    if (post.pubDate) return post.pubDate;
    if (post.isoDate) {
      const d = new Date(post.isoDate);
      if (!isNaN(d.getTime())) return d.toUTCString();
    }
    if (post.date) {
      const d = new Date(post.date);
      if (!isNaN(d.getTime())) return d.toUTCString();
    }
  } catch (e) {}
  return new Date().toUTCString();
}

function generateRSS() {
  let posts = [];
  try {
    posts = JSON.parse(fs.readFileSync('generated-posts.json', 'utf8'));
  } catch (e) {
    console.error('ERROR: Could not read generated-posts.json: ' + e.message);
    process.exit(1);
  }

  const recentPosts = posts.slice(0, 50);

  const items = recentPosts.map(p => {
    const url = 'https://savingsclub.com/blog/' + p.slug + '/';
    const escapedUrl = escapeXml(url);
    const pubDate = toRFC822(p);
    const imgUrl = absoluteImageUrl(p.image);
    const escapedImgUrl = escapeXml(imgUrl);
    const title = escapeXml(p.title);
    const category = escapeXml(p.category || 'Money Tips');

    return '  <item>\n' +
      '    <title>' + title + '</title>\n' +
      '    <link>' + escapedUrl + '</link>\n' +
      '    <guid isPermaLink="true">' + escapedUrl + '</guid>\n' +
      '    <pubDate>' + pubDate + '</pubDate>\n' +
      '    <category>' + category + '</category>\n' +
      '    <description><![CDATA[' + (p.excerpt || p.title) + ']]></description>\n' +
      '    <enclosure url="' + escapedImgUrl + '" type="image/jpeg" />\n' +
      '    <media:content url="' + escapedImgUrl + '" medium="image" />\n' +
      '  </item>';
  }).join('\n');

  const now = new Date().toUTCString();
  const rss = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom">\n' +
    '<channel>\n' +
    '<title>SavingsClub Blog</title>\n' +
    '<link>https://savingsclub.com/blog/</link>\n' +
    '<atom:link href="https://savingsclub.com/rss.xml" rel="self" type="application/rss+xml" />\n' +
    '<description>Free personal finance education, calculators, and money guides for Americans in every state.</description>\n' +
    '<language>en-us</language>\n' +
    '<lastBuildDate>' + now + '</lastBuildDate>\n' +
    '<image>\n' +
    '<url>https://savingsclub.com/img/sc-logo-full.png</url>\n' +
    '<title>SavingsClub Blog</title>\n' +
    '<link>https://savingsclub.com/blog/</link>\n' +
    '</image>\n' +
    items + '\n' +
    '</channel>\n' +
    '</rss>\n';

  fs.writeFileSync('rss.xml', rss);
  console.log('✓ rss.xml regenerated with ' + recentPosts.length + ' items');
  console.log('✓ No new blog post generated');
  console.log('✓ No AI tokens used');
}

generateRSS();
