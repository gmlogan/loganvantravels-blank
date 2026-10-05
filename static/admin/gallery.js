// "Gallery" block for the Sveltia CMS rich text editor.
//
// Tap "Upload" (or drop files on desktop) to pick several photos at once; on a phone the
// picker opens the photo library with multi-select. Sveltia uploads them all into the post's
// own folder. Photos can be reordered or removed with the arrows and menu on each thumbnail,
// and any number of galleries can sit anywhere in a post.
//
// Captions are optional: one line per photo, in the same order.
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

const IMAGE_LINE = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"((?:[^"\\]|\\.)*)")?\)/g;

const escapeHtml = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const toList = (photos) => (Array.isArray(photos) ? photos : [photos]).filter(Boolean);

CMS.registerEditorComponent({
  id: 'gallery',
  label: 'Gallery',
  icon: 'photo_library',
  fields: [
    {
      name: 'photos',
      label: 'Photos',
      widget: 'image',
      multiple: true,
      hint: 'Choose several photos at once. Use the arrows on each photo to reorder.',
    },
    {
      name: 'captions',
      label: 'Captions',
      widget: 'text',
      required: false,
      hint: 'Optional. One line per photo, in the same order; leave a line empty for no caption.',
    },
  ],
  // `[\s\S]` makes this a multi-line block; the lazy match keeps two galleries in one post apart.
  pattern: /^\{\{< gallery >\}\}\n(?<body>[\s\S]*?)\n?\{\{< \/gallery >\}\}$/m,
  fromBlock: (match) => {
    const lines = [...(match.groups?.body ?? '').matchAll(IMAGE_LINE)];

    return {
      photos: lines.map(([, src]) => src),
      captions: lines
        .map(([, , caption = '']) => caption.replace(/\\"/g, '"'))
        .join('\n')
        .trimEnd(),
    };
  },
  toBlock: ({ photos = [], captions = '' }) => {
    const captionLines = String(captions ?? '').split('\n');
    const lines = toList(photos).map((src, index) => {
      const caption = (captionLines[index] ?? '').trim().replace(/"/g, '\\"');
      const path = String(src).replaceAll(' ', '%20');

      return caption ? `![](${path} "${caption}")` : `![](${path})`;
    });

    return `{{< gallery >}}\n${lines.join('\n\n')}\n{{< /gallery >}}`;
  },
  toPreview: ({ photos = [] }) => {
    const imgs = toList(photos)
      .map((src) => `<img src="${escapeHtml(src)}" alt="">`)
      .join('');

    return `<div class="gallery">${imgs}</div>`;
  },
});
