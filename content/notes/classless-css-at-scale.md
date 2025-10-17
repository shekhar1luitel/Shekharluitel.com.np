---
layout: note.njk
title: Classless CSS at scale
date: 2024-11-12
tags:
  - css
  - design-systems
  - accessibility
description: Notes on designing a tag-first styling system inspired by Adam Stoddard, tuned for performance and accessibility.
excerpt: Notes on designing a tag-first styling system inspired by Adam Stoddard, tuned for performance and accessibility.
---
<p>Rebuilding this site without a utility framework forced me to study how browsers style semantic tags by default. Instead of overriding everything, I treated HTML elements as dependable components.</p>
<h2>Start with the language</h2>
<p>Each tag carries meaning. By leaning on <code>&lt;section&gt;</code>, <code>&lt;article&gt;</code>, and custom elements such as <code>&lt;project-card&gt;</code>, the cascade becomes intentional.</p>
<ul>
  <li>Use <code>:where()</code> to soften specificity.</li>
  <li>Rely on logical properties so vertical rhythm adapts to writing modes.</li>
  <li>Reserve attributes like <code>[tone="muted"]</code> for nuance, not layout.</li>
</ul>
<h2>Accessibility is the guardrail</h2>
<p>Skipping classes doesn't mean skipping contrast checks. I test focus states in both light and dark tokens and verify custom elements expose the right ARIA roles.</p>
<blockquote tone="muted">Classless CSS is a reminder: content first, decoration second.</blockquote>
