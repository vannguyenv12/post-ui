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

export function setFieldValue(form, queryEl, value) {
  if (!form) return;

  const field = form.querySelector(queryEl);
  if (field) field.value = value;
}

export function setBackgroundImage(parentEl, queryEl, imageUrl) {
  if (!parentEl) return;

  const element = parentEl.querySelector(queryEl);
  if (element) element.style.backgroundImage = `url("${imageUrl}")`;
}

export function randomNumber(n) {
  if (n <= 0) return;

  const random = Math.random() * n;

  return Math.round(random);
}
