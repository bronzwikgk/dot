// demo.js
// Demo of compose and render using datasets

import { compose_and_render, validate_component, get_allowed_children } from './render.js';

// Define schema for a simple page
const page_schema = {
  type: 'main',
  id: 'editor',
  children: [
    {
      type: 'aside',
      id: 'sidebar',
      children: [
        {
          type: 'section',
          children: [
            { type: 'h2', content: 'Navigation' },
            {
              type: 'nav',
              children: [
                { type: 'a', attributes: { href: '#' }, content: 'Home' },
                { type: 'a', attributes: { href: '#' }, content: 'About' }
              ]
            }
          ]
        }
      ]
    },
    {
      type: 'article',
      id: 'book_01',
      children: [
        { type: 'header', id: 'tabs' },
        {
          type: 'section',
          id: 'editor_area',
          children: [
            {
              type: 'section',
              children: [
                { type: 'h1', content: 'My Document' },
                { type: 'p', content: 'This is a composed document.' }
              ]
            },
            {
              type: 'section',
              children: [
                { type: 'h2', content: 'Section 1' },
                {
                  type: 'ul',
                  children: [
                    { type: 'li', content: 'Item 1' },
                    { type: 'li', content: 'Item 2' }
                  ]
                }
              ]
            }
          ]
        },
        { type: 'footer', content: 'Footer content' }
      ]
    }
  ]
};

// Compose and render
const result = compose_and_render(page_schema);

if (result.errors.length === 0) {
  console.log('Composition successful!');
  console.log('HTML output:');
  console.log(result.html);
} else {
  console.error('Composition errors:', result.errors);
}

// Validate components
console.log('\nComponent validation:');
console.log('main:', validate_component('main'));
console.log('article:', validate_component('article'));
console.log('custom:', validate_component('custom'));

// Get allowed children
console.log('\nAllowed children for article:');
console.log(get_allowed_children('article'));
