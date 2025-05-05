class TimerComponent extends HTMLElement {
    connectedCallback() {
        const timer_text = this.getAttribute('text');
        const timer_number = this.getAttribute('number');
        this.innerHTML = `
            <link rel="stylesheet" href="/assets/css/fontawesome.min.css">
            <link rel="stylesheet" href="/assets/css/style.css">
            <link rel="stylesheet" href="/customer/home/home.css">
            <div class="banner-timer">
                <p class="banner-timer-number">${timer_number}</p>
                <p class="banner-timer-text">${timer_text}</p>
            </div>
      `;
    }
}
customElements.define('banner-timer', TimerComponent);