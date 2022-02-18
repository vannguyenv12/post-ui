export function setTextContent(parentEl, queryEl, text) {
  if (!parentEl) return;

  const element = parentEl.querySelector(queryEl);
  if (element) element.textContent = text;
}

export function truncateText(text, maxLength) {
  if (text <= maxLength) return text;

  // truncate
  return `${text.slice(0, maxLength - 1)}…`;
}
