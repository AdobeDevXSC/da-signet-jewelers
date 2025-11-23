export async function getStructuredContentData(path) {
  const url = `https://mhast-html-to-json.adobeaem.workers.dev/adobedevxsc/da-signet-jewelers${path}?head=false`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error("Failed to fetch structured content data:", response.status);
      return {};
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error fetching structured content data:", error);
    return {};
  }
}


/**
 * Build a promo-banner element from structured JSON content
 * @param {Array} jsonData - The structured content JSON
 * @returns {HTMLElement|null} - The promo banner element or null if invalid
 */
export function buildPromoBanner(jsonData) {
  const bannerBlock = document.createElement('div');
  bannerBlock.className = 'dropin-product-item-card promo-banner';

  try {
    // Navigate through the nested arrays to the "promo-banner" block
    const block = jsonData?.section?.[0]?.[0];
    if (!block || block.name !== 'promo-banner') return null;

    const content = block.content;
    const container = document.createElement('div');
    container.className = 'promo-banner__wrapper';

    content.forEach(row => {
      console.log("row: ", row)
      row.forEach(column => {
        console.log("column: ", column)
        column.forEach(item => {
          switch (item.type) {
            case 'image':
              const img = document.createElement('img');
              img.src = item.src;
              img.alt = item.alt || '';
              img.className = 'promo-banner__image';
              bannerBlock.appendChild(img);
              break;

            case 'heading':
              const h = document.createElement(`h${item.level || 3}`);
              h.textContent = item.text || '';
              h.className = `promo-banner__heading promo-banner__heading--h${item.level}`;
              container.appendChild(h);
              break;

            case 'paragraph':
              const p = document.createElement('p');
              p.className = 'promo-banner__paragraph';

              if (item.text) {
                p.textContent = item.text;
              }

              // Handle inline content like links
              if (item.content && Array.isArray(item.content)) {
                item.content.forEach(inner => {
                  if (inner.type === 'link') {
                    const a = document.createElement('a');
                    a.href = inner.href;
                    a.textContent = inner.text;
                    a.className = 'promo-banner__link';
                    p.appendChild(a);
                  }
                });
              }

              container.appendChild(p);
              break;

            default:
              console.warn('Unknown content type in promo banner:', item.type);
          }
        });
      });
    });
    bannerBlock.appendChild(container);
    return bannerBlock;
  } catch (e) {
    console.error('Error building promo banner:', e);
    return null;
  }
}


// Helper to insert promo banner
export function insertPromoBanner(promoBannerData, index = 0) {
  const grid = document.querySelector('.product-discovery-product-list__grid');
  if (!grid) return;

  const blockName = promoBannerData?.content[0]?.section?.[0]?.[0]?.name;
  // Remove any existing banner
  const old = grid.querySelector(`.dropin-product-item-card.${blockName}`);
  if (old) old.remove();

  // Create the banner element
  const promoBanner = buildPromoBanner(promoBannerData?.content[0]);

  // Re-query children just before inserting
  const cards = [...grid.children];

  // Insert at index if valid, otherwise append
  if (index >= 0 && index < cards.length) {
    grid.insertBefore(promoBanner, cards[index]);
  } else {
    grid.appendChild(promoBanner);
  }
}
