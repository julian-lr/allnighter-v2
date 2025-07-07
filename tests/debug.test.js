/**
 * Simple test to debug progress functionality
 */

import { jest } from '@jest/globals';
import { updateProgress } from '../js/utils.js';

// Set up DOM with basic structure manually
document.body.innerHTML = `
  <div id="console" role="log" aria-live="polite">
    <div id="progress-container" role="progressbar" aria-label="File processing progress" aria-valuemin="0" aria-valuemax="100">
      <div id="progress-bar"></div>
      <div id="progress-text">Processing files...</div>
    </div>
  </div>
`;

test('minimal progress test', () => {
  const progressContainer = document.getElementById('progress-container');
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  
  console.log('Initial setup - Container:', !!progressContainer);
  console.log('Initial setup - Bar:', !!progressBar);
  console.log('Initial setup - Text:', !!progressText);
  
  updateProgress(2, 5, 'test-file.txt');
  
  console.log('After update - aria-valuenow:', progressContainer.getAttribute('aria-valuenow'));
  console.log('After update - text content:', progressText.textContent);
  
  expect(progressContainer.getAttribute('aria-valuenow')).toBe('40');
});
