export function scrambleChars(elements, opts = {}) {
  const {
    duration = 0.4,
    alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()",
    interval = 25,
  } = opts;

  elements.forEach((node) => {
    const original = node.textContent || "";
    let iterations = 0;
    const maxIterations = Math.floor(Math.random() * 6) + 3;

    const id = window.setInterval(() => {
      node.textContent = alphabet[Math.floor(Math.random() * alphabet.length)];
      iterations++;
      if (iterations >= maxIterations) {
        window.clearInterval(id);
        node.textContent = original;
      }
    }, interval);

    window.setTimeout(() => {
      window.clearInterval(id);
      node.textContent = original;
    }, duration * 1000);
  });
}
