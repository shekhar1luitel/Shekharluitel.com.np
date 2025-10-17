const { DateTime } = require("luxon");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginSitemap = require("@11ty/eleventy-plugin-sitemap");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight, {
    templateFormats: ["njk", "md"],
    init: ({ hljs }) => {
      hljs.configure({
        ignoreUnescapedHTML: true,
      });
    },
  });
  eleventyConfig.addPlugin(pluginSitemap, {
    sitemap: {
      hostname: "https://shekharluitel.com.np",
    },
  });

  eleventyConfig.addPassthroughCopy({ "assets/img": "img" });
  eleventyConfig.addPassthroughCopy({ "assets/js": "js" });
  eleventyConfig.addPassthroughCopy({ "assets/css": "css" });
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addWatchTarget("assets/css/");
  eleventyConfig.addWatchTarget("assets/js/");

  eleventyConfig.addFilter("capitalize", (value = "") => value.charAt(0).toUpperCase() + value.slice(1));

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toLocaleString(DateTime.DATE_FULL);
  });


  eleventyConfig.addFilter("formatTag", (value = "") => value.split("-").map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(" "));

  eleventyConfig.addFilter("uniqueTags", (items = []) => {
    const tags = new Set();
    for (const item of items) {
      const list = Array.isArray(item.data?.tags) ? item.data.tags : [];
      for (const tag of list) {
        if (typeof tag === "string" && !tag.startsWith("_")) {
          tags.add(tag);
        }
      }
    }
    return Array.from(tags).sort((a, b) => a.localeCompare(b));
  });

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  eleventyConfig.addCollection("notes", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("./content/notes/*.md")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("recentNotes", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("./content/notes/*.md")
      .sort((a, b) => b.date - a.date)
      .slice(0, 3);
  });

  eleventyConfig.addCollection("projects", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("./content/pages/work/*.md")
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0));
  });

  eleventyConfig.addCollection("featuredProjects", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("./content/pages/work/*.md")
      .filter((item) => item.data.featured)
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0));
  });

  return {
    dir: {
      input: ".",
      includes: "includes",
      data: "data",
      layouts: "layouts",
      output: "dist",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    templateFormats: ["md", "njk", "11ty.js"],
    passthroughFileCopy: true,
  };
};
