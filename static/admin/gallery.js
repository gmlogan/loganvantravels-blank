// "Gallery" block for the Sveltia CMS rich text editor.
//
// Inside the block is a small nested Markdown editor. Drop (or paste) any number of photos onto
// it: Sveltia uploads them all in one go into the post's own folder and adds one image line per
// photo. Each image keeps its own alt text and caption (the Markdown title, as used elsewhere on
// the site), and any number of galleries can sit anywhere in a post.
//
// Stored in the post body as:
//
//   {{< gallery >}}
//   ![](IMG_4971.webp "Punting about")
//
//   ![](IMG_4969.webp)
//   {{< /gallery >}}
//
// and rendered by layouts/_shortcodes/gallery.html.

const escapeHtml = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

CMS.registerEditorComponent({
  id: 'gallery',
  label: 'Gallery',
  icon: 'photo_library',
  fields: [
    {
      name: 'images',
      label: 'Photos',
      widget: 'markdown',
      hint: 'Drop or paste several photos here at once. Click a photo to add a caption.',
      // Images only: no headings, lists or other blocks inside a gallery
      buttons: [],
      editor_components: ['image'],
      linked_images: false,
      modes: ['rich_text'],
    },
  ],
  // `[\s\S]` makes this a multi-line block; the lazy match keeps two galleries in one post apart.
  pattern: /^\{\{< gallery >\}\}\n(?<images>[\s\S]*?)\n?\{\{< \/gallery >\}\}$/m,
  fromBlock: (match) => ({ images: (match.groups?.images ?? '').trim() }),
  toBlock: ({ images = '' }) => `{{< gallery >}}\n${String(images).trim()}\n{{< /gallery >}}`,
  toPreview: ({ images = '' }) => {
    const imgs = [...String(images).matchAll(/!\[([^\]]*)\]\(([^)\s]+)/g)]
      .map(([, alt, src]) => `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}">`)
      .join('');

    return `<div class="gallery">${imgs}</div>`;
  },
});
