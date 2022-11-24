const standardToolbarContainer = [
  ['bold', 'italic', 'underline' { script: 'sub' }, { script: 'super' }, 'code'],
  ['blockquote', 'code-block'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['link', 'image'],
  // [{ 'size': ['small', false, 'large', 'huge'] }],
  // [{ 'color': [] }, { 'background': [] }],

  ['clean'],
  // katex support, imported using cdn
  ['formula']
];

export default standardToolbarContainer;
