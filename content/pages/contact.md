---
layout: page.njk
title: Contact
description: Get in touch with Shekhar Luitel for collaborations, consulting, or speaking.
permalink: /contact/
---
<section>
  <p>You can reach me directly at <a href="mailto:hello@shekharluitel.com.np">hello@shekharluitel.com.np</a>. For projects that need a little more context, use the form below and I'll respond within two working days.</p>
  <form method="post" data-netlify="true" name="contact" data-form>
    <input type="hidden" name="form-name" value="contact">
    <label for="contact-name">Name</label>
    <input id="contact-name" name="name" type="text" autocomplete="name" required>

    <label for="contact-email">Email</label>
    <input id="contact-email" name="email" type="email" autocomplete="email" required>

    <label for="contact-message">Message</label>
    <textarea id="contact-message" name="message" rows="5" required></textarea>

    <button type="submit">Send message</button>
  </form>
</section>
