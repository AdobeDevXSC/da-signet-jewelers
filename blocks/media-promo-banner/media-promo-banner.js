import { loadVideoEmbed } from './media-utils.js';

export default function decorate(block) {
  const container = block.querySelector(':scope > div > div');
  const paragraphs = [...container.querySelectorAll('p')];

  const linkEl = container.querySelector('a');
  const link = linkEl ? linkEl.href.trim() : null;

  const picture = container.querySelector('picture');
  const hasText =
    container.querySelector('h1, h2, h3, h4, h5, h6') ||
    container.querySelector('p:not(:has(picture)):not(:has(a))');

  const isVideo = link && link.match(/\.(mp4|mov|webm)$/i);

  // CASE 1 — VIDEO //
  if (isVideo) {
    container.remove(); // remove original DOM
    const autoplay = block.classList.contains('playonload');
    const background = block.classList.contains('autoplay');

    loadVideoEmbed(block, link, autoplay, background);
    return;
  }

  // CASE 2 — IMAGE WITH TEXT //
  if (picture && hasText) {
    block.classList.add('mpb-has-text');
    const anchor = document.createElement('a');
    anchor.href = link;
    anchor.className = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'mpb-overlay-wrapper';

    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'mpb-img';

    imgWrapper.append(picture);

    const textWrapper = document.createElement('div');
    textWrapper.className = 'mpb-text';

    // Move all non-image content into text wrapper
    paragraphs.forEach(p => {
      if (p.querySelector('a')) this.style.display = 'none';
      if (!p.querySelector('picture')) textWrapper.append(p);
    });
    container.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(h => textWrapper.prepend(h));

    wrapper.append(imgWrapper);
    wrapper.append(textWrapper);

    block.innerHTML = '';
    anchor.append(wrapper)
    block.append(anchor);
    return;
  }

  // CASE 3 — IMAGE ONLY (wrap with link) //
  if (picture && !hasText && link) {
    const anchor = document.createElement('a');
    anchor.href = link;
    anchor.className = 'mpb-img-link';

    anchor.append(picture);

    block.innerHTML = '';
    block.append(anchor);
    return;
  }
}
