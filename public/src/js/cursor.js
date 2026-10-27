document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.addEventListener('mouseover', (e) => {
        cursor.classList.toggle('is-hovering', !!e.target.closest('a, button, .scroll-bar-track'));
    });
});